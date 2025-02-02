import React from "react";
import { useFormContext } from "react-hook-form";

import * as styles from "./styles.module.scss";

const Textarea = ({ id, label, defaultValue, disabled }) => {
    const { register } = useFormContext();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ cursor: "default" }}>{label}:</label>
            <textarea
                disabled={disabled}
                className={styles.area}
                style={disabled ? { color: "gray" } : {}}
                id={id}
                {...register(id)}
                defaultValue={defaultValue}
            />
        </div>
    );
};

export default Textarea;
