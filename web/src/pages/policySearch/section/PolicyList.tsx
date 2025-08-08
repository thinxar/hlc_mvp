import { BiRightArrowAlt } from "react-icons/bi";
import { MdPolicy } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PolicyList = ({ data }: any) => {
    const navigate = useNavigate();

    const handleNavigate = (policyId: number) => {
        navigate(`/app/policy/${policyId}`)
    }

    return (<div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-3xl shadow-xl h-[700px] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((file: any) => (
                <div key={file.id} className="group bg-white/60 hover:bg-white/80 transition-all
                    duration-300 ease-in-out rounded-2xl shadow-md hover:shadow-2xl border border-white/50 backdrop-blur-md p-6">
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{file.name}</h3>
                                {/* <p className="text-sm text-gray-500">{file.policyDate}</p> */}
                            </div>
                            <MdPolicy className="text-gray-600" fontSize={25} />
                        </div>
                    </div>

                    <div className="text-gray-700 text-sm space-y-2">
                        <div className="flex items-center gap-3 justify-between">
                            <div className="font-medium">Policy Number:</div>
                            <div>{file.policyNumber}</div>
                        </div>
                        <div className="flex items-center gap-3 justify-between">
                            <div className="font-medium">Branch Code:</div>
                            <div>{file.branchCode}</div>
                        </div>
                        <div className="flex items-center gap-3 justify-between">
                            <div className="font-medium">Mobile Number:</div>
                            <div>{file.mobileNumber}</div>
                        </div>
                        <div className="flex items-center gap-3 justify-between">
                            <div className="font-medium">Region:</div>
                            <div>{file.region}</div>
                        </div>
                    </div>

                    <div className="mt-4 float-right">
                        <button className="cursor-pointer text-sm font-medium text-sky-800 hover:underline flex gap-2 items-center"
                            onClick={() => handleNavigate(file.id)}>
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
