import { PathConfig } from "config/PathConfig";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { BiLogOutCircle } from "react-icons/bi"
import { Outlet, useNavigate } from "react-router-dom";
import { getStoreFactory } from "wire/StoreFactory";

const Topbar = () => {
    const navigate = useNavigate();
    const storeFactory = getStoreFactory();
    const path = PathConfig.auth

    const logoutApi = ServiceEndpoint.auth.logout;

    const handleLogOut = (event: any) => {
        navigate(path.login);
        event.stopPropagation();
        const d: any = {};
        storeFactory.getFormStore(d, logoutApi, '').get({}).then(() => {
            navigate(path.login);
        });
    };

    return (<>
        <div className="text-white px-4 py-2 flex justify-end fixed z-99 w-full">
            <div className='hover:text-yellow-400 flex items-center gap-2 cursor-pointer' onClick={handleLogOut}>
                <BiLogOutCircle /> Logout
            </div>
            <div></div>
        </div>
        <div className="mt-5">
            <Outlet />
        </div>
    </>
    )
}

export { Topbar }