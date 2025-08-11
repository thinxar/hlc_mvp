import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { StringFormat, topic } from '@palmyralabs/ts-utils';
import { useEffect, useState } from 'react';
import { FaUpload } from "react-icons/fa";
import { IoChevronBackOutline } from 'react-icons/io5';
import { useLocation, useParams } from 'react-router-dom';
import { FileDropZone } from '../../components/fileUpload/FileDropZone';
import { ServiceEndpoint } from '../../config/ServiceEndpoint';
import { handleError } from '../../wire/ErrorHandler';
import { useFormstore } from '../../wire/StoreFactory';
import { FileItemList } from './section/FileItemList';
import { FileViewer } from './section/FileViewer';

const PolicyResultView = () => {
    const params = useParams();
    const location = useLocation();
    const [data, setData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [_uploadedFile, setUploadedFile] = useState<any[]>([]);
    const endpoint = StringFormat(ServiceEndpoint.policy.searchPolicyByIdApi, { policyId: params?.policyId });

    const BASE_URL = `${window.location.origin}/api/palmyra`;
    const endPoint = StringFormat(ServiceEndpoint.policy.getFileApi, { policyId: params?.policyId, fileId: selectedFile?.pdfFiles?.id });

    const pdfUrl = BASE_URL + endPoint;
    const fileUploadEndPoint = StringFormat(ServiceEndpoint.policy.fileUploadApi, { policyId: params?.policyId })

    const handleFetch = () => {
        useFormstore(endpoint).get({}).then((d) => {
            const mappedPolicies: any = d.map((item: any) => ({
                id: item.policyId?.policyNumber,
                pdfFiles: {
                    id: item.id,
                    name: item.name,
                    fileName: item.fileName,
                    size: item.fileSize,
                    date: item.date,
                    type: item.fileType,
                    path: item.path || ''
                }
            }));
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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[30%_70%] lg:grid-cols-[20%_80%] xl:grid-cols-[20%_80%] 2xl:grid-cols-[20%_80%]
        transition-all duration-300 ease-in-out gap-4 px-5 mx-auto w-full h-[calc(100vh-40px)]">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 flex flex-col overflow-auto">
                <div className="flex items-center gap-1.5 mb-4">
                    <IoChevronBackOutline onClick={() => { window.history.back() }} className="text-slate-300 cursor-pointer" />
                    <div className="text-lg font-bold text-slate-300">Policy Number: </div>
                    <div className="text-xl text-slate-100 font-semibold">{data[0]?.id || location?.state?.policyNumber || '--'}</div>
                </div>
                {data.length != 0 ?
                    <div className="space-y-3 overflow-y-auto">
                        {data.map((file: any, idx: number) => (
                            <FileItemList
                                key={idx}
                                policyId={params?.policyId}
                                file={file}
                                isSelected={selectedFile?.pdfFiles?.id === file?.pdfFiles?.id}
                                onClick={() => handleFileClick(file)}
                                fileUrl={pdfUrl}
                            />
                        ))}
                    </div>
                    : <div className='text-white grid place-items-center'>No File Found</div>}
                <div className='w-full p-7'>
                    <button className='fixed bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer text-sm font-medium bg-yellow-400 text-sky-800 px-4 py-2
                        flex gap-2 items-center rounded-sm transition duration-300 hover:scale-105 shadow-lg hover:shadow-xl'
                        onClick={open}>
                        <FaUpload fontSize={14} />Upload
                    </button>
                </div>

                <Modal opened={opened} onClose={close} onKeyDown={handleKeyClose} centered
                    size={"40%"} zIndex={999} title="File Upload">
                    <FileDropZone onClose={close} setUploadedFile={setUploadedFile} endPoint={fileUploadEndPoint} />
                </Modal>

            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-auto">
                <FileViewer file={selectedFile} fileUrl={pdfUrl} key={selectedFile?.pdfFiles?.id} />
            </div>
        </div>
    );
}

export { PolicyResultView };