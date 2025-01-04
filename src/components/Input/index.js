import React from "react";
import { useFormContext } from "react-hook-form";

import * as styles from "./styles.module.scss";

const Input = ({ id, label, type = "text", defaultValue, register, requiredMessage }) => {
    const {
        register: formRegister,
        formState: { errors },
    } = useFormContext();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor={id}>{label}:</label>
            <input
                className={styles.input}
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
