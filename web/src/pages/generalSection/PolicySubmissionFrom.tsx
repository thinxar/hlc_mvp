import { Button } from "@mantine/core";
import { ISaveForm, PalmyraNewForm } from "@palmyralabs/rt-forms";
import { ErrorMsgConfig } from "config/ErrorMsgConfig";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { JSX, useRef, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ServerLookup } from "templates/mantineForm";
import { getPolicyInfo } from "utils/LocalStorageInfo";

type myType = 'rev' | 'and' | 'pbv'
interface submissionProps {
    type: myType
}
const errorMsg = ErrorMsgConfig.form;
const revLookupEndpoint = ServiceEndpoint.customView.rev.Lookup;
const anaLookupEndpoint = ServiceEndpoint.customView.and.Lookup;
const pbvLookupEndpoint = ServiceEndpoint.customView.pbv.Lookup;

const RevivalRender = () => {
    const [isValid, setValid] = useState<boolean>(false);
    const formRef = useRef<ISaveForm>(null);
    const toNavigate = useNavigate();

    const handleSubmit = () => {
        const requestData = formRef?.current?.getData();
        const sNo = requestData?.serialNumber?.name;
        const officeCode = requestData?.OfficeCode?.name;
        
        toNavigate(`../NG?officecode=${officeCode}&srno=${sNo}&appname=REV`);
    };

    return (
        <PalmyraNewForm ref={formRef} endPoint={''} onValidChange={setValid}>
            <div className="grid grid-cols-1 md:grid-cols-1">
                <div className="md:col-span-1">
                    <ServerLookup required attribute="OfficeCode" label="Office Code"
                        placeholder="Select OfficeCode"
                        queryOptions={{ endPoint: revLookupEndpoint.officeCode }}
                        invalidMessage={errorMsg.mandatory}
                        lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }} />
                </div>

                <div className="md:col-span-1">
                    <ServerLookup
                        attribute="serialNumber"
                        required
                        placeholder="Select S.No"
                        label="Serial Number"
                        invalidMessage={errorMsg.mandatory}
                        queryOptions={{ endPoint: revLookupEndpoint.serialNo }}
                        lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                    />
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <Button onClick={handleSubmit}
                    className={isValid ? 'py-filled-button' : 'py-disabled-button'}
                    disabled={!isValid}
                    leftSection={<FaPaperPlane className="text-sm" />}
                >
                    View Details
                </Button>
            </div>
        </PalmyraNewForm>
    )
}

const AnandaRender = () => {
    const [isValid, setValid] = useState<boolean>(false);

    return (
        <PalmyraNewForm endPoint={''} onValidChange={setValid}>
            <div className="grid grid-cols-1 md:grid-cols-1">
                <div className="md:col-span-1">
                    <ServerLookup
                        attribute="OfficeCode"
                        required
                        placeholder="Select OfficeCode"
                        label="Office Code"
                        invalidMessage={errorMsg.mandatory}
                        queryOptions={{ endPoint: anaLookupEndpoint.officeCode }}
                        lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                    />
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <Button
                    className={isValid ? 'py-filled-button' : 'py-disabled-button'}
                    disabled={!isValid}
                    leftSection={<FaPaperPlane className="text-sm" />}
                >
                    View Details
                </Button>
            </div>
        </PalmyraNewForm>
    )
}

const PolicyBazaarRender = () => {
    const [isValid, setValid] = useState<boolean>(false);

    return (
        <PalmyraNewForm endPoint={''} onValidChange={setValid}>
            <div className="grid grid-cols-1 md:grid-cols-1">
                <div className="md:col-span-1">
                    <ServerLookup
                        attribute="OfficeCode"
                        required
                        placeholder="Select OfficeCode"
                        label="Office Code"
                        invalidMessage={errorMsg.mandatory}
                        queryOptions={{ endPoint: pbvLookupEndpoint.officeCode }}
                        lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                    />
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <Button
                    className={isValid ? 'py-filled-button' : 'py-disabled-button'}
                    disabled={!isValid}
                    leftSection={<FaPaperPlane className="text-sm" />}
                >
                    View Details
                </Button>
            </div>
        </PalmyraNewForm>
    )
}

const PolicySubmissionFrom = (props: submissionProps) => {

    const { type } = props;
    const toNavigate = useNavigate();
    const policyUser = getPolicyInfo();

    const formMap: Record<myType, JSX.Element> = {
        rev: <RevivalRender />,
        and: <AnandaRender />,
        pbv: <PolicyBazaarRender />,
    };

    return (
        <div className="h-full flex flex-col gap-4 items-center justify-center relative">
            <div className="absolute top-8 left-9">
                <div onClick={() => toNavigate('/')}
                    className="rounded-full shadow-2xl bg-gray-200 p-2 cursor-pointer">
                    <BiArrowBack className="" />
                </div>
            </div>
            <div className="text-gray-800 text-3xl font-semibold ">
                Submission for <span className="text-red-500"> {policyUser || ''} </span>
            </div>
            <div className="bg-blue-200/90 shadow-lg rounded-xl p-4 py-3 min-w-lg">
                <div className="p-3 mb-1 text-center ">
                    <div className="flex flex-col items-center mb-1 justify-center ">
                        <div className="text-2xl text-center font-bold ">
                            Asset Lookup
                        </div>
                        <div className="text-[13px] text-slate-600">
                            Select a Office Code and Serial Number to view detailed unit history
                        </div>
                    </div>

                </div>
                <div className="pb-4">
                    {formMap[type]}
                </div>
            </div>



        </div >
    )
}

export default PolicySubmissionFrom