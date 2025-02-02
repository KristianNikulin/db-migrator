import React, { useState, useEffect, useRef } from "react";
import Flag from "react-world-flags";
import { useLingui } from "@lingui/react/macro";

import { LANGUAGES } from "../../constants/types";

import styles from "./styles.module.scss";

const LanguageSelect = () => {
    const { i18n } = useLingui();
    const [language, setLanguage] = useState(localStorage.getItem("language") || "EN");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("language", language);
        i18n.activate(language);
    }, [i18n, language]);

    const handleSelect = (code) => {
        setLanguage(code);
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className={styles.dropdown}>
            <button onClick={() => setIsDropdownOpen((prev) => !prev)} className={styles.button}>
                <span className={styles.buttonText}>
                    <Flag code={LANGUAGES.find((lang) => lang.code === language).flag} className={styles.flag} />
                    {LANGUAGES.find((lang) => lang.code === language).label}
                </span>
                <span className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.dropdownArrowOpen : ""}`}>▼</span>
            </button>
            {isDropdownOpen && (
                <ul className={styles.menu}>
                    {LANGUAGES.map((lang) => (
                        <li key={lang.code} onClick={() => handleSelect(lang.code)} className={styles.menuItem}>
                            <Flag code={lang.flag} className={styles.flag} />
                            {lang.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSelect;
