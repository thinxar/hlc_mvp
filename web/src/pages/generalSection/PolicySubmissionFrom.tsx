import { Button } from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { ISaveForm, PalmyraNewForm } from "@palmyralabs/rt-forms";
import { ErrorMsgConfig } from "config/ErrorMsgConfig";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { useRef, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ServerLookup } from "templates/mantineForm";
import { getPolicyInfo } from "utils/LocalStorageInfo";

type myType = 'rev' | 'and' | 'pbv';

interface submissionProps {
    type: myType;
}

const errorMsg = ErrorMsgConfig.form;

const revLookupEndpoint = ServiceEndpoint.customView.rev.Lookup;
const anaLookupEndpoint = ServiceEndpoint.customView.and.Lookup;
const pbvLookupEndpoint = ServiceEndpoint.customView.pbv.Lookup;

const PolicySubmissionFrom = (props: submissionProps) => {
    const { type } = props;

    const toNavigate = useNavigate();
    const policyUser = getPolicyInfo();

    const formRef = useRef<ISaveForm>(null);

    const [isValid, setValid] = useState<boolean>(false);
    const [currentYear, setCurrentYear] = useState<any>(null);

    const handleSubmit = () => {
        const requestData = formRef?.current?.getData();

        const officeCode = requestData?.OfficeCode?.name;
        const serialNo = requestData?.serialNumber?.name;

        let url = '';

        if (type === 'rev') {
            url = `/app/customViewer/NG?officecode=${officeCode}&srno=${serialNo}&appname=REV`;
        } else if (type === 'and') {
            const year = new Date(currentYear).getFullYear();
            url = `/app/customViewer/NG?officecode=${officeCode}&year=${year}&appname=AND`;
        } else if (type === 'pbv') {
            const year = new Date(currentYear).getFullYear();
            url = `/app/customViewer/NG?officecode=${officeCode}&year=${year}&appname=PBV`;
        }

        window.open(url, '_blank');
    };

    const renderFormFields = () => {
        switch (type) {
            case 'rev':
                return (
                    <>
                        <ServerLookup
                            required
                            attribute="OfficeCode"
                            label="Office Code"
                            placeholder="Select OfficeCode"
                            queryOptions={{ endPoint: revLookupEndpoint.officeCode }}
                            invalidMessage={errorMsg.mandatory}
                            lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                        />

                        <ServerLookup
                            attribute="serialNumber"
                            required
                            label="Approver SR"
                            placeholder="Select S.No"
                            invalidMessage={errorMsg.mandatory}
                            queryOptions={{ endPoint: revLookupEndpoint.serialNo }}
                            lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                        />
                    </>
                );

            case 'and':
                return (
                    <>
                        <ServerLookup
                            attribute="OfficeCode"
                            required
                            label="Office Code"
                            placeholder="Select OfficeCode"
                            invalidMessage={errorMsg.mandatory}
                            queryOptions={{ endPoint: anaLookupEndpoint.officeCode }}
                            lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                        />
                        <div className="px-3">
                            <YearPickerInput
                                required
                                label="Select Year"
                                placeholder="Select Year"
                                value={currentYear}
                                valueFormat="YYYY"
                                onChange={(date: any) => {
                                    setCurrentYear(date);
                                    setValid(!!date);
                                }}
                            />
                        </div>
                    </>
                );

            case 'pbv':
                return (
                    <>
                        <ServerLookup
                            attribute="OfficeCode"
                            required
                            label="Office Code"
                            placeholder="Select OfficeCode"
                            invalidMessage={errorMsg.mandatory}
                            queryOptions={{ endPoint: pbvLookupEndpoint.officeCode }}
                            lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                        />
                        <div className="px-3">
                            <YearPickerInput
                                required
                                label="Select Year"
                                placeholder="Select Year"
                                value={currentYear}
                                valueFormat="YYYY"
                                onChange={(date: any) => {
                                    setCurrentYear(date);
                                    setValid(!!date);
                                }}
                            />
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    const subText =
        type === 'rev'
            ? 'office code and approver SR'
            : 'office code and year';

    return (
        <div className="h-full flex flex-col gap-4 items-center justify-center relative">
            <div className="absolute top-8 left-9">
                <div
                    onClick={() => toNavigate('/')}
                    className="rounded-full shadow-2xl bg-gray-200 p-2 cursor-pointer"
                >
                    <BiArrowBack />
                </div>
            </div>

            <div className="text-center mb-1">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                    {policyUser || ''}
                </h1>
            </div>

            <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm shadow-gray-100 overflow-hidden">
                <div className="bg-linear-to-r from-blue-800 to-blue-700 px-6 py-5">
                    <h2 className="text-white font-semibold text-base">
                        {type === 'rev' ? 'Policy Search' : 'Proposal Search'}
                    </h2>
                    <p className="text-slate-300 text-xs mt-0.5">
                        Select {subText} to view history
                    </p>
                </div>

                <div className="px-4">
                    <PalmyraNewForm
                        ref={formRef}
                        endPoint={''}
                        onValidChange={setValid}
                    >
                        <div className="">
                            {renderFormFields()}
                        </div>
                    </PalmyraNewForm>

                    <div className="flex justify-center py-5">
                        <Button
                            onClick={handleSubmit}
                            className={
                                isValid
                                    ? 'py-filled-button'
                                    : 'py-disabled-button'
                            }
                            disabled={!isValid}
                            leftSection={
                                <FaPaperPlane className="text-sm" />
                            }
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicySubmissionFrom;
