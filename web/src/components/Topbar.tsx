import { ActionIcon, Tooltip } from "@mantine/core";
import { PathConfig } from "config/PathConfig";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { MoonStar, Sun } from "lucide-react";
import { useContext } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { LicLogo, TitleConfig } from 'templates/FlexImport';
import { getStoreFactory } from "wire/StoreFactory";
import { ThemeContext } from "wire/ThemeProvider";

const Topbar = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const storeFactory = getStoreFactory();
    const path = PathConfig

    const currentPath = location.pathname;

    const isShowLogout = currentPath.includes("customViewer");
    const logoutApi = ServiceEndpoint.auth.logout;

    const handleLogOut = (event: any) => {
        event.stopPropagation();
        const d: any = {};
        storeFactory.getFormStore(d, logoutApi, '').get({}).then(() => {
            navigate(path.login);
        });
    };

    return (<>
        <div className=" px-4  flex justify-between z-99 w-full 
        border-b border-gray-200 dark:border-gray-800 items-center">
            <div>
                <img src={LicLogo} className="h-13 w-24" />
            </div>
            <div className="pr-text font-semibold text-lg">{TitleConfig.appTitle.text}</div>
            <div className="flex justify-center gap-3">
                <Tooltip label={isDarkMode ? 'Light Mode' : 'Dark Mode'} >
                    <ActionIcon variant="subtle" size="md" onClick={toggleTheme}
                        className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        {isDarkMode ? <Sun size={18} className='text-orange-300' /> : <MoonStar size={18} />}
                    </ActionIcon>
                </Tooltip>

                <div className='flex text-red-600 items-center gap-2 cursor-pointer' onClick={handleLogOut}>
                    {
                        !isShowLogout && <>
                            <BiLogOutCircle /> Logout
                        </>
                    }
                </div>
            </div>
        </div>

    </>
    )
}

export { Topbar };
