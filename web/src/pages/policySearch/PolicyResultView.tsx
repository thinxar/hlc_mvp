import { StringFormat } from '@palmyralabs/ts-utils';
import { useEffect, useState } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { ServiceEndpoint } from '../../config/ServiceEndpoint';
import { handleError } from '../../wire/ErrorHandler';
import { useFormstore } from '../../wire/StoreFactory';
import { PdfFileItem } from './section/PdfFileItem';
import { PdfViewer } from './section/PdfViewer';

const PolicyResultView = () => {
    const params = useParams();
    const [data, setData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const endpoint = StringFormat(ServiceEndpoint.policy.searchPolicyByIdApi, { policyId: params?.policyId });

    const BASE_URL = `${window.location.origin}/api/palmyra`;
    const endPoint = StringFormat(ServiceEndpoint.policy.getFileApi, { policyId: params?.policyId, fileId: selectedFile?.pdfFiles?.id });

    const pdfUrl = BASE_URL + endPoint;

    useEffect(() => {
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
    }, [])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[30%_70%] lg:grid-cols-[20%_80%] xl:grid-cols-[20%_80%] 2xl:grid-cols-[20%_80%]
        transition-all duration-300 ease-in-out gap-4 px-5 mx-auto w-full h-[calc(100vh-40px)]">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 flex flex-col overflow-auto">
                <div className="flex items-center gap-1.5 mb-4">
                    <IoChevronBackOutline onClick={() => { window.history.back() }} className="text-slate-300 cursor-pointer" />
                    <div className="text-lg font-bold text-slate-300">Policy Number: </div>
                    <div className="text-xl text-slate-100 font-semibold">{data[0]?.id || '--'}</div>
                </div>
                {data.length != 0 ?
                    <div className="space-y-3 overflow-y-auto">
                        {data.map((file: any, idx: number) => (
                            <PdfFileItem
                                key={idx}
                                file={file}
                                isSelected={selectedFile?.pdfFiles?.fileName === file?.pdfFiles?.fileName}
                                onClick={() => setSelectedFile(file)}
                                fileUrl={pdfUrl}
                            />
                        ))}
                    </div>
                    : <div className='text-white grid place-items-center'>No File Found</div>}
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-auto">
                <PdfViewer file={selectedFile}  fileUrl={pdfUrl}/>
            </div>
        </div>
    );
}

export { PolicyResultView };
