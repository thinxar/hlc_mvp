import { PalmyraStoreFactory, type IEndPoint } from "@palmyralabs/palmyra-wire";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import 'react-toastify/dist/ReactToastify.css';
import { session } from "src/common/pages/SessionErrorPage";
import Swal from "sweetalert2";
import { Toast } from "./errorToast";

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

const errorHandler = () => {

    return (error: any) => {
        if (error.response) {
            const status: number = error.response.status;
            if (status >= 600) {
                return false;
            }
            else if (status == 500) {
                Toast.serverError();
            } else if (status == 502) {
                applicationErrorHandle();
            } else if (status == 401) {
                session()
            } else if (status == 403) {
                Toast.aclError()
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
export { getStoreFactory };

