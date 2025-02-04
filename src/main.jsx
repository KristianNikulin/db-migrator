import React from "react";
import ReactDOM from "react-dom/client";

import App from "./pages";
import { GlobalContextProvider } from "./state-providers";
import { ThemeProvider } from "./state-providers/theme";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

import enMessages from "./locales/en/messages";
import ruMessages from "./locales/ru/messages";

i18n.load({
    EN: enMessages.messages,
    RU: ruMessages.messages,
});
i18n.activate("EN");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    // <React.StrictMode>
    <I18nProvider i18n={i18n}>
        <ThemeProvider>
            <GlobalContextProvider>
                <App />
            </GlobalContextProvider>
        </ThemeProvider>
    </I18nProvider>
    // </React.StrictMode>
);
