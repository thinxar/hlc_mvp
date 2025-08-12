import { FaCodeBranch } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { FiCheckCircle } from "react-icons/fi";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdEvent, MdPolicy, MdVerifiedUser } from "react-icons/md";
import { PiBankFill } from "react-icons/pi";

const fieldIcons: any = {
    "Policy Number": <MdPolicy className="w-4 h-4 text-sky-700" />,
    "Policy Name": <MdVerifiedUser className="w-4 h-4 text-sky-700" />,
    "Privacy Date": <MdEvent className="w-4 h-4 text-sky-700" />,
    "DOB": <MdVerifiedUser className="w-4 h-4 text-sky-700" />,
    "DOC": <MdVerifiedUser className="w-4 h-4 text-sky-700" />,
    "Branch Code": <FaCodeBranch className="w-4 h-4 text-sky-700" />,
    "Mobile Number": <FaPhone className="w-3 h-3 text-sky-700" />,
    "Region": <PiBankFill className="w-4 h-4 text-sky-700" />,
    "Policy Status": <FiCheckCircle className="w-4 h-4 text-sky-700" />,
};

const PolicyData = ({ data }: any) => {
    const fields = [
        { label: "Policy Number", value: data?.policyNumber },
        { label: "Policy Name", value: data?.name },
        { label: "Privacy Date", value: data?.privacyDate },
        { label: "DOB", value: data?.dob },
        { label: "DOC", value: data?.doc },
        { label: "Branch Code", value: data?.branchCode },
        { label: "Mobile Number", value: data?.mobileNumber },
        { label: "Region", value: data?.region },
        { label: "Policy Status", value: data?.policyStatus },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 rounded-3xl bg-white/85 backdrop-blur-md border border-sky-800 shadow-xl">
            <h1 className="text-xl font-extrabold text-sky-800 mb-3 select-none drop-shadow-lg flex items-center gap-2">
               <IoChevronBackOutline onClick={() => { window.history.back() }} className="text-black cursor-pointer" /> Policy Details
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-4">
                {fields.map(({ label, value }) => (
                    <div key={label}
                        className="flex items-center space-x-4 group relative">
                        <div className="p-2 rounded-lg bg-sky-700/20 shadow-md flex items-center justify-center">
                            {fieldIcons[label]}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 text-sky-700 text-xs">
                                {label}</div>
                            <p className="mt-1 text-base font-bold text-sky-800 select-text">{value ?? "--"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { PolicyData };