import { topic } from '@palmyralabs/ts-utils';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { fieldConfig } from 'config/TitleConfig';
import { useMemo, useState } from 'react';
import { FiArrowLeft, FiCheck, FiInfo, FiX } from 'react-icons/fi';
import { handleError } from 'wire/ErrorHandler';
import { Toast } from 'wire/errorToast';
import { useFormstore } from 'wire/StoreFactory';
import { PolicyFileViewer } from './fileview/PolicyFileViewer';

interface policyData {
    policyData: any
    data: any,
    policyId: any,
    selectedFile: any,
    setSelectedFile: (file: any) => void;
    type: "REV" | "AND" | "PBV"
}

const PolicySubmitSection = (props: policyData) => {
    const { policyData, data, policyId, selectedFile, setSelectedFile, type } = props;

    const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]);

    const submitApi = ServiceEndpoint.customView.submitApi;

    const selectedFileNames = useMemo(() => {
        const idSet = new Set(selectedFileIds);
        return data
            .filter((item: any) => idSet.has(item?.pdfFiles?.id))
            .map((item: any) => ({
                id: item.pdfFiles?.id,
                fileName: item.pdfFiles?.fileName
            }));

    }, [data, selectedFileIds]);

    const handleRemove = (id: number) => {
        setSelectedFileIds((prev: number[]) =>
            prev.filter((itemId) => itemId !== id)
        );
    };

    const handleSubmit = (status: 'approved' | 'rejected') => {
        const payload = {
            policyId: policyId,
            status,
            fileIds: selectedFileIds
        };

        useFormstore(submitApi).post(payload).then((_d) => {
            setSelectedFileIds([]);
            topic.publish("fileUpload", "fileUpload")
        }).catch(handleError);
        Toast.onSaveSuccess(`${selectedFileIds.length} Document${selectedFileIds.length > 1 ? 's' : ''} have been ${status.toLocaleUpperCase()} Successfully !!!`)

    };

    return (
        <div>
            <section className="border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-[#004C97] p-2 mb-0">
                            <div className='flex items-center gap-2'>
                                <h2 className="text-sm font-bold text-white ml-1">Policy Overview</h2>
                            </div>
                            {(type === "REV") &&
                                <button
                                    onClick={() => window.history.back()}
                                    className="text-sm bg-white text-gray-800 cursor-pointer flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-100"
                                >
                                    <FiArrowLeft />
                                    Back
                                </button>}
                        </div>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-100/80 dark:bg-gray-800">
                            {fieldConfig[type]?.map((field: any) => (
                                <DetailItem
                                    key={field.key}
                                    label={field.label}
                                    value={policyData?.[field.key]}
                                    Icon={field.icon}
                                    color={field.color}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="border-b border-dashed border-gray-400/60 pb-1 mb-3" />

                    <div className='rounded'>
                        <PolicyFileViewer data={data} policyId={policyId}
                            selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                            selectedFileIds={selectedFileIds} type={type}
                            setSelectedFileIds={setSelectedFileIds} />
                    </div>
                    {type === "REV" && <>
                        <div className="border-b border-dashed border-gray-200 pb-1 mb-3" />
                        <div className="mx-2">
                            <div className="space-y-4 pb-3">
                                <div className="space-y-2">
                                    <div className='flex justify-between items-center'>
                                        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-300 ml-1">
                                            {type == 'REV' ? 'Policy Overview' : `${'Proposal No'}/${policyData?.proposalNo}`}
                                        </h2>
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                                                {selectedFileIds.length} {selectedFileIds.length === 1 ? 'Doc' : 'Docs'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="max-h-20 overflow-y-scroll" >
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {selectedFileNames.map((file: any) => (
                                            <span
                                                key={file?.id}
                                                className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md"
                                            >
                                                {file?.fileName}

                                                <button onClick={() => handleRemove(file.id)}
                                                    className="ml-1 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3 mx-1">
                                    <button
                                        onClick={() => handleSubmit('rejected')}
                                        disabled={selectedFileIds.length === 0}
                                        className={`w-full cursor-pointer py-2 rounded-xl font-semibold  shadow-md 
                                                      flex items-center justify-center gap-2
                                                      transition-all duration-200 ease-in-out disabled:cursor-not-allowed
                                                      ${selectedFileIds.length === 0
                                                ? 'bg-gray-300 cursor-not-allowed opacity-70'
                                                : 'bg-red-100/90 text-red-700 hover:text-white hover:bg-red-500/80 hover:shadow-xl active:scale-95'
                                            }`}
                                    >
                                        <FiX className="w-4 h-4" />
                                        Reject
                                    </button>

                                    <button
                                        onClick={() => handleSubmit('approved')}
                                        disabled={selectedFileIds.length === 0}
                                        className={`w-full cursor-pointer py-2 rounded-xl font-semibold  shadow-md
                                                     flex items-center justify-center gap-2
                                                     transition-all duration-200 ease-in-out disabled:cursor-not-allowed
                                                     ${selectedFileIds.length === 0
                                                ? 'bg-gray-300 cursor-not-allowed opacity-70'
                                                : 'bg-green-100/90 text-green-700 hover:text-white hover:bg-green-600/80 hover:shadow-xl active:scale-95'
                                            }`}
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        Approve
                                    </button>
                                </div>

                            </div>
                        </div>
                    </>}
                </div>
            </section>

            {type === "REV" &&
                <div className="p-2 m-2 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        <FiInfo className="w-4 h-4" />
                        <h3 className="text-xs font-bold">Note:</h3>
                    </div>
                    <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside font-medium">
                        <li>SR number will be recorded in system while approving / rejecting documents.</li>
                        <li>Please click on SUBMIT button to proceed selected documents.</li>
                    </ul>
                </div>}
        </div >
    )
}

export { PolicySubmitSection };


function DetailItem({
    label,
    value,
    Icon,
    color
}: {
    label: string;
    value: string;
    Icon?: any;
    color?: string;
}) {
    return (
        <div className="flex items-start gap-3 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition">
            {Icon && (
                <div className={`p-2 rounded-md ${color}`}>
                    <Icon size={16} />
                </div>
            )}

            <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500/80 dark:text-gray-400">
                    {label}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                    {value || "--"}
                </p>
            </div>
        </div>
    );
}