import React, { useEffect } from "react";

import { reatomContext } from "@reatom/npm-react";
import { ctx, fetchData } from "./state";

import { Toastify } from "./tostify";

const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        // setTimeout(() => {
        fetchData(ctx);
        // }, 2400);
    }, []);

    return (
        <reatomContext.Provider value={ctx}>
            <Toastify>{children}</Toastify>
        </reatomContext.Provider>
    );
};

export default GlobalContextProvider;
