import { BiRightArrowAlt } from "react-icons/bi";
import { MdPolicy } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Props {
    data: any
}

const PolicyList = ({ data }: Props) => {
    const navigate = useNavigate();

    return (<div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-3xl shadow-xl h-full overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((file: any, index: number) => (
                <div key={file.id} className="group bg-white/60 hover:bg-white/80 transition-all
                    duration-300 ease-in-out rounded-2xl shadow-md hover:shadow-2xl border border-white/50 backdrop-blur-md p-6">
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{file.customerName}</h3>
                                {/* <p className="text-sm text-gray-500">{file.policyDate}</p> */}
                            </div>
                            <MdPolicy className="text-gray-600" fontSize={25} />
                        </div>
                    </div>

                    <div className="text-gray-700 text-sm space-y-2">
                        <div className="flex items-center gap-3 justify-between">
                            <div className="font-medium">Connection Number:</div>
                            <div>{file.policyNumber}</div>
                        </div>
                        <div className="flex items-center gap-3 justify-between">
                            <div className="font-medium">Branch Code:</div>
                            <div>{file.branchCode}</div>
                        </div>
                        <div className="flex items-center gap-3 justify-between">
                            <div className="font-medium">Contact Number:</div>
                            <div>{file.mobileNumber}</div>
                        </div>
                        {/* <div className="flex items-center gap-3 justify-between">
                            <div className="font-medium">Region:</div>
                            <div>{file.region}</div>
                        </div> */}
                    </div>

                    <div className="mt-4 float-right">
                        <button className="cursor-pointer text-sm font-medium text-sky-800 hover:underline flex gap-2 items-center"
                            onClick={() => navigate(`/app/policy/${file?.id}`, { state: { policyData: data[index] } })}>
                            View Details <BiRightArrowAlt fontSize={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
    )
}

export { PolicyList };