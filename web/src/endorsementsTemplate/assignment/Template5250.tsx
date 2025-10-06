import { PalmyraForm } from "@palmyralabs/rt-forms";
import { TextField } from "templates/mantineForm";

const Template5250 = (props: any) => {
    return (
        <div className="form-container flex items-center justify-center bg-white text-blue-500 font-[500] template-sec">
            <div className="border-double border-4 border-gray-500 p-3 w-190">
                <h5 className="text-right mb-5">Form No. 5250</h5>
                <h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
                <h5 className="text-center">
                    <u>Assignment</u>
                </h5>
                <PalmyraForm ref={props.formRef}>
                    <div className="p-6 pt-0 pb-0 mt-12 text-justify">
                        I/We <TextField attribute="value1" className="float-right " /> and
                        <TextField attribute="value2" />
                        the beneficiary/ies named in the within Policy No.
                        <TextField attribute="value3" />
                        issued by the Life Insurance Corporation of India on the life of
                        <TextField attribute="value4" />.
                        <span className="text-base/7">
                            Under the provisions of Section 6 of the Married Women's Property Act 1874, in consideration of natural love and affection
                            do as beneficial owner/s hereby assign absolutely my/our beneficial interest in the said policy to my/our beneficial interest in the said policy to my/our beneficial interest in the said policy to my/our (relationship)
                            (Shri/Smt.)
                        </span>
                        <TextField attribute="value5" /> aged
                        <TextField attribute="value6" />
                        years his/her heirs, executors and administrators.
                    </div>
                    <div className="flex mt-6 p-5 pt-0 pb-0">
                        Dated <TextField attribute="value7" /> this <TextField attribute="value8" />dayof<TextField attribute="value9" />year.
                    </div>
                    <div className="mt-6 p-5 pt-0 pb-0">
                        <p>Witness :</p>
                        <div className="ml-7">
                            <div className="flex gap-2 items-center ">
                                <span>(1)</span>
                                <span> Signature</span>
                                <TextField attribute="value10" className="ml-4" />
                            </div>
                            <div className="ml-6 flex gap-6">
                                Full Name
                                <TextField attribute="value11" />
                            </div>
                            <div className="ml-6 flex gap-3">
                                Designation
                                <TextField attribute="value12" />
                            </div>
                            <div className="ml-6 flex gap-10">
                                Address
                                <TextField attribute="value13" />
                            </div>
                        </div>
                    </div>
                    <div className="text-end mb-2">
                        <p>Signature/s of the	</p>
                        <p className="mt-3">p. Sr/Branch Manager.</p>
                    </div >
                    <div className="mt-6 p-5 pt-0 pb-0">
                        <div className="ml-7">
                            <div className="flex gap-2 items-center ">
                                <span>(2)</span>
                                <span> Signature</span>
                                <TextField attribute="value10" className="ml-4" />
                            </div>
                            <div className="ml-6 flex gap-6">
                                Full Name
                                <TextField attribute="value11" />
                            </div>
                            <div className="ml-6 flex gap-3">
                                Designation
                                <TextField attribute="value12" />
                            </div>
                            <div className="ml-6 flex gap-10">
                                Address
                                <TextField attribute="value13" />
                            </div>
                        </div>
                    </div>
                </PalmyraForm>
            </div>
        </div>
    );
};

export { Template5250 }