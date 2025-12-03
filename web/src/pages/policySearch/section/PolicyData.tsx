import { Accordion } from "@mantine/core";
import { useState } from "react";
import { IoIosArrowDown, IoMdPerson } from "react-icons/io";
import { FormateDate } from "utils/FormateDate";

const PolicyData = ({ data }: any) => {
    const [expand, setExpand] = useState<any>();

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
            <div className="">
                <div className="text-sky-700 text-xs">{label}</div>
                <p className="mt-1 text-base font-bold text-sky-800 select-text">
                    {![null, '', ' '].includes(value) ? value : "--"}
                </p>
            </div>
        </div>
    );

    const handleChange = (e: any) => {
        setExpand(e);
    }

    const arrowStyles = {
        transform: expand ? 'rotate(-180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease',
    };

    return (
        <div className="">
            {/* <div className="sticky top-0 z-50 text-xl font-bold p-2 rounded-t-lg flex items-center gap-2 text-white">
                <IoChevronBackOutline
                    onClick={() => window.history.back()}
                    className="cursor-pointer"
                />
                Policy / {data.policyNumber}
            </div> */}
            <div className="p-3 m-3 rounded-3xl bg-white/85 border border-gray-100 shadow-xl">
                <h1 className="text-sky-800 font-bold text-xl pb-4 flex items-center gap-3">
                    <IoMdPerson /> {data?.customerName}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-4">
                    {fields.map(content)}
                </div>
                <Accordion variant="filled" radius="md" className="mt-4" onChange={handleChange}>
                    <Accordion.Item value="details">
                        <Accordion.Panel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-4 pt-3">
                                {viewFields.map(content)}
                            </div>
                        </Accordion.Panel>
                        <Accordion.Control>
                            <div className="text-sky-800 text-center text-sm 
                            flex items-center gap-1.5 justify-center">
                                {expand === "details" ? "View Less Details" : "View More Details"}
                                <IoIosArrowDown style={arrowStyles} className='avathar-arrow-icon' />
                            </div>
                        </Accordion.Control>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    );
};

export { PolicyData };

