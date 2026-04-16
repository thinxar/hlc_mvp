import { Outlet } from "react-router-dom";
import PageNotFoundX from "src/common/pages/PageNotFoundX";
import PolicySubmissionPage from "src/pages/customViewer/pages/PolicySubmissionPage";
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
        path: " ",
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

        ],
    }
]