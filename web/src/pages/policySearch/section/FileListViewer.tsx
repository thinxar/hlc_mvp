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

        if (fileName.toLowerCase().includes("bond")) {
            acc[type].unshift(item);
        } else {
            acc[type].push(item);
        }
        return acc;
    }, {});

    const docketTypes = Object.keys(groupedByDocketType);

    return (<>
        {data.length !== 0 ? (
            <Accordion variant="filled" radius="md" className="h-full flex flex-col" defaultValue={docketTypes[0]}>
                <div className="space-y-3 flex-1  pr-2">
                    {docketTypes.map((docketType) => (
                        <Accordion.Item key={docketType} value={docketType}>
                            <div className='bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 '>
                                <Accordion.Control>
                                    <div className='text-white mb-2'>{docketType}</div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {/* <div className="max-h-[300px] overflow-auto pr-2"> */}
                                    <div>
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
                    ))}
                </div>
            </Accordion>
        ) : (
            <div className='text-white grid place-items-center flex-1'>No File Found</div>
        )}
    </>
    )
}

export { FileListViewer }