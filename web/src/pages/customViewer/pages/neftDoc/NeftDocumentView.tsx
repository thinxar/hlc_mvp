import { StringFormat } from '@palmyralabs/ts-utils';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { useEffect, useState } from 'react';
import { LuListCollapse } from 'react-icons/lu';
import { useLocation, useSearchParams } from 'react-router-dom';
import { PolicyNotFound } from 'src/common/pages/PolicyNotFound';
import { FileViewer } from 'src/pages/policySearch/section/FileViewer';
import { handleError } from 'wire/ErrorHandler';
import { useFormstore } from 'wire/StoreFactory';
import { PolicyViewHeader } from '../../view/PolicyViewHeader';
import { NeftDocumentList } from './NeftDocumentList';
import NeftPolicyDetailForm from './NeftPolicyDetailForm';

const NeftDocumentView = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const appName: any = searchParams.get("appname");
    const appType = appName?.toLowerCase() as "rev" | "and" | "pbv" | "neft";

    const [data, setData] = useState<any[]>([]);
    const [policyId, setPolicyId] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [toggle, setToggle] = useState<any>(false);
    const [policyDataX, setPolicyData] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedStamp, setSelectedStamp] = useState<any>();
    const [_selectedStamps, setSelectedStamps] = useState<any>({});
    const [stampDataArr, setStampDataArr] = useState<any>();

    const filterData = JSON.parse(searchParams.get("filterData") || "{}");
    const policyData = location?.state?.policyData || policyDataX;
    const BASE_URL = `${window.location.origin}/api/palmyra`;

    const params = new URLSearchParams(searchParams);
    params.forEach((value, key) => {
        if (!value || value === "null" || value === "undefined") {
            params.delete(key);
        }
    });

    const policyDetailApi =
        ServiceEndpoint.customView.neft.policyDetailApi +
        '?policyNumber=' +
        filterData?.policy;

    const filePoint = StringFormat(
        ServiceEndpoint.customView[appType].getFileApi,
        { policyId: policyData?.id, fileId: selectedFile?.pdfFiles?.id }
    );
    const fileDetailPoint = StringFormat(
        ServiceEndpoint.policy.getFileDetailApi,
        { policyId: policyData?.id, fileId: selectedFile?.pdfFiles?.id }
    );
    const pdfUrl = BASE_URL + filePoint;

    var dataFromUploadEvent: any = '';

    const fetchFiles = (id: any) => {
        if (!id) return;

        setLoading(true);

        const endpoint = StringFormat(
            ServiceEndpoint.customView.neft.fileByPolicyIdApi,
            { policyId: id }
        );

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
                        path: item.path || '',
                    },
                    stamps: item?.fixedStamp ?? [],
                })) ?? [];

                if (!mappedPolicies.length) return;

                setPolicyData(d?.result[0]?.policyId);
                setData(mappedPolicies);

                let latestFile;
                if (mappedPolicies[0]?.pdfFiles?.docketType?.document === 'Photograph') {
                    latestFile = mappedPolicies[0];
                } else {
                    latestFile = mappedPolicies.reduce((a, b) =>
                        new Date(a.pdfFiles.date) > new Date(b.pdfFiles.date) ? a : b
                    );
                }

                if (dataFromUploadEvent !== '') {
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
                        stamps: updatedFile?.stamps ?? prev?.stamps,
                    }));
                } else {
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
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!filterData?.policy) return;

        useFormstore(policyDetailApi, {}, '').get({}).then((d: any) => {
            const id = d[0]?.id;
            if (!id) {
                setLoading(false);
                return;
            }
            setPolicyId(id);
            setPolicyData(d[0]);
            fetchFiles(id);
        }).catch(handleError);
    }, [filterData?.policy]);


    const handleFetch = () => {
        fetchFiles(policyId);
    };

    const handleToggle = () => setToggle((prev: any) => !prev);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1279px)');
        const handler = (e: MediaQueryListEvent) => setToggle(e.matches);
        setToggle(mq.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                {/* <Loader /> */}
            </div>
        );
    }

    const hasPolicyData = policyData && Object.keys(policyData).length > 0;
    return (
        <>
            {hasPolicyData ? (
                <div className="flex gap-4 px-5 mx-auto w-full h-[calc(100vh-25px)] m-3">
                    <div>
                        <div
                            onClick={handleToggle}
                            className="cursor-pointer p-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <LuListCollapse
                                className={`transition-transform duration-300 ease-in-out ${toggle ? '' : 'rotate-180'}`}
                            />
                        </div>
                    </div>

                    <div
                        className={`overflow-y-auto ${!toggle ? 'w-100' : 'w-0 opacity-0'} transition-all duration-500 ease-in-out bg-gray/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden`}
                    >
                        <NeftPolicyDetailForm policy={policyData} />
                        <NeftDocumentList
                            data={data}
                            policyId={policyData?.id}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                        />
                    </div>

                    <div className="flex-1 backdrop-blur-xl rounded-2xl border dark:border-gray-800 border-gray-200 flex flex-col overflow-auto">
                        <PolicyViewHeader fileName={selectedFile?.pdfFiles?.fileName} />
                        <FileViewer
                            file={selectedFile?.pdfFiles}
                            fileUrl={pdfUrl}
                            key={selectedFile?.pdfFiles?.id}
                            selectedStamp={selectedStamp}
                            stampData={selectedFile}
                            setSelectedFile={setSelectedFile}
                            setSelectedStamps={setSelectedStamps}
                            setSelectedStamp={setSelectedStamp}
                            selectedfile={selectedFile}
                            handleFetch={handleFetch}
                            stampDataArr={stampDataArr}
                            setStampDataArr={setStampDataArr}
                            fileDetailPoint={fileDetailPoint}
                        />
                    </div>
                </div>
            ) : (
                <PolicyNotFound proposalNo={filterData?.policy} type="neft" />
            )}
        </>
    );
};

export { NeftDocumentView };