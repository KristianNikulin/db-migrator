import React from "react";
import { useFormContext } from "react-hook-form";

import * as styles from "./styles.module.scss";

const Select = ({ id, label, options, requiredMessage, disabled }) => {
    const {
        register: formRegister,
        formState: { errors },
    } = useFormContext();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ cursor: "default" }}>{label}:</label>
            <select
                disabled={disabled}
                className={styles.select}
                style={disabled ? { cursor: "not-allowed" } : {}}
                id={id}
                {...formRegister(id, { required: requiredMessage })}
            >
                {(options || []).map(
                    (option) =>
                        option && (
                            <option style={{ cursor: "pointer" }} key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        )
                )}
            </select>
            {errors[id] && <p style={{ color: "red" }}>{errors[id]?.message}</p>}
        </div>
    );
};

export default Select;
