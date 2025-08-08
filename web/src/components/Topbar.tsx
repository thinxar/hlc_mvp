import { BiLogOutCircle } from "react-icons/bi"
import { getStoreFactory } from "../wire/StoreFactory";
import { useNavigate } from "react-router-dom";
import { PathConfig } from "../config/PathConfig";
import { ServiceEndpoint } from "../config/ServiceEndpoint";

const Topbar = () => {
    const navigate = useNavigate();
    const storeFactory = getStoreFactory();
    const path = PathConfig.auth

    const logoutApi = ServiceEndpoint.auth.logout;

    const handleLogOut = (event: any) => {
        event.stopPropagation();
        const d: any = {};
        storeFactory.getFormStore(d, logoutApi, '').get({}).then(() => {
            navigate(path.login);
        });
    };

    return (
        <div>
            <div className='text-white m-2 p-2 flex items-center gap-2 justify-end
            hover:text-yellow-400 cursor-pointer' onClick={handleLogOut}>
                <BiLogOutCircle /> Logout
            </div>
        </div>
    )
}

export { Topbar }