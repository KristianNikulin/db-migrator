import React, { useState, useEffect } from "react";

import { transformData } from "./utils";

import {
    changeHistoryAtom,
    choosedColumnAtom,
    configAtom,
    migrationStepAtom,
    statusAtom,
} from "../../state-providers/state";

import { useAtom } from "@reatom/npm-react";

export const useMigrationState = () => {
    const [tables] = useAtom(changeHistoryAtom);
    const [migrationStep] = useAtom(migrationStepAtom);
    const [config] = useAtom(configAtom);
    const [status] = useAtom(statusAtom);
    const [choosedColumn] = useAtom(choosedColumnAtom);

    const [database, setDatabase] = useState(null);
    const [isError, setIsError] = useState(false);
    const [configState, setConfigState] = useState({
        version: "No PostgreSQL version",
        active_connections: 0,
        max_connections: 0,
    });

    useEffect(() => {
        const curTables = tables[migrationStep] || null;
        if (curTables) {
            const transformedData = transformData(curTables);
            setDatabase(transformedData);
            if (status === 500) {
                setIsError(true);
            }
        }
        if (config) {
            setConfigState(config);
        }
    }, [tables, migrationStep, config, status]);

    return {
        database,
        isError,
        config: configState,
        isItem: Boolean(choosedColumn),
    };
};
