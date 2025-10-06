import { PalmyraForm } from "@palmyralabs/rt-forms";
import { TextField } from "templates/mantineForm";

const TemplateUlip = (props: any) => {
    return (<PalmyraForm ref={props.formRef}>
        <h3 className="text-center text-lg">LIFE INSURANCE CORPORATION OF INDIA</h3>
        <h5 className="text-center">
            <u>SURRENDERS DURING LOCK-IN PERIOD<br></br>(ULIP-cases)</u>
        </h5>

        <div className="p-6 pt-0 pb-0 flex items-center justify-between mt-8 gap-3">
            <div className="flex items-center">
                <span>
                    Place:
                </span>
                <TextField attribute="place" />
            </div>
            <div className="flex items-center">
                <span className="flex items-center">
                    Date:
                </span>
                <TextField attribute="date" />
            </div>
        </div>
        <div className="p-5 pt-0 pb-0 mt-12 text-justify">
            The within Policy is Surrendered on<TextField attribute="value1" className="float-right " />
            at the request of within Life Assured and /or Assignee<TextField attribute="value2" />
            The present Surrender Value of the above Policy amounts to Rs <TextField attribute="value3" />/- .
            Since the Policy has beein issued subject to 3 years Lock-in Period from date of Commencement of the Policy ,
            the above mentioned Surrender Value is payable on
            <TextField attribute="value4" />
            after deducting the dues if any , from the said amounts.
        </div>
        <div className="text-end mb-2 mt-15">
            <p>for LIFE INSURANCE CORPORATION OF INDIA</p>
            <p className="mt-7">p. Sr/Branch Manager.</p>
        </div >
    </PalmyraForm>
    );
};

export { TemplateUlip }