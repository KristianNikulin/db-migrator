import React from "react";
import { useFormContext } from "react-hook-form";

import styles from "./styles.module.scss";

const Check = ({ id, label, defaultChecked, disabled }) => {
    const { register } = useFormContext();

    return (
        <div style={{ display: "flex", gap: "5px" }}>
            <label style={disabled ? { cursor: "default" } : {}} htmlFor={id}>
                {label}:
            </label>
            <input
                // style={{ cursor: "pointer", color: "#00bb99" }}
                disabled={disabled}
                className={styles.test}
                style={disabled ? { cursor: "not-allowed" } : {}}
                type="checkbox"
                id={id}
                {...register(id)}
                defaultChecked={defaultChecked}
            />
        </div>
    );
};

export default Check;

// import React from "react";
// import { useFormContext } from "react-hook-form";

// import * as styles from "./styles.module.scss";

// const Check = ({ id, label, defaultChecked }) => {
//     const { register } = useFormContext();

//     return (
//         <div style={{ display: "flex", gap: "5px" }}>
//             <label htmlFor={id} className={styles.customСheckbox}>
//                 {label}:
//                 <input type="checkbox" id={id} {...register(id)} defaultChecked={defaultChecked} />
//                 <span className={styles.checkmark}></span>
//             </label>
//         </div>
//     );
// };

// export default Check;
