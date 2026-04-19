import { FieldGroupContainer, PalmyraForm } from "@palmyralabs/rt-forms";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFilterHandler } from "src/hook/useFilterHandler";
import { ServerLookup } from "templates/mantineForm";

interface IOptions {
    setFilter: (filter: any) => void;
    filter?: any
}

const DashboardHeader = (props: IOptions) => {
    const { setFilter, filter } = props;

    const divisionRef = useRef<any>(null);
    const branchRef = useRef<any>(null);
    const { handleFilterChange } = useFilterHandler(setFilter);

    const LookupEndPoint = ServiceEndpoint.customView.rev.Lookup;
    const divisionEndPoint = filter?.branch ? LookupEndPoint.division + `?branchName=${filter?.branch}` : LookupEndPoint.division;
    const branchEndPoint = filter?.division ? LookupEndPoint.branch + `?divisionName=${filter?.division}` : LookupEndPoint.branch;

    useEffect(() => { 
        if (!filter?.division) {
            branchRef?.current?.setValue(null);
            setFilter((prev:any) => ({ ...prev, branch: null })); 
        }
    }, [filter?.division]);

    return (
        <div>
            <div className="flex justify-between pt-1 ml-3">
                <div className="flex items-start gap-3">

                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
                        <LayoutDashboard size={18} />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Executive Dashboard
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Real-time case overview
                        </p>
                    </div>

                </div>
                <div className="pr-3">
                    <PalmyraForm>
                        <FieldGroupContainer columns={2}>
                            <ServerLookup attribute="division" placeholder="Select Division" ref={divisionRef}
                                queryOptions={{ endPoint: divisionEndPoint }}
                                onChange={handleFilterChange("division", 'customLookup', 'divisionName')}
                                lookupOptions={{ idAttribute: 'id', labelAttribute: 'divisionName' }} />
                            <ServerLookup attribute="branch" placeholder="Select Branch" ref={branchRef} disabled={!filter?.division}
                                queryOptions={{ endPoint: branchEndPoint }}
                                onChange={handleFilterChange("branch", 'customLookup', 'branchName')}
                                lookupOptions={{ idAttribute: 'id', labelAttribute: 'branchName' }} />
                        </FieldGroupContainer>
                    </PalmyraForm>
                </div>
            </div>
        </div>
    )
}

export { DashboardHeader };

