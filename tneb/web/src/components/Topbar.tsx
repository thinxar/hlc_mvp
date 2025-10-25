import { PathConfig } from "config/PathConfig";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { BiLogOutCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getStoreFactory } from "wire/StoreFactory";
import LicLogo from '../../public/tneb.png'

const Topbar = () => {
    const navigate = useNavigate();
    const storeFactory = getStoreFactory();
    const path = PathConfig

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
        <div className=" px-4  flex justify-between z-99 w-full 
        border-b border-gray-200 items-center">
            <div>
                <img src={LicLogo} className="h-18 w-18"/>
            </div>
            <div className="pr-text font-semibold text-lg">Tamil Nadu Electricity Board</div>
            <div className='flex text-red-600 items-center gap-2 cursor-pointer' onClick={handleLogOut}>
                <BiLogOutCircle /> Logout
            </div>
        </div>
    </>
    )
}

export { Topbar };
