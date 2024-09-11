import cn from "classnames";
import React from "react";

import AppFooter from "../modules/app-footer";
import AppHeader from "../modules/app-header";

import styles from "./pages.module.scss";

const RootLayout = ({ children }) => {
    return (
        <div className={styles.rootLayout}>
            <header className={styles.header}>
                <AppHeader />
            </header>

            <main className={cn(styles.rootLayoutMain, styles.attr)}>{children}</main>

            <footer>
                <AppFooter />
            </footer>
        </div>
    );
};

export default RootLayout;
