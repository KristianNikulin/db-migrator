import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useIsomorphicLayoutEffect } from "../lib/hooks/useIsomorphicLayoutEffect";

import "../styles/index.scss";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children, initialColor = "" }) => {
    const [theme, setTheme] = useState(initialColor);

    const setDOMColors = useCallback((mode) => {
        if (mode === "dark") {
            document.body.classList.add("theme-dark");
        } else {
            document.body.classList.remove("theme-dark");
        }
    }, []);

    useIsomorphicLayoutEffect(() => {
        const savedMode = localStorage.getItem("theme") || initialColor;

        setDOMColors(savedMode);
        setTheme(savedMode);
    }, []);

    const changeTheme = useCallback(
        (theme) => {
            if (theme === "dark") {
                localStorage.setItem("theme", theme);
                setDOMColors(theme);
                setTheme(theme);
            } else {
                localStorage.removeItem("theme");
                setDOMColors("");
                setTheme("");
            }
        },
        [setDOMColors, setTheme]
    );

    const context = useMemo(
        () => ({
            theme,
            changeTheme,
        }),
        [theme, changeTheme]
    );

    return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
};

export const useColorMode = () => useContext(ThemeContext);
