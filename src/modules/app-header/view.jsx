import React from "react";
import { useNavigate } from "react-router-dom";
import { Trans } from "@lingui/react/macro";

import { PROJECT_NAME } from "../../constants/text";

import LanguageSelect from "../../components/LangSelect";
import ThemeSwitcher from "../../components/ThemeSwitcher";

import styles from "./app-header.module.scss";

const AppHeaderView = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.appHeader}>
            <div className={styles.wrapper}>
                <div>
                    <button onClick={() => navigate("/migrator")}>
                        <b>{PROJECT_NAME}</b>
                    </button>
                </div>
                <div className={styles.links}>
                    <button onClick={() => navigate("/migrator")}>
                        <Trans>Migrator</Trans>
                    </button>
                    <button onClick={() => navigate("/docs")}>
                        <Trans>Docs</Trans>
                    </button>
                    <button onClick={() => navigate("/settings")}>
                        <Trans>Settings</Trans>
                    </button>
                </div>
                <div className={styles.selectorsContainer}>
                    <LanguageSelect />
                    <ThemeSwitcher />
                </div>
            </div>
        </div>
    );
};

export default AppHeaderView;
