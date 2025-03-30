import { API } from "../lib/api";

export function getTables() {
    return API.httpRequest({
        method: "GET",
        url: "tables",
        errorMessage: "Failed to fetch tables",
        invokeOnHttpError: true,
        successMessage: "Tables were received successfully",
        invokeOnHttpSuccess: false,
    });
}

export function getConfig() {
    return API.httpRequest({
        method: "GET",
        url: "config/version",
        invokeOnHttpError: false,
    });
}
