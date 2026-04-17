import { BiArrowBack } from "react-icons/bi"
import Gutter from "src/common/component/SectionBreak"
import { IPageInput } from "templates/Types"
import { PolicyListGrid } from "./PolicyListGrid"

const CustomViewerPage = (props: IPageInput) => {
    return (<Gutter>
        <div>
            <div className="absolute top-20 left-9">
                <div onClick={() => window.history.back()}
                    className="rounded-full shadow-2xl bg-gray-200 p-2 cursor-pointer">
                    <BiArrowBack className="" />
                </div>
            </div>
            <PolicyListGrid pageName={props.pageName} type="rev" />
        </div>
    </Gutter >)
}

export { CustomViewerPage }
