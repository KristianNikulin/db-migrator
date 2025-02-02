import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { FaTrash } from "react-icons/fa";
import Button from "../Button";
import CustomMessage from "../Message/index.tsx";

import { BANNED_RELATION_TYPES } from "../../constants/types";
import { ERROR_MESSAGE } from "../../constants/text";

import * as styles from "./styles.module.scss";

const List = ({ id, label, items, currentColumn, currentTable, showDeleteIcon = true, disabled }) => {
    const {
        register,
        formState: { errors },
        setValue,
        reset,
    } = useFormContext();

    const [rels, setRels] = useState([]);
    console.log(`rels: `, rels);

    const columnName = currentColumn.name;

    useEffect(() => {
        const filteredItems = (items || []).filter(
            (item) =>
                (item.source_table_name === currentTable && item.source_column_name === columnName) ||
                (item.target_table_name === currentTable && item.target_column_name === columnName)
        );
        console.log(`filteredItems: `, filteredItems);
        setRels(filteredItems);
        // setValue(id, filteredItems);
    }, [currentColumn, items, reset]);

    const onDelete = (index) => {
        const updatedItems = rels.filter((_, i) => i !== index);
        setRels(updatedItems);
        // setValue(id, updatedItems);
    };

    const isInvalidColumnType = BANNED_RELATION_TYPES.includes(currentColumn.data_type);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ cursor: "default" }}>{label}:</label>
            <ul className={styles.list}>
                {rels.map((item, index) => {
                    const isTarget = item.target_table_name === currentTable && item.target_column_name === columnName;
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
                                <button
                                    disabled={disabled}
                                    onClick={() => onDelete(index)}
                                    aria-label={`Delete ${item.constraint_name}`}
                                    style={disabled ? { cursor: "not-allowed" } : {}}
                                >
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
            {isInvalidColumnType && <CustomMessage message={ERROR_MESSAGE.BANNED_RELATION_TYPE} />}
            <Button disabled={isInvalidColumnType || disabled} variant="primary">
                + Add new relation
            </Button>
        </div>
    );
};

export default List;

// ДОБАВИТЬ ДОБАВЛЕНИЕ НОВЫХ СВЯЗЕЙ - UX , ПОТОМ НАЧАТЬ ФОРМИРОВАТЬ CHANGE HISTORY
// ДОБАВИТЬ СОЗДАНИЕ НОВОЙ ТАБЛИЦЫ - В МОДАЛКУ ПОПРОБОВАТЬ ПОМЕСТИТЬ ITEM
