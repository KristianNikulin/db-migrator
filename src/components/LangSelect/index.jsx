import React, { useState, useEffect } from "react";
import { useLingui } from "@lingui/react/macro";

import Flag from "react-world-flags";
import Select from "../SelectV2";

import { LANGUAGES } from "../../constants/types";

import styles from "./styles.module.scss";

const LanguageSelect = () => {
    const { i18n } = useLingui();
    const [language, setLanguage] = useState(localStorage.getItem("language") || "EN");

    useEffect(() => {
        localStorage.setItem("language", language);
        i18n.activate(language);
    }, [i18n, language]);

    return (
        <Select
            options={LANGUAGES.map((lang) => ({ value: lang.code, label: lang.label, flag: lang.flag }))}
            value={language}
            onChange={setLanguage}
            renderOption={(option) => (
                <>
                    <Flag code={option.flag} className={styles.flag} /> {option.label}
                </>
            )}
            renderValue={(value) => {
                const selected = LANGUAGES.find((lang) => lang.code === value);
                return selected ? (
                    <>
                        <Flag code={selected.flag} className={styles.flag} /> {selected.label}
                    </>
                ) : null;
            }}
        />
    );
};

export default LanguageSelect;
