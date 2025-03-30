import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trans } from "@lingui/react";

import { FaCheckCircle, FaTimesCircle, FaTrash, FaUndo } from "react-icons/fa";
import Button from "../Button";
import Select from "../Select";
import Modal from "../Modal";
import CustomMessage from "../Message";

import { changeHistoryAtom, migrationStepAtom } from "../../state-providers/state";
import { BANNED_RELATION_TYPES, COLUMN_RELATION_STATUS } from "../../constants/types";
import { ERROR_MESSAGE } from "../../constants/text";

import styles from "./styles.module.scss";
import { useAtom } from "@reatom/npm-react";

const RelationsList = ({ id, label, currentColumn, currentTable, showDeleteIcon = true, disabled }) => {
    const [tables] = useAtom(changeHistoryAtom);
    const [migrationStep] = useAtom(migrationStepAtom);
    const curTables = tables[migrationStep] || null;

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [availableColumns, setAvailableColumns] = useState([]);

    const { setValue, watch } = useFormContext();
    const formRels = watch(id, []);

    const handleOpenModal = () => setModalOpen(true);

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTable(null);
        setSelectedColumn(null);
        setAvailableColumns([]);
    };

    const handleConfirmAction = () => {
        if (selectedTable && selectedColumn) {
            const randomNumber = Math.floor(10000 + Math.random() * 90000);
            const newRelation = {
                id: randomNumber,
                constraint_name: `${selectedTable}_${selectedColumn}_foreign`,
                source_table_name: currentTable,
                source_column_name: currentColumn.name,
                source_schema: "public",
                target_table_schema: "public",
                target_table_name: selectedTable,
                target_column_name: selectedColumn,
                status: COLUMN_RELATION_STATUS.NEW,
            };
            setValue(id, [...formRels, newRelation], { shouldDirty: true });
        }
        handleCloseModal();
    };

    const onDelete = (index) => {
        const updatedItems = formRels
            .filter((_, i) => i !== index || formRels[i].status !== COLUMN_RELATION_STATUS.NEW)
            .map((rel, i) =>
                i === index && rel.status !== COLUMN_RELATION_STATUS.NEW
                    ? { ...rel, status: COLUMN_RELATION_STATUS.DELETED }
                    : rel
            );
        console.log(`updatedItems: `, updatedItems);
        setValue(id, updatedItems, { shouldDirty: true });
    };

    const onUndoDelete = (index) => {
        const updatedItems = formRels.map((rel, i) =>
            i === index ? { ...rel, status: COLUMN_RELATION_STATUS.EXISTING } : rel
        );
        setValue(id, updatedItems, { shouldDirty: true });
    };

    const handleTableChange = (tableName) => {
        if (selectedTable === tableName) {
            return;
        }
        setSelectedTable(tableName);
        setSelectedColumn(null);
        const selectedTableObj = curTables.find((t) => t.name === tableName);
        const usedColumns = formRels.map((r) => r.target_column_name);
        setAvailableColumns(
            selectedTableObj?.columns?.filter(
                (col) => !usedColumns.includes(col.name) && !BANNED_RELATION_TYPES.includes(col.data_type)
            ) || []
        );
    };

    const isInvalidColumnType = BANNED_RELATION_TYPES.includes(currentColumn.data_type);

    console.log(`formRels: `, formRels);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ cursor: "default" }}>{label}:</label>
                <ul className={styles.list}>
                    {formRels
                        .filter(
                            (item) =>
                                (item.source_table_name === currentTable &&
                                    item.source_column_name === currentColumn.name) ||
                                (item.target_table_name === currentTable &&
                                    item.target_column_name === currentColumn.name)
                        )
                        .map((item, index) => (
                            <li key={index} className={styles.listItem}>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <span>{index + 1}.</span>
                                    <div>
                                        <span>
                                            <b>
                                                {item.source_column_name === currentColumn.name ? "Source" : "Target"}
                                            </b>{" "}
                                            to column{" "}
                                        </span>
                                        <span>
                                            <span style={{ color: "red" }}>{item.target_column_name}</span> in table{" "}
                                        </span>
                                        <span style={{ color: "red" }}>{item.target_table_name}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginRight: "5px" }}>
                                    {item.status === COLUMN_RELATION_STATUS.EXISTING && <FaCheckCircle color="green" />}
                                    {item.status === COLUMN_RELATION_STATUS.NEW && (
                                        <FaTimesCircle style={{ transform: "rotate(45deg)" }} color="orange" />
                                    )}
                                    {item.status === COLUMN_RELATION_STATUS.DELETED && <FaTimesCircle color="red" />}
                                    {showDeleteIcon && (
                                        <button
                                            type="button"
                                            disabled={disabled}
                                            onClick={() =>
                                                item.status === COLUMN_RELATION_STATUS.DELETED
                                                    ? onUndoDelete(index)
                                                    : onDelete(index)
                                            }
                                            aria-label={`Toggle delete ${item.constraint_name}`}
                                            className={styles.deleteBtn}
                                            style={disabled ? { cursor: "not-allowed" } : {}}
                                        >
                                            {item.status === COLUMN_RELATION_STATUS.DELETED ? <FaUndo /> : <FaTrash />}
                                        </button>
                                    )}
                                </div>
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
                isRightBtnDisabled={!Boolean(selectedColumn)}
            >
                <div className={styles.relationModalContainer}>
                    <h2 className={styles.relationModalTitle}>
                        Add new relation for column <span className={styles.rel}>{currentColumn.name}</span> in table{" "}
                        <span className={styles.rel}>{currentTable}</span>
                    </h2>
                    <div className={styles.relationSelectContainer}>
                        <Select
                            label="Table"
                            labelPos="H"
                            options={curTables
                                .filter((t) => t.name !== currentTable)
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
                                label="Column"
                                labelPos="H"
                                options={availableColumns.map((col) => ({ value: col.name, label: col.name }))}
                                value={selectedColumn}
                                onChange={setSelectedColumn}
                                renderOption={(option) => <>{option.label}</>}
                                renderValue={(value) => <>{value}</>}
                                placeholder={availableColumns.length ? "Select a column" : "No columns available"}
                                disabled={!availableColumns.length}
                                style={{ width: "200px" }}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RelationsList;
