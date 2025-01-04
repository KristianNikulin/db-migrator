import React from "react";
import { useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa";

import * as styles from "./styles.module.scss";

const List = ({ id, label, items, currentColumn, currentTable, showDeleteIcon = true, onDelete }) => {
    const {
        formState: { errors },
    } = useFormContext();

    const filteredItems = (items || []).filter(
        (item) =>
            (item.source_table_name === currentTable && item.source_column_name === currentColumn) ||
            (item.target_table_name === currentTable && item.target_column_name === currentColumn)
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label htmlFor={id}>{label}:</label>
            <ul className={styles.list}>
                {filteredItems.map((item, index) => {
                    const isTarget =
                        item.target_table_name === currentTable && item.target_column_name === currentColumn;
                    return (
                        <li key={index} className={styles.listItem}>
                            <span>{index + 1}.</span>
                            <span>
                                {isTarget ? (
                                    <p>
                                        <b>Target</b> for column{" "}
                                        <span style={{ color: "red" }}>{item.source_column_name}</span> in table{" "}
                                        <span style={{ color: "red" }}>{item.source_table_name}</span>
                                    </p>
                                ) : (
                                    <p>
                                        <b>Source</b> to column{" "}
                                        <span style={{ color: "red" }}>{item.target_column_name}</span> in table{" "}
                                        <span style={{ color: "red" }}>{item.target_table_name}</span>
                                    </p>
                                )}
                            </span>
                            {showDeleteIcon && (
                                <button onClick={() => onDelete(index)} aria-label={`Delete ${item.constraint_name}`}>
                                    <FaTrash />
                                </button>
                            )}
                            {errors.items && errors.items[index] && (
                                <p style={{ color: "red" }}>{errors.items[index]?.message}</p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default List;
