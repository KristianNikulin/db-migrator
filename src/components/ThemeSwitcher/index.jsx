import React from "react";

import { useColorMode } from "../../state-providers/theme";

import styles from "./styles.module.scss";

const ThemeSwitcher = () => {
    const { theme, changeTheme } = useColorMode();

    return (
        <div className={styles.themeSwitcher}>
            <label className={styles.switch}>
                <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={() => {
                        const t = theme === "dark" ? "light" : "dark";
                        changeTheme(t);
                    }}
                />
                <span className={styles.slider}></span>
            </label>
        </div>
    );
};

export default ThemeSwitcher;
