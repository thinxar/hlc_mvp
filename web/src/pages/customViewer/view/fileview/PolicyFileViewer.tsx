import { useMemo, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaFileCircleXmark } from "react-icons/fa6";
import { FiFileText } from "react-icons/fi";
import { MdOutlinePendingActions } from "react-icons/md";
import { PolicyFileItemList } from "./PolicyFileItemList";

interface FileProps {
    data: any,
    policyId: any,
    selectedFile: any,
    setSelectedFile: (file: any) => void;
    setSelectedFileIds: (file: any) => void;
    selectedFileIds: any
    type: "REV" | "AND" | "PBV"
}

const PolicyFileViewer = ({ data, policyId, type, selectedFile, setSelectedFile, setSelectedFileIds, selectedFileIds }: FileProps) => {
    const [clickedFileId, setClickedFileId] = useState(new Set());

    const totalDocs = data.length;
    const viewedDocs = clickedFileId.size;
    const pendingDocs = totalDocs - viewedDocs;

    const handleFileClick = (file: any) => {

        setClickedFileId(prev => {
            const next = new Set(prev);
            !next.has(file.pdfFiles.id) && next.add(file.pdfFiles.id);
            return next;
        });

        if (selectedFile?.pdfFiles?.id === file?.pdfFiles?.id) {
            setSelectedFile(null);
            setTimeout(() => {
                setSelectedFile(file);
            }, 0);
        } else {
            setSelectedFile(file);
        }
    };

    const handleFileSelect = (file: any) => {
        const id = file.pdfFiles.id;

        setSelectedFileIds((prev: any) =>
            prev.includes(id)
                ? prev.filter((i: any) => i !== id)
                : [...prev, id]
        );
    };

    const statusPriority: Record<string, number> = {
        pending: 1,
        approved: 2,
        rejected: 3,
    };

    const groupedByDocketType = data.reduce((acc: any, item: any) => {
        const type = item.pdfFiles?.docketType?.document || '--';

        if (!acc[type]) {
            acc[type] = [];
        }

        acc[type].push(item);

        acc[type].sort((a: any, b: any) => {
            const statusA = a.pdfFiles?.status?.toLowerCase() || '';
            const statusB = b.pdfFiles?.status?.toLowerCase() || '';

            const priorityA = statusPriority[statusA] ?? 99;
            const priorityB = statusPriority[statusB] ?? 99;

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            return (
                new Date(b.pdfFiles.date).getTime() -
                new Date(a.pdfFiles.date).getTime()
            );
        });

        return acc;
    }, {});

    const docketTypes = Object.keys(groupedByDocketType);

    const pendingIds = useMemo(() => {
        const ids: number[] = [];

        for (let i = 0; i < data.length; i++) {
            const file = data[i]?.pdfFiles;
            if (file?.status === 'pending') {
                ids.push(file.id);
            }
        }

        return ids;
    }, [data]);

    const handleSelectAll = () => {
        if (selectedFileIds.length === pendingIds.length) {
            setSelectedFileIds([]);
        } else {
            setSelectedFileIds(pendingIds);
        }
    };

    return (<>
        <div className="flex items-center justify-between p-2 rounded-t-lg ">
            <div className="flex items-center gap-3 text-sm ">
                <div className="flex items-center gap-1 bg-green-100 p-1 px-1.5 rounded-lg">
                    <FiFileText className="w-4 h-4 opacity-80 text-green-700/90" />
                    <div className="text-xs flex gap-1">
                        <span className="text-xs text-gray-600">Docs</span>
                        <span className="text-xs font-semibold text-green-700">{totalDocs}</span>
                    </div>
                </div>
                <span className="opacity-40">|</span>
                <div className="flex items-center gap-1 bg-blue-100 p-1 px-1.5 rounded-lg">
                    <FaEye className="w-4 h-4 opacity-80 text-blue-700" />
                    <div className="text-xs flex gap-1">
                        <span className="text-xs text-gray-600">Read</span>
                        <span className="text-xs font-semibold text-blue-700">{viewedDocs}</span>
                    </div>
                </div>
                <span className="opacity-40">|</span>
                <div className="flex items-center gap-1 bg-yellow-100/90 p-1 px-1.5 rounded-lg">
                    <MdOutlinePendingActions className="w-4 h-4 opacity-80 text-yellow-600" />
                    <div className="text-xs flex gap-1">
                        <span className="text-xs text-gray-600">Unread</span>
                        <span className="text-xs font-semibold text-yellow-700">{pendingDocs}</span>
                    </div>
                </div>
            </div>

            {(data.length > 0 && type === 'REV') &&
                <button onClick={handleSelectAll} className="text-xs cursor-pointer font-bold text-blue-700 hover:underline">
                    {selectedFileIds.length === pendingIds.length ? 'Deselect All' : 'Select All'}
                </button>}
        </div>

        {data.length !== 0 ? (
            <div className={`space-y-2 py-1 px-2.5 ${type === "REV" ? 'max-h-80' : 'max-h-100'} overflow-y-auto`}>
                {docketTypes.map((docketType) => {
                    return (
                        <div >
                            <div className="space-y-2">
                                {groupedByDocketType[docketType].map((file: any) => (
                                    <PolicyFileItemList
                                        key={file.pdfFiles.id}
                                        clickedFileId={clickedFileId}
                                        policyId={policyId}
                                        file={file}
                                        type={type}
                                        isSelected={selectedFileIds?.includes(file?.pdfFiles?.id)}
                                        onClick={() => handleFileClick(file)}
                                        handleFileSelect={() => handleFileSelect(file)}
                                        selectedFile={selectedFile}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="flex-1 grid place-items-center pt-3">
                <div
                    className="flex flex-col items-center gap-2"
                >
                    <div className="relative w-10 h-10 bg-gray-100 border border-gray-200 rounded-xl flex items-end justify-center pb-1 shadow-md">
                        <FaFileCircleXmark size={28} className="text-gray-400" />
                    </div>

                    <div className="flex flex-col items-center gap-2 text-center">
                        <h2 className="text-gray-700 text-md font-semibold tracking-tight">
                            No File Found
                        </h2>
                    </div>
                </div>
            </div>
        )}
    </>
    )
}

export { PolicyFileViewer };

