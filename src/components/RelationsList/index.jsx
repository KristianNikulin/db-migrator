import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trans } from "@lingui/react";

import { FaTrash } from "react-icons/fa";
import Button from "../Button";
import Select from "../Select";
import Modal from "../Modal";
import CustomMessage from "../Message";

import { useGlobalContext } from "../../state-providers/globalContext";
import { BANNED_RELATION_TYPES } from "../../constants/types";
import { ERROR_MESSAGE } from "../../constants/text";

import styles from "./styles.module.scss";

const List = ({ id, label, items, currentColumn, currentTable, showDeleteIcon = true, disabled }) => {
    const { globalState } = useGlobalContext();

    const tables = globalState.modifiedTables || null;

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [availableColumns, setAvailableColumns] = useState([]);

    const {
        register,
        formState: { errors },
        setValue,
        reset,
    } = useFormContext();
    const [rels, setRels] = useState([]);

    useEffect(() => {
        const filteredItems = (items || []).filter(
            (item) =>
                (item.source_table_name === currentTable && item.source_column_name === currentColumn.name) ||
                (item.target_table_name === currentTable && item.target_column_name === currentColumn.name)
        );
        setRels(filteredItems);
    }, [currentColumn, items, reset]);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTable(null);
        setSelectedColumn(null);
        setAvailableColumns([]);
    };

    const handleConfirmAction = () => {
        if (selectedTable && selectedColumn) {
            const newRelation = {
                source_table_name: currentTable,
                source_column_name: currentColumn.name,
                target_table_name: selectedTable,
                target_column_name: selectedColumn,
            };
            setRels([...rels, newRelation]);
            setValue(id, [...rels, newRelation]);
        }
        handleCloseModal();
    };

    const onDelete = (index) => {
        const updatedItems = rels.filter((_, i) => i !== index);
        setRels(updatedItems);
        setValue(id, updatedItems);
    };

    const handleTableChange = (tableName) => {
        if (selectedTable === tableName) {
            return;
        }
        setSelectedTable(tableName);
        setSelectedColumn(null);
        const selectedTableObj = tables.find((t) => t.name === tableName);
        const usedColumns = rels.map((r) => r.target_column_name);
        setAvailableColumns(
            selectedTableObj?.columns?.filter(
                (col) => !usedColumns.includes(col.name) && !BANNED_RELATION_TYPES.includes(col.data_type)
            ) || []
        );
    };

    const isInvalidColumnType = BANNED_RELATION_TYPES.includes(currentColumn.data_type);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ cursor: "default" }}>{label}:</label>
                <ul className={styles.list}>
                    {rels.map((item, index) => (
                        <li key={index} className={styles.listItem}>
                            <span>{index + 1}.</span>
                            <span>
                                <p>
                                    <b>Source</b> to column{" "}
                                    <span style={{ color: "red" }}>{item.target_column_name}</span> in table{" "}
                                    <span style={{ color: "red" }}>{item.target_table_name}</span>
                                </p>
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
                        </li>
                    ))}
                </ul>
                {isInvalidColumnType && <CustomMessage message={ERROR_MESSAGE.BANNED_RELATION_TYPE} />}
                <Button onClick={handleOpenModal} disabled={isInvalidColumnType || disabled} variant="primary">
                    <p>
                        + <Trans id="addRelation" message="Add new relation" />
                    </p>
                </Button>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
                leftBtnText="Cancel"
                rightBtnText="Add"
            >
                <Select
                    label="Select Table"
                    options={tables
                        .filter((t) => t.name !== currentTable && !rels.some((r) => r.target_table_name === t.name))
                        .map((table) => ({ value: table.name, label: table.name }))}
                    value={selectedTable}
                    onChange={handleTableChange}
                    renderOption={(option) => <>{option.label}</>}
                    renderValue={(value) => <>{value}</>}
                    placeholder="Select a table"
                    style={{ width: "200px" }}
                />

                {selectedTable && (
                    <Select
                        label="Select Column"
                        options={availableColumns.map((col) => ({ value: col.name, label: col.name }))}
                        value={selectedColumn}
                        onChange={setSelectedColumn}
                        renderOption={(option) => <>{option.label}</>}
                        renderValue={(value) => <>{value}</>}
                        placeholder="Select a column"
                        style={{ width: "200px" }}
                    />
                )}
            </Modal>
        </>
    );
};

export default List;

// ДОБАВИТЬ ДОБАВЛЕНИЕ НОВЫХ СВЯЗЕЙ - UX , ПОТОМ НАЧАТЬ ФОРМИРОВАТЬ CHANGE HISTORY
// ДОБАВИТЬ СОЗДАНИЕ НОВОЙ ТАБЛИЦЫ - В МОДАЛКУ ПОПРОБОВАТЬ ПОМЕСТИТЬ ITEM
