import React from "react";
import { useFormContext } from "react-hook-form";

import * as styles from "./styles.module.scss";

const Textarea = ({ id, label, defaultValue }) => {
    const { register } = useFormContext();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor={id}>{label}:</label>
            <textarea className={styles.area} id={id} {...register(id)} defaultValue={defaultValue} />
        </div>
    );
};

export default Textarea;
