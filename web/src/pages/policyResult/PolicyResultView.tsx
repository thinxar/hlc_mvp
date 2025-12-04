import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { StringFormat, topic } from '@palmyralabs/ts-utils';
import { FileDropZone } from 'components/fileUpload/FileDropZone';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { useEffect, useState } from 'react';
import { FaUpload } from "react-icons/fa";
import { IoChevronBackOutline } from 'react-icons/io5';
import { useLocation, useParams } from 'react-router-dom';
import { handleKeyAction } from 'utils/FormateDate';
import { handleError } from 'wire/ErrorHandler';
import { useFormstore } from 'wire/StoreFactory';
import { FileListViewer } from '../policySearch/section/FileListViewer';
import { FileViewer } from '../policySearch/section/FileViewer';
import { PolicyData } from '../policySearch/section/PolicyData';
import { PolicyHeaderSection } from './section/PolicyHeaderSection';

const PolicyResultView = () => {
    const params = useParams();
    const location = useLocation();
    const [data, setData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedStamp, setSelectedStamp] = useState<any>()
    const [opened, { open, close }] = useDisclosure(false);
    const policyData = location?.state?.policyData;
    const BASE_URL = `${window.location.origin}/api/palmyra`;
    const [_selectedStamps, setSelectedStamps] = useState<any>({});
    const endpoint = StringFormat(ServiceEndpoint.policy.searchPolicyByIdApi, { policyId: params?.policyId });
    const filePoint = StringFormat(ServiceEndpoint.policy.getFileApi, { policyId: params?.policyId, fileId: selectedFile?.pdfFiles?.id });
    const fileDetailPoint = StringFormat(ServiceEndpoint.policy.getFileDetailApi, { policyId: params?.policyId, fileId: selectedFile?.pdfFiles?.id });
    const pdfUrl = BASE_URL + filePoint;
    const [stampDataArr, setStampDataArr] = useState<any>()

    var dataFromUploadEvent: any = '';

    const handleFetch = () => {
        useFormstore(endpoint)
            .query({ limit: -1 })
            .then((d: any) => {
                const mappedPolicies: any[] = d?.result?.map((item: any) => ({
                    id: item.policyId?.policyNumber,
                    pdfFiles: {
                        id: item.id,
                        name: item.name,
                        fileName: item.fileName,
                        size: item.fileSize,
                        date: item.createdOn,
                        fileType: item.fileType,
                        docketType: item.docketType,
                        path: item.path || ''
                    },
                    stamps: item?.fixedStamp ?? [],
                })) ?? [];

                if (!mappedPolicies.length) return;

                setData(mappedPolicies);

                if (dataFromUploadEvent != '') {
                    const latestFile = mappedPolicies.reduce((a, b) =>
                        new Date(a.pdfFiles.date) > new Date(b.pdfFiles.date) ? a : b
                    );
                    setSelectedFile(latestFile);
                    return;
                }

                const updatedFile = mappedPolicies.find(
                    (f: any) => f?.pdfFiles?.id === selectedFile?.pdfFiles?.id
                );
                if (updatedFile) {
                    setSelectedFile((prev: any) => ({
                        ...prev,
                        ...updatedFile,
                        stamps: updatedFile?.stamps ?? prev?.stamps
                    }));
                }
                else {
                    const bondFile = mappedPolicies.find((f: any) =>
                        f?.pdfFiles?.fileName?.toLowerCase()?.includes('bond')
                    );
                    const proposalFile = mappedPolicies.find((f: any) =>
                        f?.pdfFiles?.fileName?.toLowerCase()?.includes('proposal')
                    );
                    setSelectedFile(bondFile || proposalFile);
                }
            })
            .catch(handleError);
    };

    // const a = useFormstore(fileDetailPoint, {}).get({}).then((item) => {
    //     const b = {
    //         id: item.policyId?.policyNumber,
    //         pdfFiles: {
    //             id: item.id,
    //             name: item.name,
    //             fileName: item.fileName,
    //             size: item.fileSize,
    //             date: item.createdOn,
    //             fileType: item.fileType,
    //             docketType: item.docketType,
    //             path: item.path || ''
    //         },
    //         stamps: item?.fixedStamp ?? [],
    //     }
    //     console.log(b);
    // }).catch((err) => console.log(err))

    useEffect(() => {
        handleFetch()
    }, [])

    useEffect(() => {
        const handle = topic.subscribe("fileUpload", (_t: string, data: any) => {
            if (data) {
                dataFromUploadEvent = data;
                handleFetch()
            }
        });
        return () => {
            topic.unsubscribe(handle);
        };
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[40%_60%] lg:grid-cols-[31%_69%] xl:grid-cols-[23%_77%] 2xl:grid-cols-[22%_78%]
        transition-all duration-300 ease-in-out gap-4 px-5 mx-auto w-full h-[calc(100vh-85px)]">
            <div className="policy-sec overflow-y-auto bg-gray/5 backdrop-blur-xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
                <div className="pr-bg-color sticky top-0 z-50 text-xl font-bold p-2 rounded-t-lg flex items-center gap-2 text-white">
                    <IoChevronBackOutline
                        onClick={() => window.history.back()}
                        className="cursor-pointer"
                    />
                    Policy / {policyData.policyNumber}
                </div>
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
                <Modal opened={opened} onClose={close} onKeyDown={handleKeyAction("Escape", close)}
                    centered size={"lg"} title="File Upload" closeOnClickOutside={false}>
                    <FileDropZone onClose={close} policyId={params?.policyId} />
                </Modal>
            </div>
            <div className="bg-gray-100 backdrop-blur-xl rounded-2xl border border-gray-200 flex flex-col overflow-auto">
                <PolicyHeaderSection data={policyData} selectedStamp={setSelectedStamp} id={selectedFile?.pdfFiles?.id}
                    stampData={selectedFile?.stamps} setSelectedFile={setSelectedFile} file={selectedFile?.pdfFiles} fildata={data} setStampDataArr={setStampDataArr} stampDataArr={stampDataArr} />
                <FileViewer file={selectedFile?.pdfFiles} fileUrl={pdfUrl} key={selectedFile?.pdfFiles?.id} selectedStamp={selectedStamp}
                    stampData={selectedFile} setSelectedFile={setSelectedFile} setSelectedStamps={setSelectedStamps}
                    setSelectedStamp={setSelectedStamp} selectedfile={selectedFile} handleFetch={handleFetch} stampDataArr={stampDataArr}
                    setStampDataArr={setStampDataArr} fileDetailPoint={fileDetailPoint} />
            </div>
        </div>
    );
}

export { PolicyResultView };