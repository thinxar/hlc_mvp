
const resetLocalStorageData = () => {
    localStorage.removeItem('selectedMenu');
    localStorage.removeItem("palmyra.rui.sidemenu.expanded.selected");
    localStorage.removeItem("palmyra.rui.sidemenu.expanded");
    sessionStorage.clear();
}

const storePolicyInfo = (result: any) => {
    return localStorage.setItem("userName", result)
}

const getPolicyInfo = () => {
    return localStorage.getItem("userName")
}

const clearAuthInfo = () => {
    return localStorage.removeItem("auth")
}



export { clearAuthInfo, getPolicyInfo, storePolicyInfo };


    export { resetLocalStorageData };

