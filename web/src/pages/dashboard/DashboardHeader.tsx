import { FieldGroupContainer, PalmyraForm } from "@palmyralabs/rt-forms"
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { LayoutDashboard } from "lucide-react";
import { useFilterHandler } from "src/hook/useFilterHandler";
import { ServerLookup } from "templates/mantineForm"

interface IOptions {
    setFilter: (filter: any) => void;
    filter?: any
}

const DashboardHeader = (props: IOptions) => {
    const { setFilter } = props;
    const { handleFilterChange } = useFilterHandler(setFilter);

    const LookupEndPoint = ServiceEndpoint.customView.rev.Lookup;

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
                            <ServerLookup attribute="division" placeholder="Division"
                                queryOptions={{ endPoint: LookupEndPoint.branch }}
                                onChange={handleFilterChange("division", 'lookup')}
                                lookupOptions={{ idAttribute: 'id', labelAttribute: 'division' }} />
                            <ServerLookup attribute="branch" placeholder="Branch"
                                queryOptions={{ endPoint: LookupEndPoint.branch }}
                                onChange={handleFilterChange("branch", 'lookup')}
                                lookupOptions={{ idAttribute: 'id', labelAttribute: 'branch' }} />
                        </FieldGroupContainer>
                    </PalmyraForm>
                </div>
            </div>
        </div>
    )
}

export { DashboardHeader }

