import { Loader } from '@mantine/core';
import axios from 'axios';
import DOMPurify from 'dompurify';
import mammoth from 'mammoth';
import { useEffect, useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { ViewerControls, useViewerTransform } from './ViewerControls';
import './OfficeViewer.css';

type Kind = 'docx' | 'doc' | 'excel' | 'csv' | 'unknown';

/** Decide how to render from the file's MIME type, falling back to its extension. */
const getKind = (file: any): Kind => {
    const name = (file?.fileName || file?.name || '').toLowerCase();
    const type = (file?.fileType || '').toLowerCase();
    const ext = name.includes('.') ? name.split('.').pop() : '';

    if (ext === 'docx' || type.includes('wordprocessingml')) return 'docx';
    if (ext === 'doc' || type === 'application/msword') return 'doc';
    if (ext === 'xlsx' || ext === 'xls' || type.includes('spreadsheetml') || type.includes('ms-excel'))
        return 'excel';
    if (ext === 'csv' || type === 'text/csv') return 'csv';
    return 'unknown';
};

/** True when OfficeViewer can handle this file (used by FileViewer to route). */
export const isOfficeFile = (file: any): boolean => getKind(file) !== 'unknown';

interface IOptions {
    endPoint: string;
    file: any;
}

/**
 * Renders DOCX / XLS / XLSX / CSV inline by fetching the authenticated file and
 * converting it to HTML client-side (mammoth for docx, SheetJS for spreadsheets).
 * Legacy binary .doc has no reliable browser renderer -> download fallback.
 */
const OfficeViewer = ({ endPoint, file }: IOptions) => {
    const [html, setHtml] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { style, zoomIn, zoomOut, rotate, reset } = useViewerTransform(1);

    const kind = getKind(file);

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            setError('');

            if (kind === 'doc') {
                setError('Preview is not available for legacy .doc files. Please download to view.');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(endPoint, { responseType: 'arraybuffer' });
                const buffer: ArrayBuffer = res.data;

                let out = '';
                if (kind === 'docx') {
                    const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
                    out = result.value;
                } else if (kind === 'excel') {
                    const wb = XLSX.read(buffer, { type: 'array' });
                    out = wb.SheetNames.map((sheetName) => {
                        const table = XLSX.utils.sheet_to_html(wb.Sheets[sheetName]);
                        return `<div class="excel-sheet-title">${sheetName}</div>${table}`;
                    }).join('');
                } else if (kind === 'csv') {
                    const text = new TextDecoder('utf-8').decode(new Uint8Array(buffer));
                    const wb = XLSX.read(text, { type: 'string' });
                    out = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);
                }

                if (active) setHtml(DOMPurify.sanitize(out));
            } catch (e) {
                if (active) setError('Failed to load document preview.');
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [endPoint, kind]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Loader type="bars" color="blue" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
                <FaFileDownload className="w-12 h-12 opacity-50" />
                <p className="text-center max-w-sm">{error}</p>
                <a
                    href={endPoint}
                    download={file?.fileName}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                >
                    <FaFileDownload /> Download
                </a>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-90px)] flex flex-col">
            <div className="flex justify-end p-2 shrink-0">
                <ViewerControls onZoomIn={zoomIn} onZoomOut={zoomOut} onRotate={rotate} onReset={reset} />
            </div>
            <div className="office-viewer flex-1 overflow-auto bg-white rounded-xl">
                <div className="p-5" style={style} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
    );
};

export { OfficeViewer };
