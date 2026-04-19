import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import { getDarkModeTheme, setDarkModeTheme } from '../utils/LocalStorageInfo';

interface ThemeContextType {
    isDarkMode?: boolean;
    toggleTheme?: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const savedTheme = getDarkModeTheme();
        if (savedTheme) {
            setIsDarkMode(savedTheme);
        }
    }, []);

    useEffect(() => {
        setDarkModeTheme(isDarkMode)
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};