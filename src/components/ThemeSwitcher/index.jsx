import React, { useState, useEffect } from "react";

import styles from "./styles.module.scss";

const ThemeSwitcher = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setIsDarkMode(savedTheme === "dark");
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newTheme = !prev;
            localStorage.setItem("theme", newTheme ? "dark" : "light");
            return newTheme;
        });
    };

    // Применяем класс для темной или светлой темы
    // useEffect(() => {
    //     document.body.className = isDarkMode ? "dark-theme" : "light-theme";
    // }, [isDarkMode]);

    return (
        <div className={styles.themeSwitcher}>
            <label className={styles.switch}>
                <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                <span className={styles.slider}></span>
            </label>
        </div>
    );
};

export default ThemeSwitcher;
