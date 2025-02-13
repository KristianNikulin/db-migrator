export const updateHistory = (el, type = "column", state, set) => {
    console.log(`state: `, state);
    switch (type) {
        case "column":
            const tables = state.changeHistory[state.migrationStep] || null;

            const updatedTables = tables.map((table) => {
                if (table.name === state.choosedTable.data.name) {
                    return {
                        ...table,
                        name: el.table_name,
                        columns: table.columns.map((column) =>
                            column.name === state.choosedColumn.name
                                ? {
                                      ...column,
                                      name: el.column_name,
                                      table: el.table_name,
                                      comment: el.comment,
                                      data_type: el.data_type,
                                      is_nullable: el.is_nullable ?? false,
                                      is_unique: el.is_unique ?? false,
                                  }
                                : column
                        ),
                        relationships: el.relationships,
                    };
                }
                return table;
            });
            // console.log(`updatedTables: `, updatedTables);
            // console.log(el);
            set((prev) => ({
                ...prev,
                changeHistory: [...state.changeHistory, updatedTables],
                migrationStep: state.migrationStep + 1,
                choosedColumn: { ...state.choosedColumn, name: el.column_name },
                choosedTable: { ...state.choosedTable, data: { ...state.choosedTable.data, name: el.table_name } },
            }));
            break;

        case "table":
            console.log("table check");
            break;

        default:
            break;
    }

    return;
};

// setGlobalState((prev) => ({ ...prev, status, choosedTable: null, choosedColumn: null }));

// ПОТОМ - ПРИ ИЗМЕНЕНИИ НА КАКОМ-ТО ШАГЕ УДАЛЯИТ ИЗ ИСТОРИИ ВСЕ ПОСЛЕДУЮЩИЕ И СМОТРЕТЬ НА ПОСЛЕДНИЙ (КОТОРЫЙ ДОБАВИЛИ)
