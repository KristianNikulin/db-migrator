import { action } from "@reatom/framework";
import { changeHistoryAtom, choosedTableAtom, choosedColumnAtom, migrationStepAtom } from "./../state-providers/state";
import { COLUMN_RELATION_STATUS } from "../constants/types";

export const updateHistory = action((ctx, el, type = "column") => {
    console.log(`el: `, el);
    const state = {
        changeHistory: ctx.get(changeHistoryAtom),
        choosedTable: ctx.get(choosedTableAtom),
        choosedColumn: ctx.get(choosedColumnAtom),
        migrationStep: ctx.get(migrationStepAtom),
    };
    console.log(`state: `, state);

    switch (type) {
        case "column_update": {
            const tables = state.changeHistory[state.migrationStep] || [];
            console.log(`tables: `, tables);

            const oldTableName = state.choosedTable?.data?.name;
            const oldColumnName = state.choosedColumn?.name;
            const newTableName = el.table_name;
            const newColumnName = el.column_name;

            const isTableRenamed = oldTableName !== newTableName;
            const isColumnRenamed = oldColumnName !== newColumnName;

            const relationsToDelete = el.relationships.filter((rel) => rel.status === COLUMN_RELATION_STATUS.DELETED);

            const updatedTables = tables.map((table) => {
                return {
                    ...table,
                    name: table.name === oldTableName ? newTableName : table.name,
                    columns: table.columns.map((column) => {
                        if (column.name === oldColumnName && column.table === oldTableName) {
                            return {
                                ...column,
                                name: newColumnName,
                                table: newTableName,
                                comment: el.comment,
                                data_type: el.data_type,
                                is_nullable: el.is_nullable,
                                is_unique: el.is_unique,
                            };
                        }
                        if (isTableRenamed && column.table === oldTableName) {
                            return { ...column, table: newTableName };
                        }
                        return column;
                    }),
                    relationships: table.relationships
                        .map((rel) => {
                            if (relationsToDelete.some((delRel) => delRel.id === rel.id)) {
                                return null;
                            }
                            if (rel.source_table_name === oldTableName) {
                                return {
                                    ...rel,
                                    source_table_name: newTableName,
                                    source_column_name:
                                        isColumnRenamed && rel.source_column_name === oldColumnName
                                            ? newColumnName
                                            : rel.source_column_name,
                                };
                            }
                            if (rel.target_table_name === oldTableName) {
                                return {
                                    ...rel,
                                    target_table_name: newTableName,
                                    target_column_name:
                                        isColumnRenamed && rel.target_column_name === oldColumnName
                                            ? newColumnName
                                            : rel.target_column_name,
                                };
                            }
                            return rel;
                        })
                        .filter(Boolean),
                };
            });

            console.log(`updatedTables: `, updatedTables);

            changeHistoryAtom(ctx, [...state.changeHistory.slice(0, state.migrationStep + 1), updatedTables]);
            migrationStepAtom(ctx, state.migrationStep + 1);
            choosedColumnAtom(ctx, { ...state.choosedColumn, name: newColumnName });
            choosedTableAtom(ctx, { ...state.choosedTable, data: { ...state.choosedTable?.data, name: newTableName } });
            break;
        }
        case "column_add": {
            console.log("column add check");
            const tables = state.changeHistory[state.migrationStep] || [];
            const updatedTables = tables.map((table) => {
                if (table.name === state.choosedTable?.data?.name) {
                    return {
                        ...table,
                        columns: [
                            ...table.columns,
                            {
                                table: table.name,
                                name: el.column_name,
                                data_type: el.data_type,
                                is_nullable: el.is_nullable || false,
                                is_unique: el.is_unique || false,
                                comment: el.comment || null,
                            },
                        ],
                    };
                }
                return table;
            });
            console.log(`updatedTables after column add: `, updatedTables);
            changeHistoryAtom(ctx, [...state.changeHistory.slice(0, state.migrationStep + 1), updatedTables]);
            migrationStepAtom(ctx, state.migrationStep + 1);
            break;
        }
        case "table_add": {
            console.log("table add check");
            const newTable = {
                name: el.table_name,
                schema: "public",
                columns: el.columns.map((col) => ({
                    name: col.column_name,
                    table: el.table_name,
                    data_type: col.data_type,
                    is_nullable: false,
                    is_unique: false,
                    comment: "",
                    table_id: 55555,
                    schema: "public",
                })),
                relationships: [],
                primary_keys: [],
                comment: null,
                id: 55555,
            };
            const updatedTables = [...state.changeHistory[state.migrationStep], newTable];
            changeHistoryAtom(ctx, [...state.changeHistory.slice(0, state.migrationStep + 1), updatedTables]);
            migrationStepAtom(ctx, state.migrationStep + 1);
            break;
        }
        case "column_delete": {
            const tables = state.changeHistory[state.migrationStep] || [];
            const oldTableName = state.choosedTable?.data?.name;
            const oldColumnName = state.choosedColumn?.name;

            const updatedTables = tables.map((table) => {
                return {
                    ...table,
                    columns: table.columns.filter(
                        (column) => !(column.name === oldColumnName && column.table === oldTableName)
                    ),
                    relationships: table.relationships.filter(
                        (rel) =>
                            !(rel.source_table_name === oldTableName && rel.source_column_name === oldColumnName) &&
                            !(rel.target_table_name === oldTableName && rel.target_column_name === oldColumnName)
                    ),
                };
            });

            console.log(`updatedTables after column delete: `, updatedTables);
            changeHistoryAtom(ctx, [...state.changeHistory.slice(0, state.migrationStep + 1), updatedTables]);
            migrationStepAtom(ctx, state.migrationStep + 1);
            break;
        }
        case "table_delete": {
            const tables = state.changeHistory[state.migrationStep] || [];
            const oldTableName = state.choosedTable?.data?.name;

            const updatedTables = tables
                .filter((table) => table.name !== oldTableName)
                .map((table) => {
                    return {
                        ...table,
                        relationships: table.relationships.filter(
                            (rel) => rel.source_table_name !== oldTableName && rel.target_table_name !== oldTableName
                        ),
                    };
                });

            console.log(`updatedTables after table delete: `, updatedTables);
            changeHistoryAtom(ctx, [...state.changeHistory.slice(0, state.migrationStep + 1), updatedTables]);
            migrationStepAtom(ctx, state.migrationStep + 1);
            break;
        }
        default:
            break;
    }
}, "updateHistory");
