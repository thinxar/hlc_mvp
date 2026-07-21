import { Loader } from '@mantine/core';
import axios from 'axios';
import DOMPurify from 'dompurify';
import mammoth from 'mammoth';
import { useEffect, useRef, useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import * as XLSX from 'xlsx';
import { ViewerControls, useViewerTransform } from './ViewerControls';
import './OfficeViewer.css';

type Kind = 'docx' | 'doc' | 'excel' | 'csv' | 'unknown';

interface Sheet {
    name: string;
    html: string;
}

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

export const isOfficeFile = (file: any): boolean => getKind(file) !== 'unknown';

interface IOptions {
    endPoint: string;
    file: any;
}

const OfficeViewer = ({ endPoint, file }: IOptions) => {
    const [html, setHtml] = useState('');
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [activeSheet, setActiveSheet] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { style, zoomIn, zoomOut, rotate, reset } = useViewerTransform(1);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const kind = getKind(file);

    const handleWheel = (e: any) => {
        const el = scrollRef.current;
        if (!el) return;
        const canScrollX = el.scrollWidth > el.clientWidth;
        const canScrollY = el.scrollHeight > el.clientHeight;
        if (canScrollX && (e.shiftKey || !canScrollY)) {
            el.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    };

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            setError('');
            setSheets([]);
            setHtml('');
            setActiveSheet(0);

            if (kind === 'doc') {
                setError('Preview is not available for legacy .doc files. Please download to view.');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(endPoint, { responseType: 'arraybuffer' });
                const buffer: ArrayBuffer = res.data;

                if (kind === 'docx') {
                    const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
                    if (active) setHtml(DOMPurify.sanitize(result.value));
                } else if (kind === 'excel') {
                    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
                    const parsed: Sheet[] = wb.SheetNames.map((name) => ({
                        name,
                        html: DOMPurify.sanitize(XLSX.utils.sheet_to_html(wb.Sheets[name])),
                    }));
                    if (active) setSheets(parsed);
                } else if (kind === 'csv') {
                    const text = new TextDecoder('utf-8').decode(new Uint8Array(buffer));
                    const wb = XLSX.read(text, { type: 'string' });
                    if (active) setHtml(DOMPurify.sanitize(XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]])));
                }
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

    const isExcel = kind === 'excel';
    const activeHtml = isExcel ? sheets[activeSheet]?.html ?? '' : html;

    return (
        <div className="w-full h-[calc(100vh-90px)] flex flex-col">
            <div className="flex justify-end p-2 shrink-0">
                <ViewerControls onZoomIn={zoomIn} onZoomOut={zoomOut} onRotate={rotate} onReset={reset} />
            </div>

            {isExcel && (
                <div className="excel-tab-bar shrink-0 flex items-stretch border-t border-gray-300 bg-gray-100">
                    <button
                        type="button"
                        title="Previous sheet"
                        onClick={() => setActiveSheet((i) => Math.max(0, i - 1))}
                        disabled={activeSheet === 0}
                        className="px-1.5 flex items-center text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent border-r border-gray-300"
                    >
                        <MdChevronLeft fontSize={20} />
                    </button>

                    <div className="flex items-stretch gap-0.5 overflow-x-auto flex-1">
                        {sheets.map((sheet, i) => (
                            <button
                                key={sheet.name + i}
                                type="button"
                                title={sheet.name}
                                onClick={() => setActiveSheet(i)}
                                className={`excel-tab whitespace-nowrap px-4 py-1.5 text-sm border-r border-gray-300 transition-colors ${
                                    i === activeSheet
                                        ? 'bg-white text-green-700 font-semibold border-t-2 border-t-green-600 -mt-px'
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {sheet.name}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        title="Next sheet"
                        onClick={() => setActiveSheet((i) => Math.min(sheets.length - 1, i + 1))}
                        disabled={activeSheet === sheets.length - 1}
                        className="px-1.5 flex items-center text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent border-l border-gray-300"
                    >
                        <MdChevronRight fontSize={20} />
                    </button>

                    <span className="px-3 flex items-center text-xs text-gray-500 whitespace-nowrap border-l border-gray-300">
                        Sheet {activeSheet + 1} of {sheets.length}
                    </span>
                </div>
            )}

             <div
                ref={scrollRef}
                onWheel={handleWheel}
                className={`office-viewer office-scroll flex-1 min-h-0 bg-white rounded-xl ${
                    isExcel || kind === 'csv'
                        ? 'overflow-y-auto overflow-x-scroll office-scroll-x'
                        : 'overflow-auto'
                }`}
            >
                <div
                    className={`p-5 ${isExcel || kind === 'csv' ? 'inline-block min-w-full align-top' : 'block'}`}
                    style={style}
                    dangerouslySetInnerHTML={{ __html: activeHtml }}
                />
            </div>
        </div>
    );
};

export { OfficeViewer };
