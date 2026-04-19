import { StringFormat, topic } from '@palmyralabs/ts-utils';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { useEffect, useState } from 'react';
import { LuListCollapse } from "react-icons/lu";
import { useLocation, useSearchParams } from 'react-router-dom';
import { PolicyNotFound } from 'src/common/pages/PolicyNotFound';
import { FileViewer } from 'src/pages/policySearch/section/FileViewer';
import { handleError } from 'wire/ErrorHandler';
import { useFormstore } from 'wire/StoreFactory';
import { PolicySubmitSection } from './PolicySubmitSection';
import { PolicyViewHeader } from './PolicyViewHeader';

const DocumentView = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const appName: any = searchParams.get("appname");
    const appType = appName?.toLowerCase() as "rev" | "and" | "pbv";

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toggle, setToggle] = useState<any>(false);
    const [policyDataX, setPolicyData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedStamp, setSelectedStamp] = useState<any>()
    const [_selectedStamps, setSelectedStamps] = useState<any>({});
    const [stampDataArr, setStampDataArr] = useState<any>()

    const policyData = location?.state?.policyData || policyDataX;
    const BASE_URL = `${window.location.origin}/api/palmyra`;


    const params = new URLSearchParams(searchParams);
    params.forEach((value, key) => {
        if (!value || value === "null" || value === "undefined") {
            params.delete(key);
        }
    });

    const endpoint =
        ServiceEndpoint.customView[appType].policyFileApi + "?" + params.toString();

    const filePoint = StringFormat(ServiceEndpoint.customView[appType].getFileApi, { policyId: policyData?.id, fileId: selectedFile?.pdfFiles?.id });
    const fileDetailPoint = StringFormat(ServiceEndpoint.policy.getFileDetailApi, { policyId: policyData?.id, fileId: selectedFile?.pdfFiles?.id });
    const pdfUrl = BASE_URL + filePoint;

    var dataFromUploadEvent: any = '';

    const handleFetch = () => {
        setLoading(true);
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
                        status: item.status,
                        path: item.path || ''
                    },
                    stamps: item?.fixedStamp ?? [],
                })) ?? [];

                if (!mappedPolicies.length) return;
                setPolicyData(d?.result[0]?.policyId)
                setData(mappedPolicies);

                const latestFile = mappedPolicies.reduce((a, b) =>
                    new Date(a.pdfFiles.date) > new Date(b.pdfFiles.date) ? a : b
                );

                if (dataFromUploadEvent != '') {

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
                    setSelectedFile(latestFile || bondFile || proposalFile);
                }
            })
            .catch(handleError)
            .finally(() => {
                setLoading(false);
            });
    };

    const handleToggle = () => {
        setToggle((prev: any) => !prev);
    }

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                {/* <Loader /> */}
            </div>
        );
    }

    if (!policyData && Object.keys(policyData).length > 0) {
        return <PolicyNotFound />;
    }



    return (<>
        {policyData && Object.keys(policyData).length > 0 ?
            <div className="flex gap-4 px-5 mx-auto w-full h-[calc(100vh-25px)] m-3">
                <div className="">
                    <div onClick={handleToggle}
                        className="cursor-pointer p-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <LuListCollapse
                            className={`transition-transform duration-300 ease-in-out ${toggle ? '' : 'rotate-180'}`}
                        />
                    </div>
                </div>
                <div className={`overflow-y-auto ${!toggle ? 'w-100' : 'w-0 opacity-0'} transition-all duration-500 ease-in-out  bg-gray/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden`}>
                    <PolicySubmitSection policyData={policyData} data={data} policyId={policyData?.id}
                        selectedFile={selectedFile} setSelectedFile={setSelectedFile} type={appName} />
                </div>
                <div className="flex-1 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-auto">
                    <PolicyViewHeader fileName={selectedFile?.pdfFiles?.fileName} />
                    <FileViewer file={selectedFile?.pdfFiles} fileUrl={pdfUrl} key={selectedFile?.pdfFiles?.id} selectedStamp={selectedStamp}
                        stampData={selectedFile} setSelectedFile={setSelectedFile} setSelectedStamps={setSelectedStamps}
                        setSelectedStamp={setSelectedStamp} selectedfile={selectedFile} handleFetch={handleFetch} stampDataArr={stampDataArr}
                        setStampDataArr={setStampDataArr} fileDetailPoint={fileDetailPoint} />
                </div>
            </div> :
            <>
                <PolicyNotFound />
            </>}
    </>);
}

export { DocumentView };



// const Loader = () => (
//     <div className="flex flex-col items-center justify-center gap-6">
//         <div className="relative">
//             <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />

//             <div className="absolute inset-0 flex items-center justify-center text-indigo-600 animate-pulse">
//                 <GoShieldCheck size={32} />
//             </div>
//         </div>

//         <div className="text-center space-y-2">
//             <h3 className="text-lg font-bold text-slate-900 tracking-tight">Securing Your Data</h3>
//             <div className="flex items-center justify-center gap-1.5">
//                 <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
//                 <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
//                 <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
//             </div>
//             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">Processing Policy Request</p>
//         </div>
//     </div>
// );