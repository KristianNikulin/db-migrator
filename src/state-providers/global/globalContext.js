import React, { createContext, useContext, useEffect, useState } from "react";

import { getTables } from "../../api";

const GlobalContext = createContext(null);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a ContextProvider");
    }
    return context;
};

export const ContextProvider = ({ children }) => {
    const [globalState, setGlobalState] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await getTables();
            const tables = response?.result || null;
            const status = response?.status || 500;
            if (tables) {
                setGlobalState({
                    originalTables: tables,
                    modifiedTables: tables,
                    changeHistory: [],
                    status,
                });
            } else {
                setGlobalState((prev) => ({ ...prev, status }));
            }
        };

        setTimeout(() => {
            fetchData();
        }, 2400); // убрать
    }, []);

    return <GlobalContext.Provider value={{ globalState, setGlobalState }}>{children}</GlobalContext.Provider>;
};
