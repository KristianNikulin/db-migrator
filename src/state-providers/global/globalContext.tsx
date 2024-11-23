import React, { createContext, useContext, useEffect, useState } from "react";
import { getTables } from "../../api";

// Описание типов
interface GlobalState {
    originalTables: any[] | null;
    modifiedTables: any[] | null;
    changeHistory: any[];
    status: number;
    choosedTable: any | null;
    choosedColumn: any | null;
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
        modifiedTables: null,
        changeHistory: [],
        status: 500,
        choosedTable: null,
        choosedColumn: null,
    });

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
                    choosedTable: null,
                    choosedColumn: null,
                });
            } else {
                setGlobalState((prev) => ({ ...prev, status, choosedTable: null, choosedColumn: null }));
            }
        };

        setTimeout(() => {
            fetchData();
        }, 2400); // Уберите задержку в реальном коде
    }, []);

    return <GlobalContext.Provider value={{ globalState, setGlobalState }}>{children}</GlobalContext.Provider>;
};
