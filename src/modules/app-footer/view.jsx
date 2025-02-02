import cn from "classnames";
import React from "react";

import * as styles from "./app-footer.module.scss";

const AppFooterView = () => {
    const date = new Date();
    const year = date.getFullYear();

    return (
        <div className={cn(styles.appFooter, "py-s2")}>
            <div className={styles.copyright}>Copyright © {year} DB Migrator</div>
        </div>
    );
};

export default AppFooterView;
