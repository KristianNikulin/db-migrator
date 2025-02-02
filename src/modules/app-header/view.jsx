import React from "react";
import { useNavigate } from "react-router-dom";
import { Trans } from "@lingui/react/macro";

import LanguageSelect from "../../components/LangSelect";
import ThemeSwitcher from "../../components/ThemeSwitcher";

import styles from "./app-header.module.scss";

const AppHeaderView = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.appHeader}>
            <div className={styles.wrapper}>
                <div>
                    <h1>
                        <b>DB MIGRATOR</b>
                    </h1>
                </div>
                <div className={styles.links}>
                    <button onClick={() => navigate("/migrator")}>Migrator</button>
                    <button onClick={() => navigate("/docs")}>
                        <Trans>Docs</Trans>
                    </button>
                    <button onClick={() => navigate("/settings")}>Settings</button>
                </div>
                <div className={styles.selectorsContainer}>
                    <LanguageSelect />
                    {false && <ThemeSwitcher />}
                </div>
            </div>
        </div>
    );
};

export default AppHeaderView;
