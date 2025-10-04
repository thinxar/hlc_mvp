import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { StringFormat, topic } from '@palmyralabs/ts-utils';
import { useEffect, useState } from 'react';
import { FaUpload } from "react-icons/fa";
import { useLocation, useParams } from 'react-router-dom';
import { FileDropZone } from 'components/fileUpload/FileDropZone';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { handleError } from 'wire/ErrorHandler';
import { useFormstore } from 'wire/StoreFactory';
import { FileListViewer } from './section/FileListViewer';
import { FileViewer } from './section/FileViewer';
import { PolicyData } from './section/PolicyData';
import { IoClose } from 'react-icons/io5';
import { EndorseTemplatePicker } from '../endorsements/EndorseTemplatePicker';

const PolicyResultView = () => {
    const params = useParams();
    const location = useLocation();
    const [data, setData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [endorseOpened, { open: endorseOpen, close: endorseClose }] = useDisclosure(false);
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
            const file = mappedPolicies.find((f: any) =>
                f?.pdfFiles?.fileName?.includes('Bond')
            );
            setSelectedFile(file)
            setData(mappedPolicies);
        }).catch(handleError);
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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[40%_60%] lg:grid-cols-[31%_69%] xl:grid-cols-[23%_77%] 2xl:grid-cols-[22%_78%]
        transition-all duration-300 ease-in-out gap-4 px-5 mx-auto w-full h-[calc(100vh-55px)]">
            <div className=" overflow-y-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-hidden">
                <div className=''>
                    <PolicyData data={policyData} />
                </div>
                <div className="flex-1  mt-2 p-3">
                    <FileListViewer data={data} policyId={params?.policyId} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                </div>
                <div className="sticky bottom-0 bg-Color backdrop-blur-md p-2 rounded-t-lg flex items-center justify-center">
                    <button onClick={open}
                        className="cursor-pointer text-sm font-medium bg-yellow-400 text-sky-800 px-4 py-2 flex gap-2 items-center rounded-sm
                         transition duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                        <FaUpload fontSize={14} /> Upload
                    </button>
                </div>
                <Modal opened={opened} onClose={close} onKeyDown={handleKeyClose} centered size={"40%"} title="File Upload">
                    <FileDropZone onClose={close} policyId={params?.policyId} />
                </Modal>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-auto">
                <div className="p-2 flex justify-between">
                    <div></div>
                    <div className='flex items-center gap-3'>
                        <div className='text-gray-100 cursor-pointer hover:underline'
                            onClick={endorseOpen}>
                            Create Endorsement</div>
                        <IoClose fontSize={20} className='text-white cursor-pointer hover:bg-white/20'
                            onClick={() => window.history.back()} />
                    </div>
                </div>
                <FileViewer file={selectedFile} fileUrl={pdfUrl} key={selectedFile?.pdfFiles?.id} />
            </div>


            <Modal opened={endorseOpened} onClose={endorseClose} onKeyDown={handleKeyClose} centered
                size={"lg"} title={`Endorsement`}>
                <EndorseTemplatePicker data={policyData}/>
            </Modal>
        </div>
    );
}

export { PolicyResultView };