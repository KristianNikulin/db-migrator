import { API } from "../lib/api";

export function getTables() {
    return API.httpRequest({
        method: "GET",
        url: "tables",
        errorMessage: "Failed to fetch tables",
        invokeOnHttpError: true,
        successMessage: "Tables were received successfully", // убрать
        invokeOnHttpSuccess: true, // убрать
    });
}

export function getConfig() {
    return API.httpRequest({
        method: "GET",
        url: "config/version",
        invokeOnHttpError: false,
    });
}
