import React, { useState, useEffect } from "react";

import { transformData } from "./utils";

import { useGlobalContext } from "../../state-providers/globalContext";

export const useMigrationState = () => {
    const [database, setDatabase] = useState(null);
    const [config, setConfig] = useState({ version: "No PostgreSQL version" });
    const [isError, setIsError] = useState(false);

    const { globalState } = useGlobalContext();

    useEffect(() => {
        const tables = globalState.modifiedTables;
        if (tables) {
            const transformedData = transformData(tables);
            setDatabase(transformedData);
            if (globalState.status === 500) {
                setIsError(true);
            }
        }
        const config = globalState.config;
        if (config) {
            setConfig(config);
        }
    }, [globalState]);

    return {
        database,
        isError,
        config,
        isItem: globalState.choosedColumn,
    };
};
