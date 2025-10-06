import { PalmyraForm } from "@palmyralabs/rt-forms";
import { TextField } from "templates/mantineForm";

const Template_5093 = (props: any) => {
    return (
        <div className="form-container flex items-center justify-center bg-white text-blue-500 font-[500] template-sec">
            <div className="border-double border-4 border-gray-500 p-3 w-196">
                <h5 className="text-right mb-5">Form No. 5093</h5>
                <h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
                <h5 className="text-center">
                    <u>FORM OF ENDORSEMENT - PUP FREE FROM LOAN AND INTEREST (TO BE USED IN THE CASE OF “IN FORCE” POLICIES.)</u>
                </h5>
                <PalmyraForm ref={props.formRef}>
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
                    <div className="text-center mt-4">
                        Policy Number:
                        <TextField attribute="policyNumber" w={"250"} m={'auto'} />
                    </div>
                    <div className="p-3 pt-0 pb-0 mt-12">
                        It is hereby declared that at the request of the within named Life Assured the sum assured under the within written Policy has been reduced to Rs.
                        <TextField attribute="rs" className="float-right " />
                        inclusive of all bonuses already declared free from payment of premiums due as from
                        <TextField attribute="s" />
                        and from the deduction of the existing loan and interest amounting to Rs.
                        <TextField attribute="g" />
                        . It is further declared that the Policy will not participate in the profits
                        <TextField attribute="gr" />
                        and will become payable as within mentioned. The sum of Rs.
                        <TextField attribute="grs" />
                        has been paid as Surrender Value of the portion of the sum assured dropped.
                    </div>
                    <div className="text-end mb-2 mt-15">
                        <p>for LIFE INSURANCE CORPORATION OF INDIA</p>
                        <p className="mt-7">p. Sr/Branch Manager.</p>
                    </div >
                </PalmyraForm>
            </div>
        </div>
    );
};

export { Template_5093 }