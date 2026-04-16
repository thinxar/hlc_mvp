import { Button } from "@mantine/core";
import { PalmyraNewForm } from "@palmyralabs/rt-forms";
import { ErrorMsgConfig } from "config/ErrorMsgConfig";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ServerLookup } from "templates/mantineForm";
import { getPolicyInfo } from "utils/LocalStorageInfo";

const PolicySubmissionFrom = () => {
    const [isValid, setValid] = useState<boolean>(false);

    const toNavigate = useNavigate();

    const errorMsg = ErrorMsgConfig.form;
    const policyUser = getPolicyInfo();
    const lookupEndpoint = ServiceEndpoint.lookup;

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
                    <PalmyraNewForm endPoint={''} onValidChange={setValid}>
                        <div className="grid grid-cols-1 md:grid-cols-1">
                            <div className="md:col-span-1">
                                <ServerLookup
                                    attribute="OfficeCode"
                                    required
                                    placeholder="Select OfficeCode"
                                    label="Office Code"
                                    invalidMessage={errorMsg.mandatory}
                                    queryOptions={{ endPoint: lookupEndpoint.officeCode }}
                                    lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                                />
                            </div>

                            <div className="md:col-span-1">
                                <ServerLookup
                                    attribute="endorsementSubType"
                                    required
                                    placeholder="Select S.No"
                                    label="Serial Number"
                                    invalidMessage={errorMsg.mandatory}
                                    queryOptions={{ endPoint: lookupEndpoint.serialNo }}
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
                </div>
            </div>



        </div >
    )
}

export default PolicySubmissionFrom