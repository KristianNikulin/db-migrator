import { getTables } from "../api";
import { getConfig } from "../api";
import { API } from "../lib/api";

import { atom, action } from "@reatom/framework";
import { createCtx } from "@reatom/framework";

export const ctx = createCtx();

export const originalTablesAtom = atom<any[] | null>(null, "originalTablesAtom");
export const changeHistoryAtom = atom<any[]>([], "changeHistoryAtom");
export const statusAtom = atom<number>(500, "statusAtom");
export const choosedTableAtom = atom<any | null>(null, "choosedTableAtom");
export const choosedColumnAtom = atom<any | null>(null, "choosedColumnAtom");
export const configAtom = atom<any | null>(null, "configAtom");
export const isMigrationAtom = atom<boolean>(false, "isMigrationAtom");
export const migrationStepAtom = atom<number>(0, "migrationStepAtom");

export const setOriginalTables = action((ctx, tables: any[] | null) => {
    originalTablesAtom(ctx, tables);
}, "setOriginalTables");

export const setChangeHistory = action((ctx, history: any[]) => {
    changeHistoryAtom(ctx, history);
}, "setChangeHistory");

export const setStatus = action((ctx, status: number) => {
    statusAtom(ctx, status);
}, "setStatus");

export const setChoosedTable = action((ctx, table: any | null) => {
    choosedTableAtom(ctx, table);
}, "setChoosedTable");

export const setChoosedColumn = action((ctx, column: any | null) => {
    choosedColumnAtom(ctx, column);
}, "setChoosedColumn");

export const setConfig = action((ctx, config: any | null) => {
    configAtom(ctx, config);
}, "setConfig");

export const setIsMigration = action((ctx, isMigration: boolean) => {
    isMigrationAtom(ctx, isMigration);
}, "setIsMigration");

export const setMigrationStep = action((ctx, step: number) => {
    migrationStepAtom(ctx, step);
}, "setMigrationStep");

// Функция загрузки данных
export const fetchData = action(async (ctx) => {
    const response = await getTables();
    const configResponse = await getConfig();

    if (API.isResponseOk(response)) {
        const tables = response?.result || null;
        const status = response?.status || 500;
        const config = configResponse?.result || null;

        originalTablesAtom(ctx, tables);
        changeHistoryAtom(ctx, tables ? [tables] : []);
        statusAtom(ctx, status);
        configAtom(ctx, config);
    } else {
        setTimeout(() => fetchData(ctx), 15000);
    }
}, "fetchData");

// const fetchIssues = reatomAsync(async (ctx, query: string) => {
//     await sleep(350);
//     const { items } = await api.fetchIssues(query, ctx.controller);
//     return items;
// }, "fetchIssues");
