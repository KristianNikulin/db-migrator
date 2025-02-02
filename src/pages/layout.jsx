import React, { createContext } from "react";

import AppFooter from "../modules/app-footer";
import AppHeader from "../modules/app-header";

import * as styles from "./pages.module.scss";

const RootLayout = ({ children }) => {
    const ConnectionContext = createContext([{ name: "test" }]);

    return (
        <div className={styles.rootLayout}>
            <header>
                <AppHeader />
            </header>

            <ConnectionContext.Provider value={[{ name: "test" }]}>
                <main className={styles.rootLayoutMain}>{children}</main>
            </ConnectionContext.Provider>

            <footer>
                <AppFooter />
            </footer>
        </div>
    );
};

export default RootLayout;
