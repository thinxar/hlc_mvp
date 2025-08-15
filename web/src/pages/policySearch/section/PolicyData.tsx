import { Accordion } from "@mantine/core";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import { FormateDate } from "utils/FormateDate";

// const fieldIcons = {
//     "Policy Number": <MdPolicy className="w-4 h-4 text-sky-700" />,
//     "Name": <MdVerifiedUser className="w-4 h-4 text-sky-700" />,
//     "Policy Date": <MdEvent className="w-4 h-4 text-sky-700" />,
//     "DOB": <MdVerifiedUser className="w-4 h-4 text-sky-700" />,
//     "DOC": <MdVerifiedUser className="w-4 h-4 text-sky-700" />,
//     "Branch Code": <FaCodeBranch className="w-4 h-4 text-sky-700" />,
//     "Mobile No": <FaPhone className="w-3 h-3 text-sky-700" />,
//     "Region": <PiBankFill className="w-4 h-4 text-sky-700" />,
//     "Policy Status": <FiCheckCircle className="w-4 h-4 text-sky-700" />,
//     "Division Code": <SiPrivatedivision className="w-4 h-4 text-sky-700" />,
//     "Box No": <BsBoxSeam className="w-4 h-4 text-sky-700" />,
//     "Batch No": <FaCodeBranch className="w-4 h-4 text-sky-700" />,
//     "RMS Status": <FiCheckCircle className="w-4 h-4 text-sky-700" />,
// };

const PolicyData = ({ data }: any) => {
    const fields = [
        { label: "DOB", value: FormateDate(data?.customerDob) },
        { label: "DOC", value: FormateDate(data?.doc) },
        { label: "Branch Code", value: data?.branchCode },
        {
            label: "Policy Status",
            value:
                data?.policyStatus === 1 ? "Inforce"
                    : data?.policyStatus === 2 ? "Lapsed"
                        : data?.policyStatus === 3 ? "Cancelled" : "In-Active"
        },
    ];

    const viewFields = [
        { label: "Mobile No", value: data?.mobileNumber },
        { label: "Division Code", value: data?.divisionCode },
        { label: "Batch No", value: data?.batchNumber },
        { label: "Box No", value: data?.boxNumber },
        { label: "RMS Status", value: data?.rmsStatus },
    ];

    const content = ({ label, value }: any) => (
        <div key={label} className="flex items-center space-x-4">
            <div>
                <div className="text-sky-700 text-xs">{label}</div>
                <p className="mt-1 text-base font-bold text-sky-800 select-text">
                    {value ?? "--"}
                </p>
            </div>
        </div>
    );

    return (
        <div className="policy-sec">
            <div className="sticky top-0 bg-sky-800 z-50 text-xl font-bold p-2 rounded-t-lg flex items-center gap-2 text-white">
                <IoChevronBackOutline
                    onClick={() => window.history.back()}
                    className="cursor-pointer"
                />
                Policy / {data.policyNumber}
            </div>
            <div className="p-3 m-3 rounded-3xl bg-white/85 border border-sky-800 shadow-xl">
                <h1 className="text-sky-800 font-bold text-xl pb-4 flex items-center gap-3">
                    <IoMdPerson /> {data?.customerName}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-4">
                    {fields.map(content)}
                </div>
                <Accordion variant="filled" radius="md" className="mt-4">
                    <Accordion.Item value="details">
                        <Accordion.Control>
                            <div className="text-sky-800 text-center text-sm">
                                View More Details
                            </div>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-4 pt-3">
                                {viewFields.map(content)}
                            </div>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    );
};

export { PolicyData };
