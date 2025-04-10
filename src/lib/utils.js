import { action } from "@reatom/framework";
import { changeHistoryAtom, choosedTableAtom, choosedColumnAtom, migrationStepAtom } from "./../state-providers/state";
import { COLUMN_RELATION_STATUS } from "../constants/types";

function generateId() {
    let id = "";
    for (let i = 0; i < 5; i++) {
        id += Math.floor(Math.random() * 10);
    }
    return +id;
}

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
            const relationsToAdd = el.relationships.filter((rel) => rel.status === COLUMN_RELATION_STATUS.NEW);

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
                        .concat(relationsToAdd)
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
            const newId = generateId();
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
                    table_id: newId,
                    schema: "public",
                })),
                relationships: [],
                primary_keys: [],
                comment: null,
                id: newId,
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

export const deployChanges = (oldTables, newTables) => {
    const changes = [];
    const uniqueSet = new Set();

    const pushUnique = (comment, request) => {
        const key = JSON.stringify({ comment, request });
        if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            changes.push({ comment, request });
        }
    };

    const getTableByName = (tables, name) => tables.find((t) => t.name === name);

    const serializeRel = (rel) =>
        `${rel.source_table_name}.${rel.source_column_name} → ${rel.target_table_name}.${rel.target_column_name}`;

    const relationshipsEqual = (a, b) =>
        a.source_table_name === b.source_table_name &&
        a.source_column_name === b.source_column_name &&
        a.target_table_name === b.target_table_name &&
        a.target_column_name === b.target_column_name;

    const arrayEqual = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

    // --- TABLES ---
    const oldTableNames = oldTables.map((t) => t.name);
    const newTableNames = newTables.map((t) => t.name);

    for (const oldTable of oldTables) {
        if (!newTableNames.includes(oldTable.name)) {
            pushUnique(`Удалена таблица ${oldTable.name}`, {
                method: "DELETE",
                url: `/tables/${oldTable.id}`,
            });
        }
    }

    for (const newTable of newTables) {
        if (!oldTableNames.includes(newTable.name)) {
            pushUnique(`Добавлена таблица ${newTable.name}`, {
                method: "POST",
                url: `/tables`,
                body: {
                    name: newTable.name,
                    schema: newTable.schema,
                },
            });

            for (const col of newTable.columns) {
                pushUnique(`Добавлена колонка ${col.name} в таблицу ${newTable.name}`, {
                    method: "POST",
                    url: `/columns`,
                    body: {
                        table_id: newTable.id,
                        name: col.name,
                        type: col.data_type,
                        is_nullable: col.is_nullable,
                        comment: col.comment,
                    },
                });
            }

            if (newTable.primary_keys?.length) {
                pushUnique(`Добавлен первичный ключ в таблицу ${newTable.name}`, {
                    method: "POST",
                    url: `/primary-keys`,
                    body: {
                        table_id: newTable.id,
                        name: `pk_${newTable.name}`, // default name
                        columns: newTable.primary_keys.map((pk) => pk.name),
                    },
                });
            }

            continue;
        }

        const oldTable = getTableByName(oldTables, newTable.name);

        // --- COLUMNS ---
        const oldCols = oldTable.columns || [];
        const newCols = newTable.columns || [];

        const oldColNames = oldCols.map((c) => c.name);
        const newColNames = newCols.map((c) => c.name);

        for (const oldCol of oldCols) {
            if (!newColNames.includes(oldCol.name)) {
                pushUnique(`Удалена колонка ${oldCol.name} из таблицы ${oldTable.name}`, {
                    method: "DELETE",
                    url: `/columns/${oldCol.id}`,
                });
            }
        }

        for (const newCol of newCols) {
            if (!oldColNames.includes(newCol.name)) {
                pushUnique(`Добавлена колонка ${newCol.name} в таблицу ${newTable.name}`, {
                    method: "POST",
                    url: `/columns`,
                    body: {
                        table_id: newTable.id,
                        name: newCol.name,
                        type: newCol.data_type,
                        is_nullable: newCol.is_nullable,
                        comment: newCol.comment,
                    },
                });
            } else {
                const oldCol = oldCols.find((c) => c.name === newCol.name);

                if (!oldCol) continue;

                const diffs = [];
                if (oldCol.data_type !== newCol.data_type) diffs.push("тип");
                if (oldCol.is_nullable !== newCol.is_nullable) diffs.push("nullable");
                if (oldCol.default_value !== newCol.default_value) diffs.push("default");
                if (oldCol.comment !== newCol.comment) diffs.push("комментарий");

                if (diffs.length > 0) {
                    pushUnique(`Изменена колонка ${newCol.name} в таблице ${newTable.name} (${diffs.join(", ")})`, {
                        method: "PATCH",
                        url: `/columns/${oldCol.id}`,
                        body: {
                            name: newCol.name,
                            type: newCol.data_type,
                            is_nullable: newCol.is_nullable,
                            comment: newCol.comment,
                        },
                    });
                }
            }
        }

        // --- RELATIONSHIPS ---
        const oldRels = oldTable.relationships || [];
        const newRels = newTable.relationships || [];

        for (const oldRel of oldRels) {
            const stillExists = newRels.some((r) => relationshipsEqual(r, oldRel));
            if (!stillExists) {
                pushUnique(`Удалена связь ${serializeRel(oldRel)}`, {
                    method: "DELETE",
                    url: `/foreign-keys/${oldRel.id}`,
                });
            }
        }

        for (const newRel of newRels) {
            const alreadyExists = oldRels.some((r) => relationshipsEqual(r, newRel));
            if (!alreadyExists) {
                pushUnique(`Добавлена связь ${serializeRel(newRel)}`, {
                    method: "POST",
                    url: `/foreign-keys`,
                    body: {
                        source_table_schema: newRel.source_schema,
                        source_table_name: newRel.source_table_name,
                        source_column_names: [newRel.source_column_name],
                        target_table_schema: newRel.target_table_schema,
                        target_table_name: newRel.target_table_name,
                        target_column_names: [newRel.target_column_name],
                        constraint_name: newRel.constraint_name,
                    },
                });
            }
        }

        // --- PRIMARY KEYS ---
        const oldPKs = (oldTable.primary_keys || []).map((pk) => pk.name).sort();
        const newPKs = (newTable.primary_keys || []).map((pk) => pk.name).sort();

        if (!arrayEqual(oldPKs, newPKs)) {
            if (oldPKs.length > 0) {
                pushUnique(`Удалён первичный ключ из таблицы ${oldTable.name}`, {
                    method: "DELETE",
                    url: `/primary-keys?table_id=eq.${oldTable.id}`,
                });
            }

            if (newPKs.length > 0) {
                pushUnique(`Добавлен первичный ключ в таблицу ${newTable.name}`, {
                    method: "POST",
                    url: `/primary-keys`,
                    body: {
                        table_id: newTable.id,
                        name: `pk_${newTable.name}`,
                        columns: newPKs,
                    },
                });
            }
        }
    }

    return changes;
};
