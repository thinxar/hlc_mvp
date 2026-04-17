import Gutter from "src/common/component/SectionBreak"
import { IPageInput } from "templates/Types"
import { PolicyListGrid } from "./PolicyListGrid"
import { useSearchParams } from "react-router-dom";
import { APPolicyViewPage } from "./pages/apPolicy/APPolicyViewPage";

const CustomViewerPage = (props: IPageInput) => {
    const [searchParams] = useSearchParams();
    const appName = searchParams.get("appname");


    return (
        appName == 'REV' ? (
            <Gutter>
                <div>
                    <PolicyListGrid pageName={props.pageName} type="rev" />
                </div> </Gutter >) : (
          
            <APPolicyViewPage />
        )
    )
}

export { CustomViewerPage }

