import { Accordion, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { StringFormat, topic } from '@palmyralabs/ts-utils';
import { useEffect, useState } from 'react';
import { FaUpload } from "react-icons/fa";
import { useLocation, useParams } from 'react-router-dom';
import { FileDropZone } from '../../components/fileUpload/FileDropZone';
import { ServiceEndpoint } from '../../config/ServiceEndpoint';
import { handleError } from '../../wire/ErrorHandler';
import { useFormstore } from '../../wire/StoreFactory';
import { FileItemList } from './section/FileItemList';
import { FileViewer } from './section/FileViewer';
import { PolicyData } from './section/PolicyData';

const PolicyResultView = () => {
    const params = useParams();
    const location = useLocation();
    const [data, setData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [_uploadedFile, setUploadedFile] = useState<any[]>([]);
    const policyData = location?.state?.policyData;
    const BASE_URL = `${window.location.origin}/api/palmyra`;

    const endpoint = StringFormat(ServiceEndpoint.policy.searchPolicyByIdApi + "?_limit=-1", { policyId: params?.policyId });
    const filePoint = StringFormat(ServiceEndpoint.policy.getFileApi, { policyId: params?.policyId, fileId: selectedFile?.pdfFiles?.id });
    const pdfUrl = BASE_URL + filePoint;

    const handleFetch = () => {
        useFormstore(endpoint).query({ filter: {} }).then((d: any) => {
            const mappedPolicies: any = d?.result?.map((item: any) => ({
                id: item.policyId?.policyNumber,
                pdfFiles: {
                    id: item.id,
                    name: item.name,
                    fileName: item.fileName,
                    size: item.fileSize,
                    date: item.date,
                    type: item.fileType,
                    docketType: item.docketType,
                    path: item.path || ''
                }
            }));
            setSelectedFile(mappedPolicies[0])
            setData(mappedPolicies);

        }).catch(() => {
            handleError
        });
    }

    useEffect(() => {
        handleFetch()
    }, [])

    const handleKeyClose = (event: any) => {
        if (event.keyCode === 27) {
            close();
        }
    }

    useEffect(() => {
        const handle = topic.subscribe("fileUpload", (_t: string, data: any) => {
            if (data) {
                handleFetch()
            }
        });
        return () => {
            topic.unsubscribe(handle);
        };
    }, []);

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
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(item);
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[40%_60%] lg:grid-cols-[31%_69%] xl:grid-cols-[23%_77%] 2xl:grid-cols-[22%_78%]
        transition-all duration-300 ease-in-out gap-4 px-5 mx-auto w-full h-[calc(100vh-40px)]">
            <div className=" overflow-y-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-hidden">
                <div className=''>
                    <PolicyData data={policyData} />
                </div>
                <div className="flex-1  mt-2 p-3">
                    {data.length !== 0 ? (
                        <Accordion variant="filled" radius="md" className="h-full flex flex-col">
                            <div className="space-y-3 flex-1  pr-2">
                                {Object.keys(groupedByDocketType).map((docketType) => (
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
                                                            policyId={params?.policyId}
                                                            file={file}
                                                            isSelected={selectedFile?.pdfFiles?.id === file?.pdfFiles?.id}
                                                            onClick={() => handleFileClick(file)}
                                                            fileUrl={pdfUrl}
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
                </div>
                <div className="sticky bottom-0 bg-Color backdrop-blur-md p-2 rounded-t-lg flex items-center justify-center">
                    <button
                        onClick={open}
                        className="cursor-pointer text-sm font-medium bg-yellow-400 text-sky-800 px-4 py-2 flex gap-2 items-center rounded-sm
                  transition duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                        <FaUpload fontSize={14} /> Upload
                    </button>
                </div>
                <Modal opened={opened} onClose={close} onKeyDown={handleKeyClose} centered size={"40%"} title="File Upload">
                    <FileDropZone onClose={close} setUploadedFile={setUploadedFile} policyId={params?.policyId} />
                </Modal>
            </div >

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-auto">
                <FileViewer file={selectedFile} fileUrl={pdfUrl} key={selectedFile?.pdfFiles?.id} />
            </div>
        </div >
    );
}

export { PolicyResultView };