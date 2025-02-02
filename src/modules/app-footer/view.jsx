import React from "react";

import { PROJECT_NAME } from "../../constants/text";

import styles from "./app-footer.module.scss";
import cn from "classnames";

const AppFooterView = () => {
    const date = new Date();
    const year = date.getFullYear();

    return (
        <div className={cn(styles.appFooter, "py-s2")}>
            <div className={styles.copyright}>
                Copyright © {year} {PROJECT_NAME}
            </div>
        </div>
    );
};

export default AppFooterView;
