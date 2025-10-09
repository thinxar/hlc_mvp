import { Button, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { PalmyraNewForm } from "@palmyralabs/rt-forms"
import { StringFormat } from '@palmyralabs/ts-utils'
import { ErrorMsgConfig } from "config/ErrorMsgConfig"
import { ServiceEndpoint } from "config/ServiceEndpoint"
import { useRef, useState } from "react"
import { FaFileAlt, FaPaperPlane, FaUser } from "react-icons/fa"
import { ServerLookup } from "templates/mantineForm"
import { EndorseTemplateView } from "./EndorseTemplateView"

interface IOptions {
    data: any
}
const EndorseTemplatePicker = (props: IOptions) => {
    const { data } = props;
    const endorsementRef = useRef<any>(null);
    const categoryRef = useRef<any>(null);
    const [categoryId, setCategoryId] = useState<any>();
    const [endorse, setEndorse] = useState<any>('');
    const [isValid, setValid] = useState<boolean>(false);
    const [opened, { open, close }] = useDisclosure(false);
    const errorMsg = ErrorMsgConfig.form

    const policyData = [
        { label: 'Policy Number', value: data?.policyNumber, icon: FaFileAlt },
        { label: 'Customer Name', value: data?.customerName, icon: FaUser }
    ]

    const handleCategoryChange = (_value: any, data?: any) => {
        if (data)
            setCategoryId(data?.id);
        else {
            setCategoryId(null)
        }
        endorsementRef?.current?.setValue(null)
    }

    const handleEndorseChange = (value: any, data?: any) => {
        if (data) {
            setEndorse(value);
        } else {
            setEndorse('')
        }
    }

    const endorsementEndpoint = StringFormat(ServiceEndpoint.lookup.endorsementSubType, {
        endorsementType: categoryId
    }) + '?_limit=-1'

    return (
        <div className="px-2">
            <div>
                <div className="bg-white p-3 mb-1 text-center border-b-1 border-gray-200">
                    <div className="flex items-center gap-3 mb-1 justify-center">
                        <div className="text-2xl text-center font-bold text-gray-800">
                            Select Endorsement Title
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Fill in the details below to proceed with your endorsement
                    </p>
                </div>

                <div className="mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {policyData.map((d) => {
                            const Icon = d?.icon;
                            return (
                                <div className="flex items-center gap-4 p-4 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            {d?.label}
                                        </p>
                                        <p className="text-sm font-bold text-gray-800 mt-0.5">
                                            {d?.value}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="pb-4">
                    <PalmyraNewForm endPoint={''} onValidChange={setValid}>
                        <div className="grid grid-cols-1 md:grid-cols-1">
                            <div className="md:col-span-1">
                                <ServerLookup
                                    attribute="endorsementType"
                                    required
                                    placeholder="Select Category"
                                    label="Stamp Category" onChange={handleCategoryChange}
                                    invalidMessage={errorMsg.mandatory}
                                    queryOptions={{ endPoint: ServiceEndpoint.lookup.endorsementType + '?_limit=-1' }}
                                    ref={categoryRef}
                                    lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                                />
                            </div>

                            <div className="md:col-span-1">
                                <ServerLookup
                                    attribute="endorsementSubType"
                                    required
                                    placeholder="Select Endorsement"
                                    label="Endorsement" onChange={handleEndorseChange}
                                    disabled={(categoryId == undefined) && true}
                                    invalidMessage={errorMsg.mandatory}
                                    queryOptions={{ endPoint: endorsementEndpoint }}
                                    ref={endorsementRef}
                                    lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mt-8">
                            <Button onClick={open}
                                className={isValid ? 'py-filled-button' : 'py-disabled-button'}
                                disabled={!isValid}
                                leftSection={<FaPaperPlane className="text-sm" />}
                            >
                                Submit
                            </Button>
                        </div>
                    </PalmyraNewForm>
                </div>
            </div>

            <Modal opened={opened} onClose={close} centered size={"xl"} title="Endorsement"
                classNames={{ body: "p-0 flex flex-col max-h-[80vh]" }} styles={{
                    body: {
                        padding: 0
                    }
                }} closeOnClickOutside={false}
            >
                <div className="flex items-center justify-between px-4">
                    <div className="text-blue-700">Policy No: <span className="text-gray-950">{data?.policyNumber}</span></div>
                    <div className="text-blue-700">Claims: <span className="text-gray-950">{endorse}</span></div>
                    <div></div>
                </div>
                <EndorseTemplateView endorsementTitle={endorse} policyNo={data?.policyNumber}/>
            </Modal>
        </div>
    )
}

export { EndorseTemplatePicker }
