import Gutter from "src/common/component/SectionBreak"
import { IPageInput } from "templates/Types"
import { PolicyListGrid } from "./PolicyListGrid"
import { useSearchParams } from "react-router-dom";
import { APPolicyViewPage } from "./pages/apPolicy/APPolicyViewPage";

const CustomViewerPage = (props: IPageInput) => {
    const [searchParams] = useSearchParams();
    const appName = searchParams.get("appname");

    return (<Gutter>
        {appName == 'REV' ?
            <div>
                <PolicyListGrid pageName={props.pageName} type="rev" />
            </div> :
            <APPolicyViewPage />
        }
    </Gutter >)
}

export { CustomViewerPage }

