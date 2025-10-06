import { PalmyraForm } from "@palmyralabs/rt-forms";
import { TextField } from "templates/mantineForm";

const TemplateRegistration = (props: any) => {
    return (
        <div className="form-container flex items-center justify-center bg-white text-blue-500 font-[500] template-sec">
            <div className="border-double border-4 border-gray-500 p-3 w-190">
                <h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
                <h5 className="text-center">
                    <u>Registration of Nomination</u>
                </h5>
                <PalmyraForm ref={props.formRef}>
                    <div className="p-6 pt-0 pb-0">
                        <div className="flex items-center justify-between mt-8 gap-3">
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
                        <div className="flex items-center justify-center text-center mt-2 template-sec">
                            Policy Number :
                            <TextField attribute="value1" m={'auto'} />
                        </div>
                        <div className="flex items-center text-center mt-7">
                            <p>	Registered on: </p>
                            <TextField attribute="policyNumber" m={'auto'} />
                        </div>
                        <div className="flex items-center text-center mt-4">
                            <p>Name of Nominee : </p>
                            <TextField attribute="policyNumber" m={'auto'} />
                        </div>
                        <div className="flex items-center text-center mt-4">
                            <p>	Relationship with LA : </p>
                            <TextField attribute="policyNumber" m={'auto'} />
                        </div>
                        <div className="flex items-center text-center mt-4">
                            <p>	Age of Nominee (in case of minor only) : </p>
                            <TextField attribute="policyNumber" m={'auto'} />
                        </div>
                        <div className="flex items-center text-center mt-4">
                            <p>	Name of Appointee (in case of minor only) : </p>
                            <TextField attribute="policyNumber" m={'auto'} />
                        </div>
                    </div>
                    <div className="text-end mb-2 mt-15">
                        <p className="mt-7">p. Sr/Branch Manager.</p>
                    </div >
                </PalmyraForm>
            </div>
        </div>
    );
};

export { TemplateRegistration }