import { PalmyraForm } from "@palmyralabs/rt-forms";
import { TextField } from "templates/mantineForm";

const Template5216 = (props: any) => {
    return (
        <div className="form-container flex items-center justify-center bg-white text-blue-500 font-[500] template-sec">
            <div className="border-double border-4 border-gray-500 p-3 w-190">
                <h5 className="text-right mb-5">Form No. 5216</h5>
                <h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
                <h5 className="text-center">
                    <u>FORM OF ENDORSEMENT FOR REINSTATEMENT OF SURRENDERED POLIC</u>Y
                </h5>
                <PalmyraForm ref={props.formRef}>
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
                        The within policy which was surrendered on (Date of Surrender)<TextField attribute="value1" className="float-right " />
                        at the request of the
                        within Life Assured and/or Assignee (Name of the Assignee)<TextField attribute="value2" />
                        is hereby reinstated on (Date of reinstatement)<TextField attribute="value3" />
                        and all the remarks in regard to cancellation <TextField attribute="value4" />
                        <span className="text-base/7"> (and/or) surrender of the Policy placed on the within Policy
                            document are hereby revoked. All the terms and conditions of the Policy and the
                            assignment or nomination, if any, existing and in force immediately prior to the
                            surrender of the Policy on (Date of Surrender)</span>
                        <TextField attribute="value5" />
                        are also hereby reinstated and shall be valid as if
                        the Policy had not been surrendered.
                    </div>
                    <div className="text-end mt-4 mb-2 mt-15">
                        <p>for LIFE INSURANCE CORPORATION OF INDIA</p>
                        <p className="mt-7">p. Sr/Branch Manager.</p>
                    </div >
                </PalmyraForm>
            </div>
        </div>
    );
};

export { Template5216 }