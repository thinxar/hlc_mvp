// import { Accordion } from "@mantine/core"
// import { NeftFileItemList } from "./NeftFileItemList";

// interface FileProps {
//     data: any,
//     policyId: any,
//     selectedFile: any,
//     setSelectedFile: (file: any) => void;
// }

// const NeftDocumentList = ({ data, policyId, selectedFile, setSelectedFile }: FileProps) => {

//     const handleFileClick = (file: any) => {
//         if (selectedFile?.pdfFiles?.id === file?.pdfFiles?.id) {
//             setSelectedFile(null);
//             setTimeout(() => {
//                 setSelectedFile(file);
//             }, 0);
//         } else {
//             setSelectedFile(file);
//         }
//     };

//     const groupedByDocketType = data.reduce((acc: any, item: any) => {
//         const type = item.pdfFiles?.docketType?.document || '--';

//         const fileName = item.pdfFiles?.fileName;

//         if (!acc[type]) {
//             acc[type] = [];
//         }

//         if (fileName.toLowerCase().includes("bond") || fileName.toLowerCase().includes("proposal")) {
//             acc[type].unshift(item);
//         } else {
//             acc[type].push(item);
//         }

//         acc[type].sort(
//             (a: any, b: any) =>
//                 new Date(b.pdfFiles.date).getTime() - new Date(a.pdfFiles.date).getTime()
//         );
//         return acc;
//     }, {});

//     const docketTypes = Object.keys(groupedByDocketType);

//     const fileName = selectedFile?.pdfFiles?.fileName || "";
//     const type = fileName.toLowerCase().includes("bond") ? "Policy" : "Proposal";
//     const defaultValue: any = docketTypes.includes(type) ? type : docketTypes[0];
//     return (<div className="p-2">
//         {data.length !== 0 ? (
//             <Accordion
//                 variant="separated"
//                 radius="md"
//                 className="h-full flex flex-col"
//                 defaultValue={defaultValue}
//                 styles={{
//                     chevron: { color: '#1f2937' }
//                 }}
//             >
//                 <div className="space-y-1 flex-1 pr-1">
//                     {docketTypes.map((docketType) => {
//                         const count = groupedByDocketType[docketType]?.length || 0;

//                         return (
//                             <Accordion.Item key={docketType} value={docketType}>

//                                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-3">

//                                     <Accordion.Control>
//                                         <div className="flex items-center justify-between text-gray-800 pr-2">

//                                             <div className="flex items-center gap-2">
//                                                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>

//                                                 <span className="text-md font-semibold tracking-wide">
//                                                     {docketType}
//                                                 </span>
//                                             </div>

//                                             <div className="bg-blue-100 text-blue-700 px-2 py-0 rounded-full">
//                                                 <span className="text-sm font-semibold">{count}</span>
//                                             </div>

//                                         </div>
//                                     </Accordion.Control>

//                                     <Accordion.Panel>
//                                         <div className="pb-2">
//                                             {groupedByDocketType[docketType].map((file: any) => (
//                                                 <NeftFileItemList
//                                                     key={file.pdfFiles.id}
//                                                     policyId={policyId}
//                                                     file={file}
//                                                     isSelected={selectedFile?.pdfFiles?.id === file?.pdfFiles?.id}
//                                                     onClick={() => handleFileClick(file)}
//                                                 />
//                                             ))}
//                                         </div>
//                                     </Accordion.Panel>

//                                 </div>
//                             </Accordion.Item>
//                         );
//                     })}
//                 </div>
//             </Accordion>
//         ) : (
//             <div className='text-white grid place-items-center flex-1'>No File Found</div>
//         )}
//     </div>
//     )
// }

// export { NeftDocumentList }

import { Accordion } from "@mantine/core";
import { NeftFileItemList } from "./NeftFileItemList";
import { FolderOpen } from "lucide-react";

interface FileProps {
    data: any;
    policyId: any;
    selectedFile: any;
    setSelectedFile: (file: any) => void;
}

const NeftDocumentList = ({
    data,
    policyId,
    selectedFile,
    setSelectedFile,
}: FileProps) => {
    const handleFileClick = (file: any) => {
        if (selectedFile?.pdfFiles?.id === file?.pdfFiles?.id) {
            setSelectedFile(null);
            setTimeout(() => setSelectedFile(file), 0);
        } else {
            setSelectedFile(file);
        }
    };

    const groupedByDocketType = data.reduce((acc: any, item: any) => {
        const type = item.pdfFiles?.docketType?.document || "--";
        const fileName = item.pdfFiles?.fileName;
        if (!acc[type]) acc[type] = [];
        if (
            fileName.toLowerCase().includes("bond") ||
            fileName.toLowerCase().includes("proposal")
        ) {
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
    const fileName = selectedFile?.pdfFiles?.fileName || "";
    const type = fileName.toLowerCase().includes("bond") ? "Policy" : "Proposal";
    const defaultValue: any = docketTypes.includes(type) ? type : docketTypes[0];
    const totalFiles = data.length;

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">

            <div className="px-4 pt-5 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
                            <FolderOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                                Documents
                            </h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {docketTypes.length} {docketTypes.length === 1 ? "category" : "categories"}
                            </p>
                        </div>
                    </div>
                    {totalFiles > 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {totalFiles} files
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
                {data.length !== 0 ? (
                    <Accordion
                        variant="filled"
                        radius="md"
                        defaultValue={defaultValue}
                        styles={{
                            chevron: { color: "#6b7280" },
                            item: {
                                border: "none",
                                background: "transparent",
                                marginBottom: "6px"
                            },
                            label:{
                                padding:'6px'
                            }
                        }}
                    >
                        {docketTypes.map((docketType) => {
                            const count = groupedByDocketType[docketType]?.length || 0;

                            return (
                                <Accordion.Item key={docketType} value={docketType}>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">

                                        <Accordion.Control
                                            className="px-3 py-0 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-xl"
                                        >
                                            <div className="flex items-center justify-between py-0.5 pr-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                    <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                                                        {docketType}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                                    {count}
                                                </span>
                                            </div>
                                        </Accordion.Control>

                                        <Accordion.Panel>
                                            <div className="px-1 pb-1 pt-0 flex flex-col gap-1">
                                                {groupedByDocketType[docketType].map((file: any) => (
                                                    <NeftFileItemList
                                                        key={file.pdfFiles.id}
                                                        policyId={policyId}
                                                        file={file}
                                                        isSelected={
                                                            selectedFile?.pdfFiles?.id === file?.pdfFiles?.id
                                                        }
                                                        onClick={() => handleFileClick(file)}
                                                    />
                                                ))}
                                            </div>
                                        </Accordion.Panel>

                                    </div>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">No files found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export { NeftDocumentList };