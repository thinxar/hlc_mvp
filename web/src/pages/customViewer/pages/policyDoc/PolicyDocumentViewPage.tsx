import { useSearchParams } from "react-router-dom";
import { EmptyList } from "src/pages/policySearch/section/EmptyList";
import IFrameDocRenderer from "../apPolicy/IFrameDocRenderer";

const PolicyDocumentViewPage = () => {
    const [searchParams] = useSearchParams();

    const policyNo =
        searchParams.get('policyNo') ||
        searchParams.get('policyNumber') ||
        searchParams.get('policyno') ||
        '';

    const filterData: any = { policy: policyNo, policyNo };

    return (
        <div>
            <div className="rounded-lg shadow overflow-auto h-[calc(100vh-20px)] mt-2">
                {filterData?.policy ? (
                    <IFrameDocRenderer filterData={filterData} source="policy/docView" />
                ) : (
                    <EmptyList />
                )}
            </div>
        </div>
    )
}

export { PolicyDocumentViewPage };

