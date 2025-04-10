import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import styles from "./styles.module.scss";

const Check = ({ id, label, disabled }) => {
    const { register, control } = useFormContext();
    const value = useWatch({ control, name: id });

    return (
        <div style={{ display: "flex", gap: "5px" }}>
            <label style={disabled ? { cursor: "default" } : {}} htmlFor={id}>
                {label}:
            </label>
            <input
                disabled={disabled}
                className={styles.test}
                style={disabled ? { cursor: "not-allowed" } : {}}
                type="checkbox"
                id={id}
                {...register(id)}
                checked={value}
            />
        </div>
    );
};

export default Check;
