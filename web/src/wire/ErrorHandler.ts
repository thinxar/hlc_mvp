import { ErrorMsgConfig } from "config/ErrorMsgConfig";
import { Toast } from "./errorToast";

let lastServerErrorTime = 0;
const SERVER_ERROR_COOLDOWN = 5000;

const handleError = (error: any) => {
    if (error.response) {
        const { status, data } = error.response;
        let errorMessage = data?.errorMessage;
        if (status === 500) {
            const now = Date.now();
            if (now - lastServerErrorTime > SERVER_ERROR_COOLDOWN) {
                errorMessage = data?.errorMessage;
                Toast.onSaveFailure(errorMessage || ErrorMsgConfig.toast.serverError)
                lastServerErrorTime = now;
            }
        } else if (status === 401) {
            const errorMessage = data?.errorMessage || ErrorMsgConfig.toast.invalidLogin;
            Toast.onSaveFailure(errorMessage)
        } else if (status === 403) {
            const errorMessage = ErrorMsgConfig.toast.acl;
            Toast.onSaveFailure(errorMessage);
        } else {
            Toast.onSaveFailure(errorMessage && errorMessage !== '' ? errorMessage : ErrorMsgConfig.toast.serverError);
        }
    } else {
        Toast.onSaveFailure(ErrorMsgConfig.toast.serverError);
    }
};

export { handleError };
