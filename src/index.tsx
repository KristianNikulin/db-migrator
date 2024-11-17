import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./pages";
import { GlobalContextProvider } from "./state-providers/global";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    // <React.StrictMode>
    <GlobalContextProvider>
        <App />
    </GlobalContextProvider>
    // </React.StrictMode>
);
