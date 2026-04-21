import { FieldGroupContainer, PalmyraForm } from "@palmyralabs/rt-forms"
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { LayoutDashboard } from "lucide-react";
import { useFilterHandler } from "src/hook/useFilterHandler";
import { ServerLookup } from "templates/mantineForm"

interface IOptions {
    setFilter: (filter: any) => void;
    filter?: any
}

const DoDashboardHeader = (props: IOptions) => {
    const { setFilter } = props;
    const { handleFilterChange } = useFilterHandler(setFilter);

    const LookupEndPoint = ServiceEndpoint.customView.rev.Lookup;

    return (
        <div>
            <div className="flex justify-between pt-1 ml-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
                        <LayoutDashboard size={18} />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Analytic Dashboard
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Real-time case overview
                        </p>
                    </div>
                </div>
                <div className="pr-3">
                    <PalmyraForm>
                        <FieldGroupContainer columns={1}>
                            <ServerLookup attribute="srno" placeholder="Deviation Name"
                                queryOptions={{ endPoint: LookupEndPoint.division, queryAttribute: 'divisionName' }}
                                onChange={handleFilterChange("srno", 'lookup')}
                                lookupOptions={{ idAttribute: 'id', labelAttribute: 'divisionName' }} />
                        </FieldGroupContainer>
                    </PalmyraForm>
                </div>
            </div>
        </div>
    )
}

export { DoDashboardHeader }

