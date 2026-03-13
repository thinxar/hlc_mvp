import { FaFileCircleXmark } from "react-icons/fa6";
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

    const handleFileClick = (file: any) => {
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

    const groupedByDocketType = data.reduce((acc: any, item: any) => {
        const type = item.pdfFiles?.docketType?.document || '--';

        const fileName = item.pdfFiles?.fileName;

        if (!acc[type]) {
            acc[type] = [];
        }

        if (fileName.toLowerCase().includes("bond") || fileName.toLowerCase().includes("proposal")) {
            acc[type].unshift(item);
        } else {
            acc[type].push(item);
        }

        acc[type].sort(
            (a: any, b: any) =>
                new Date(b.pdfFiles.date).getTime() - new Date(a.pdfFiles.date).getTime()
        );
        return acc;
    }, {});

    const docketTypes = Object.keys(groupedByDocketType);

    // const fileName = selectedFile?.pdfFiles?.fileName || "";
    // const type = fileName.toLowerCase().includes("bond") ? "Policy" : "Proposal";
    // const defaultValue: any = docketTypes.includes(type) ? type : docketTypes[0];

    const handleSelectAll = () => {
        if (selectedFileIds.length === data.length) {
            setSelectedFileIds([]);
        } else {
            const ids = data.map((f: any) => f.pdfFiles.id);
            setSelectedFileIds(ids);
        }
    };

    return (<>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-500 ">Documents</h2>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">
                    {data.length}
                </span>
            </div>
            {(data.length > 0 && type === 'REV') &&
                <button onClick={handleSelectAll} className="text-xs cursor-pointer font-bold text-indigo-600 hover:underline">
                    {selectedFileIds.length === data.length ? 'Deselect All' : 'Select All'}
                </button>}
        </div>

        {data.length !== 0 ? (
            <div className="space-y-2 mt-2 max-h-80 overflow-y-auto">
                {docketTypes.map((docketType) => {
                    return (
                        <div >
                            <div className="space-y-2">
                                {groupedByDocketType[docketType].map((file: any) => (
                                    <PolicyFileItemList
                                        key={file.pdfFiles.id}
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
            <div className="flex-1 grid place-items-center">
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

