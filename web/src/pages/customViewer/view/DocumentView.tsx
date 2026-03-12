import { StringFormat, topic } from '@palmyralabs/ts-utils';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FileViewer } from 'src/pages/policySearch/section/FileViewer';
import { handleError } from 'wire/ErrorHandler';
import { useFormstore } from 'wire/StoreFactory';
import { PolicySubmitSection } from './PolicySubmitSection';
import { PolicyViewHeader } from './PolicyViewHeader';

const DocumentView = () => {
    const params = useParams();
    const location = useLocation();
    const [data, setData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedStamp, setSelectedStamp] = useState<any>()
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
                        status:item.status,
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
        transition-all duration-300 ease-in-out gap-4 px-5 mx-auto w-full h-[calc(100vh-25px)] m-3">
            <div className="overflow-y-auto bg-gray/5 backdrop-blur-xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
                <PolicySubmitSection policyData={policyData} data={data} policyId={params?.policyId}
                    selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
            </div>
            <div className="bg-gray-100 backdrop-blur-xl rounded-2xl border border-gray-200 flex flex-col overflow-auto">
                <PolicyViewHeader fileName={selectedFile?.pdfFiles?.fileName}/>
                <FileViewer file={selectedFile?.pdfFiles} fileUrl={pdfUrl} key={selectedFile?.pdfFiles?.id} selectedStamp={selectedStamp}
                    stampData={selectedFile} setSelectedFile={setSelectedFile} setSelectedStamps={setSelectedStamps}
                    setSelectedStamp={setSelectedStamp} selectedfile={selectedFile} handleFetch={handleFetch} stampDataArr={stampDataArr}
                    setStampDataArr={setStampDataArr} fileDetailPoint={fileDetailPoint} />
            </div>
        </div>
    );
}

export { DocumentView };

