import { IPageInput } from "templates/Types"
import { PolicyListGrid } from "./PolicyListGrid"
import Gutter from "src/common/component/SectionBreak"

const CustomViewerPage = (props: IPageInput) => {
    return (<Gutter>
        <div>
            <PolicyListGrid pageName={props.pageName} type="rev"/>
        </div>
    </Gutter>)
}

export { CustomViewerPage }