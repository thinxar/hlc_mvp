import { useState } from "react";
import { EmptyList } from "src/pages/policySearch/section/EmptyList";
import IFrameDocRenderer from "../apPolicy/IFrameDocRenderer";
import { NeftPolicySearch } from "./search/NeftPolicySearch";
import { MdSecurity } from "react-icons/md";

const NeftDocumentViewPage = () => {
    const [filterData, setFilterData] = useState<any>({
        policy: null
    });

    return (
        <div>
            <div className="flex justify-between items-center px-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div
                            className={`
                              flex items-center justify-center rounded-[9px] bg-blue-500 shrink-0 w-9 h-9
                            `}
                        >
                            <MdSecurity size={20} color="white" />
                        </div>

                        <div className="flex flex-col gap-1 leading-none">
                            <span
                                className={`
                                font-semibold text-gray-900 dark:text-gray-300 text-md
                              `}
                            >
                                NEFT
                            </span>
                            <span
                                className={`
                                font-medium text-blue-500 text-xs
                              `}
                            >
                                Document View
                            </span>
                        </div>
                    </div>
                </div>
                <div className="min-w-120"><NeftPolicySearch onChange={setFilterData} /></div>
                <div></div>
            </div>


            <div className="rounded-lg shadow overflow-auto h-[calc(100vh-130px)]">
                {filterData?.policy ? (
                    <IFrameDocRenderer filterData={filterData} source="neft/docView" />
                ) : (
                    <EmptyList />
                )}
            </div>
        </div>
    )
}

export { NeftDocumentViewPage };

