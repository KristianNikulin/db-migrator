import React from "react";
import { useFormContext } from "react-hook-form";

import * as styles from "./styles.module.scss";

const Input = ({ id, label, type = "text", defaultValue, register, requiredMessage, disabled }) => {
    const {
        register: formRegister,
        formState: { errors },
    } = useFormContext();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ cursor: "default" }}>{label}:</label>
            <input
                disabled={disabled}
                className={styles.input}
                style={disabled ? { color: "gray" } : {}}
                type={type}
                id={id}
                {...formRegister(id, { required: requiredMessage })}
                defaultValue={defaultValue}
            />
            {errors[id] && <p style={{ color: "red" }}>{errors[id]?.message}</p>}
        </div>
    );
};

export default Input;
