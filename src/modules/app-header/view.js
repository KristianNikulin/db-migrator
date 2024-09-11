import React from "react";

// import Toggler from "components/controls/toggler";
import styles from "./app-header.module.scss";

const AppHeaderView = () => {
    return (
        <div className={styles.appHeader}>
            <div className={styles.wrapper}>zxc</div>
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
