import { Modal, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { topic } from '@palmyralabs/ts-utils';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { fieldConfig } from 'config/TitleConfig';
import React, { useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiClock, FiInfo, FiXCircle } from 'react-icons/fi';
import { SubmissionModal } from 'src/common/component/SubmissionModal';
import { handleError } from 'wire/ErrorHandler';
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

    const [status, setStatus] = useState<any>('pending');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    const submitApi = ServiceEndpoint.customView.submitApi;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        open();
        setIsSubmitted(true);

        const payload = {
            policyId: policyId,
            status,
            fileIds: selectedFileIds
        };

        useFormstore(submitApi).post(payload).then((_d) => {
            setSelectedFileIds([]);
            topic.publish("fileUpload", "fileUpload")
        }).catch(handleError)

        setTimeout(() => setIsSubmitted(false), 3000);
    };

    const statusOptions: any = [
        {
            value: "pending",
            label: "Pending",
            icon: <FiClock size={16} />,
        },
        {
            value: "rejected",
            label: "Reject",
            icon: <FiXCircle size={16} />,
        },
        {
            value: "approved",
            label: "Approve",
            icon: <FiCheckCircle size={16} />,
        },
    ];

    return (
        <div>
            <section className="border-r border-gray-200 bg-white flex flex-col overflow-hidden">

                <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-[#004C97] p-2 mb-0">
                            <div className='flex items-center gap-2'>
                                <h2 className="text-sm font-bold text-white ml-1">
                                    {type == 'REV' ? 'Policy Overview' : `${'Proposal No'}/${policyData?.proposalNo}`}
                                </h2>
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
                        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-100/80">
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
                            <form onSubmit={handleSubmit} className="space-y-4 pb-3">
                                <div className="space-y-2">
                                    <div className='flex justify-between items-center'>
                                        <h2 className="text-sm font-bold text-gray-500">Selected Documents</h2>
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                                                {selectedFileIds.length} {selectedFileIds.length === 1 ? 'Doc' : 'Docs'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Select allowDeselect={false}
                                                label="Status"
                                                value={status} checkIconPosition="right"
                                                onChange={setStatus}
                                                data={statusOptions}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={selectedFileIds.length === 0}
                                    className={`cursor-pointer
                  w-full py-2.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                  ${selectedFileIds.length === 0
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}
                `}
                                >
                                    {isSubmitted ? <FiCheckCircle className="w-6 h-6" /> : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </>}
                </div>
            </section>

            {type === "REV" &&
                <div className="p-2 m-2 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-blue-700">
                        <FiInfo className="w-4 h-4" />
                        <h3 className="text-xs font-bold">Note:</h3>
                    </div>
                    <ul className="text-xs text-blue-800 space-y-1 list-decimal list-inside font-medium">
                        <li>SR number will be recorded in system while approving / rejecting documents.</li>
                        <li>Please click on SUBMIT button to proceed selected documents.</li>
                    </ul>
                </div>}


            <Modal opened={opened} onClose={close} centered size={"md"} radius={"lg"}
                styles={{ body: { padding: '0px' } }} withCloseButton={false}>
                <SubmissionModal onClose={close} />
            </Modal>
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
        <div className="flex items-start gap-3 p-1.5 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition">
            {Icon && (
                <div className={`p-2 rounded-md ${color}`}>
                    <Icon size={16} />
                </div>
            )}

            <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500/80">
                    {label}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                    {value || "--"}
                </p>
            </div>
        </div>
    );
}