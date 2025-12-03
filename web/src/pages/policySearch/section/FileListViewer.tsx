import { Accordion } from "@mantine/core"
import { FileItemList } from "./FileItemList"

interface FileProps {
    data: any,
    policyId: any,
    selectedFile: any,
    setSelectedFile: (file: any) => void;
}

const FileListViewer = ({ data, policyId, selectedFile, setSelectedFile }: FileProps) => {

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

    const fileName = selectedFile?.pdfFiles?.fileName || "";
    const type = fileName.toLowerCase().includes("bond") ? "Policy" : "Proposal";
    const defaultValue: any = docketTypes.includes(type) ? type : docketTypes[0];
    return (<>
        {data.length !== 0 ? (
            <Accordion variant="filled" radius="md" className="h-full flex flex-col" defaultValue={defaultValue}>
                <div className="space-y-2 flex-1 pr-1">
                    {docketTypes.map((docketType) => {
                        const count = groupedByDocketType[docketType]?.length || 0;
                        return (
                            <Accordion.Item key={docketType} value={docketType}>
                                <div className='bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 px-3'>
                                    <Accordion.Control>
                                        <div className="flex items-center justify-between text-white pr-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-linear-to-r from-blue-400 to-gray-400 animate-pulse"></div>
                                                <span className="text-md font-semibold tracking-wide">
                                                    {docketType}
                                                </span>
                                            </div>
                                            {/* <div>{count}</div> */}
                                            <div className="bg-linear-to-r from-blue-500/20 to-blue-500/20 px-2 py-0 rounded-full">
                                                <span className="text-sm font-semibold">{count}</span>
                                            </div>
                                        </div>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        {/* <div className="max-h-[300px] overflow-auto pr-2"> */}
                                        <div className="pb-5">
                                            {groupedByDocketType[docketType].map((file: any) => (
                                                <FileItemList
                                                    key={file.pdfFiles.id}
                                                    policyId={policyId}
                                                    file={file}
                                                    isSelected={selectedFile?.pdfFiles?.id === file?.pdfFiles?.id}
                                                    onClick={() => handleFileClick(file)}
                                                />
                                            ))}
                                        </div>
                                    </Accordion.Panel>
                                </div>
                            </Accordion.Item>
                        )
                    })}
                </div>
            </Accordion>
        ) : (
            <div className='text-white grid place-items-center flex-1'>No File Found</div>
        )}
    </>
    )
}

export { FileListViewer }