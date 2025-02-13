import React, { createContext, useContext, useEffect, useState } from "react";
import { getTables } from "../api";
import { getConfig } from "../api";
import { API } from "../lib/api";

// Описание типов
interface GlobalState {
    originalTables: any[] | null;
    changeHistory: any[];
    status: number;
    choosedTable: any | null;
    choosedColumn: any | null;
    config: any | null;
    isMigration: boolean;
    migrationStep: number;
}

interface GlobalContextType {
    globalState: GlobalState;
    setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

interface ContextProviderProps {
    children: React.ReactNode;
}

// Создание контекста с типизацией
const GlobalContext = createContext<GlobalContextType | null>(null);

// Хук для использования контекста
export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a ContextProvider");
    }
    return context;
};

// Провайдер контекста
export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [globalState, setGlobalState] = useState<GlobalState>({
        originalTables: null,
        changeHistory: [],
        status: 500,
        choosedTable: null,
        choosedColumn: null,
        config: null,
        isMigration: false,
        migrationStep: 0,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const response = await getTables();
            const configResponse = await getConfig();

            if (API.isResponseOk(response)) {
                if (!isMounted) return;

                const tables = response?.result || null;
                const status = response?.status || 500;
                const config = configResponse?.result || null;

                if (tables) {
                    setGlobalState({
                        originalTables: tables,
                        changeHistory: [tables],
                        status,
                        choosedTable: null,
                        choosedColumn: null,
                        config: config,
                        isMigration: false,
                        migrationStep: 0,
                    });
                } else {
                    setGlobalState((prev) => ({ ...prev, status, choosedTable: null, choosedColumn: null }));
                }
            } else {
                if (isMounted) {
                    setTimeout(fetchData, 15000);
                }
            }
        };

        // setTimeout(() => {
        fetchData();
        // }, 2400);

        return () => {
            isMounted = false;
        };
    }, []);

    return <GlobalContext.Provider value={{ globalState, setGlobalState }}>{children}</GlobalContext.Provider>;
};
