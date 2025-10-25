import { toast, TypeOptions } from "react-toastify"

const showToast = (
    type: TypeOptions,
    message?: string,
    fallback?: string
) => {
    //@ts-ignore
    const fn: any = toast[type];
    if (fn) {
        fn(message || fallback || "Something went wrong");
    }
};

export const Toast = {
    serverError: () => showToast("error", ErrorMsgConfig.toast.serverError),
    aclError: () => showToast("error", ErrorMsgConfig.toast.acl),
    resetPasswordSuccess: () => showToast("success", ErrorMsgConfig.toast.resetPwd),
    alreadyExists: () => showToast("error", ErrorMsgConfig.toast.dataExist),
    invalidLogin: () => showToast("warning", ErrorMsgConfig.toast.invalidLogin),
    onSaveSuccess: (msg?: string) =>
        showToast("success", `${msg ? msg : 'Data Saved Successfully'}`),
    onSaveFailure: (msg?: string) =>
        showToast("error", `${msg ? msg : 'Failed to save data'}`),
};

import { useNavigate } from 'react-router-dom';
import { ErrorMsgConfig } from "config/ErrorMsgConfig";

const useNavigation = () => {
    const navigate = useNavigate();

    const navigateTo = (path: string, state?: Record<string, any>) => {
        navigate(path, { state });
    };

    return { navigateTo };

};

const redirectToPage = (data: any, pageName: string, navigate: any) => {
    const baseUrl = `/app/admin/${pageName}`;
    const url = data?.id ? `${baseUrl}/view/${data.id}` : baseUrl;
    navigate(url);
}

const getPxcel = (percentage: string, minHeight: string) => {
    if (typeof percentage === "string" && percentage.endsWith("%")) {
        const numericValue = parseFloat(percentage);
        const screenHeight = window.innerHeight;
        const computedHeight = (numericValue / 100) * screenHeight;
        const minHeightValue = parseFloat(minHeight);

        if (isNaN(minHeightValue)) {
            throw new Error("minHeight must be a valid pixel string like '200px'");
        }

        const finalHeight = Math.max(computedHeight, minHeightValue);
        return `${finalHeight}px`;
    }
    throw new Error("Input must be a percentage string like '50%'");
};

export { useNavigation, redirectToPage, getPxcel }