import React, { useState, useEffect } from "react";

import { transformData } from "./utils";

import { useGlobalContext } from "../../state-providers/global/globalContext";

export const useMigrationState = () => {
    const [database, setDatabase] = useState(null);
    const [isError, setIsError] = useState(false);

    const { globalState } = useGlobalContext();

    useEffect(() => {
        const tables = globalState.modifiedTables;
        if (tables) {
            const transformedData = transformData(globalState.modifiedTables);
            setDatabase(transformedData);
        }
        if (globalState.status === 500) {
            setIsError(true);
        }
    }, [globalState]);

    return {
        database,
        isError,
    };
};
