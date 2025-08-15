import Swal from "sweetalert2";
import { PalmyraStoreFactory, type IEndPoint } from "@palmyralabs/palmyra-wire";
import 'react-toastify/dist/ReactToastify.css';
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { showAclErrorToast, showServerErrorToast } from "./errorToast";

const goToLogin = () => {
    const path = '/login'
    const baseurl = ServiceEndpoint.baseUrl;

    let loginPath = path;

    // resetLocalStorageData();
    // clearAuthInfo();
    window.location.href = baseurl + loginPath;
};


const applicationErrorHandle = () => {
    Swal.fire({
        html: "<p class='custom-text'>Application Server is Down.. Please try again later...</p>",
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: 5000,
        timerProgressBar: true,
    });
};

const sessionErrorHandle = () => {
    Swal.fire({
        title: "Session Expired",
        html: "<p class='custom-text'>Your session may have expired.<br>Please Login to continue..</p>",
        confirmButtonText: 'OK',
        allowEscapeKey: false,
        allowOutsideClick: false,
        customClass: {
            title: 'custom-header',
            confirmButton: 'custom-btn',
            popup: 'custom-width'
        }
    }).then((result:any) => {
        if (result.value) {
            goToLogin();
        }
    });
}

const errorHandler = () => {

    return (error: any) => {
        if (error.response) {
            const status: number = error.response.status;
            if (status >= 600) {
                return false;
            }
            else if (status == 500) {
                showServerErrorToast();
            } else if (status == 502) {
                applicationErrorHandle();
            } else if (status == 401) {
                sessionErrorHandle();
            } else if (status == 403) {
                showAclErrorToast();
            }
        } else {
            applicationErrorHandle();
        }
        return true;
    }
}

const appStoreBaseUrl = ServiceEndpoint.baseUrl + "/api/palmyra";

const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: appStoreBaseUrl, errorHandlerFactory: errorHandler });


const baseUrl = ServiceEndpoint.baseUrl + "/api";

const getStoreFactory = () => {
    return new PalmyraStoreFactory({ baseUrl, errorHandlerFactory: errorHandler });
}

export const useFormstore = (endPoint: IEndPoint, options?: Record<string, any>, idKey?: string) => {
    const o = options || {};
    return AppStoreFactory.getFormStore(o, endPoint, idKey);
}

export const useGridstore = (endPoint: IEndPoint, options?: Record<string, any>, idKey?: string) => {
    const o = options || {};
    return AppStoreFactory.getGridStore(o, endPoint, idKey);
}

export default AppStoreFactory;
export { getStoreFactory }