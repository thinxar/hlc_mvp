import { Outlet } from "react-router-dom";
import PageNotFoundX from "src/common/pages/PageNotFoundX";
import { CustomViewerPage } from "src/pages/customViewer/CustomViewerPage";
import PolicySubmissionPage from "src/pages/customViewer/pages/PolicySubmissionPage";
import { CustomViewerViewPage } from "src/pages/customViewer/view/CustomViewerViewPage";
import { HomePage } from "src/pages/home/HomePage";
import { PolicyResultPage } from "src/pages/policyResult/PolicyResultPage";

export const appRoutes = [
    {
        path: "*",
        name: "Not Found Page",
        element: <PageNotFoundX />,
        state: "home"
    },
    {
        path: "",
        element: <Outlet />,
        name: "Project",
        state: "project",
        icon: "table",
        children: [
            {
                path: 'home',
                element: <HomePage />,
            },
            {
                path: 'policy/:policyId',
                element: <PolicyResultPage />,
            },
        ],
    },
    {
        path: "customViewer",
        element: <Outlet />,
        name: "Project",
        state: "project",
        icon: "table",
        children: [
            {
                path: 'submission',
                element: <PolicySubmissionPage />,
            },
            {
                path: 'NG',
                element: <CustomViewerPage pageName="customViewer" />,
            },
            {
                path: 'operation',
                element: <CustomViewerViewPage pageName="customViewer" />,
            },

        ],
    }
]