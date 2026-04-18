import { YearPickerInput } from "@mantine/dates";
import { IServerLookupField, PalmyraForm } from "@palmyralabs/rt-forms";
import { ErrorMsgConfig } from "config/ErrorMsgConfig";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { ServerLookup } from "templates/mantineForm";
import { useRef, useState } from "react";
import { MdSecurity } from "react-icons/md";

interface IOptions {
    type: 'rev' | 'and' | 'pbv'
    onChange: (d: any) => void
}

const ApDocumentFilter = (props: IOptions) => {
    const { type, onChange } = props;
    const proposalRef = useRef<IServerLookupField>(null)
    const errorMsg = ErrorMsgConfig.form;
    const LookupEndpoint = ServiceEndpoint.customView[type].Lookup;

    const [officeCode, setOfficeCode] = useState<any>(null);
    const [year, setYear] = useState<any>(null);
    const [proposal, setProposal] = useState<any>(null);

    const updateParent = (data: any) => {
        onChange({
            officeCode: data.officeCode ?? officeCode,
            year: data.year ?? year,
            propno: data.propno ?? proposal,
        });
    };

    const handleOfficeChange = (val: any) => {
        if (val != '') {
            setOfficeCode(val);
            setProposal(null);
            proposalRef?.current?.setDisabled(false)
            updateParent({ officeCode: val, propno: null })
        } else {
            setProposal(null);
            proposalRef?.current?.setValue(null)
            proposalRef?.current?.setDisabled(true)
            updateParent({ officeCode: val, propno: '' })
        }
    };

    const handleYearChange = (val: any) => {
        setYear(val);
        setProposal(null);
        updateParent({ year: val, propno: null });
    };

    const handleProposalChange = (val: any) => {
        setProposal(val);
        updateParent({ propno: val });
    };

    const params = new URLSearchParams({
        officecode: officeCode || "",
        year: new Date(year).getFullYear().toString() || ""
    });

    const isProposalEnabled = officeCode && year;
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div
                    className={`
          flex items-center justify-center rounded-[9px] bg-blue-500 shrink-0 w-9 h-9
        `}
                >
                    <MdSecurity size={20} color="white" />
                </div>

                <div className="flex flex-col gap-1 leading-none">
                    <span
                        className={`
            font-semibold text-gray-900 text-md
          `}
                    >
                        {type == 'pbv' ? 'PolicyBazaar' : 'Ananda'}
                    </span>
                    <span
                        className={`
            font-medium text-blue-500 text-xs
          `}
                    >
                        Insurance marketplace
                    </span>
                </div>
            </div>
            <div className="flex justify-center items-center gap-3">
                <PalmyraForm>

                    <ServerLookup
                        attribute="OfficeCode"
                        label="Office Code"
                        placeholder="Select OfficeCode"
                        invalidMessage={errorMsg.mandatory}
                        queryOptions={{ endPoint: LookupEndpoint.officeCode }}
                        lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }}
                        onChange={handleOfficeChange}
                    />

                    <YearPickerInput
                        label="Select Year"
                        placeholder="Select Year"
                        valueFormat="YYYY"
                        value={year}
                        onChange={handleYearChange}
                    />

                    <ServerLookup
                        attribute="propno"
                        label="Proposal No" ref={proposalRef}
                        placeholder="Select Proposal No"
                        invalidMessage={errorMsg.mandatory}
                        queryOptions={{
                            endPoint: `${LookupEndpoint.proposalNo}?${params.toString()}`, queryAttribute: 'proposalNo'
                        }}
                        lookupOptions={{ idAttribute: 'id', labelAttribute: 'proposalNo' }}
                        value={proposal}
                        onChange={handleProposalChange}
                        disabled={!isProposalEnabled}
                    />

                </PalmyraForm>
            </div>
            <div></div>
        </div>
    );
};

export default ApDocumentFilter;
