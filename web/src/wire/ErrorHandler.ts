import { toast } from "react-toastify";

const SERVER_ERROR = 'Server error occurred, Please try again later!'
const AUTH_ERROR = 'You are not authorized to perform this operation.'
const INVALID_LOGIN = 'Invalid Credentials'

const handleError = (error: any) => {
    if (error.response) {
        const { status, data } = error.response;
        let errorMessage = data?.errorMessage;
        if (status === 500 || status === 400) {
            const errorMessage = data?.errorMessage || SERVER_ERROR;
            toast.error(errorMessage);
        } else if (status === 401) {
            const errorMessage = data?.errorMessage || INVALID_LOGIN;
            toast.error(errorMessage);
        } else if (status === 403) {
            const errorMessage = AUTH_ERROR;
            toast.error(errorMessage);
        }

        if (status !== 200) {
            toast.error(errorMessage != '' ? errorMessage : SERVER_ERROR);
        }
    } else {
        toast.error(SERVER_ERROR);
    }
};

export { handleError }