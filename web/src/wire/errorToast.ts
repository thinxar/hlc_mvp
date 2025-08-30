import { toast } from "react-toastify"

const showServerErrorToast = () => {
    toast.error("Something went wrong Please try again later.. ")
}

const showAclErrorToast = () => {
    const errorMessage = 'You are not authorized to perform this operation.';
    toast.error(errorMessage);
}

const alreadyExists = () => {
    toast.error("Data Already Exist")
}

const savedSuccessfully = (input: any) => {
    toast.success(`${input} Saved Successfully`);
}

import { useNavigate } from 'react-router-dom';

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

export { showServerErrorToast, alreadyExists, savedSuccessfully, showAclErrorToast }