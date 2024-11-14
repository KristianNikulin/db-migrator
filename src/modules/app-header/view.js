import React from "react";
import { useNavigate } from "react-router-dom";

import * as styles from "./app-header.module.scss";

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
                    <button onClick={() => navigate("/docs")}>Docs</button>
                    <button onClick={() => navigate("/settings")}>Settings</button>
                </div>
                <div>User</div>
            </div>
        </div>
    );
};

// function ThemeToggler() {
//     const { colorMode, changeTheme } = useColorMode();

//     return (
//         <Toggler
//             isTheme
//             className="ml-s1"
//             value={colorMode === "dark"}
//             onChange={() => {
//                 const theme = colorMode === "dark" ? "light" : "dark";

//                 changeTheme(theme);
//             }}
//         />
//     );
// }

export default AppHeaderView;
