import { PathConfig } from "config/PathConfig";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { BiLogOutCircle } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LicLogo, TitleConfig } from 'templates/FlexImport';
import { getStoreFactory } from "wire/StoreFactory";

const Topbar = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const storeFactory = getStoreFactory();
    const path = PathConfig

    const paramsAppName: any = searchParams.get("appname");
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
        border-b border-gray-200 items-center">
            <div>
                <img src={LicLogo} className="h-13 w-24" />
            </div>
            <div className="pr-text font-semibold text-lg">{TitleConfig.appTitle.text}</div>
            <div className='flex text-red-600 items-center gap-2 cursor-pointer' onClick={handleLogOut}>
                {
                    !paramsAppName && <>
                        <BiLogOutCircle /> Logout
                    </>
                }
            </div>

        </div>

    </>
    )
}

export { Topbar };
