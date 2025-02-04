import React from "react";

import { Toastify } from "./tostify";
import { ContextProvider } from "./globalContext";

export const GlobalContextProvider = ({ children }) => (
    <ContextProvider>
        <Toastify>{children}</Toastify>
    </ContextProvider>
);
