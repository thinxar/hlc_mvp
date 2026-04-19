
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


// dark theme

const setDarkModeTheme = (theme: any) => {
    if (theme) {
        const themeString: string = JSON.stringify(theme);
        localStorage.setItem('darkMode', themeString);
    } else {
        localStorage.removeItem('darkMode');
    }
}

const getDarkModeTheme = () => {
    const themeString = localStorage.getItem('darkMode');
    if (themeString) {
        return JSON.parse(themeString);
    } else
        return undefined;
}


export { clearAuthInfo, getPolicyInfo, storePolicyInfo, setDarkModeTheme, getDarkModeTheme };


export { resetLocalStorageData };

