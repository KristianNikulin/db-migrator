import { get, mapValues } from "lodash";
import { META_BASE_URL } from "../constants/env";
import { toast } from "../state-providers/global/tostify";

class APIService {
    isResponseOk = (res) => {
        return res?.status === "OK" || res?.result?.status === "OK";
    };

    httpRequest = async ({
        baseURL,
        url,
        method = "GET",
        data,
        params,
        errorMessage,
        successMessage,
        infoMessage,
        infoMessageDuration,
        invokeOnHttpError = true,
        invokeOnHttpSuccess = false,
        useRespErrMsg = false,
        getErrorResponse = this.#getDefaultError,
        getSuccessResponse = this.#getDefaultSuccessResult,
        ...config
    }) => {
        const finalURL = this.#constructURL(baseURL || META_BASE_URL, url, params);
        const fetchConfig = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...config.headers,
            },
            ...(data ? { body: JSON.stringify(data) } : {}),
        };

        try {
            const response = await fetch(finalURL, fetchConfig);

            const resData = await this.#parseJSON(response);
            response.data = resData;

            return this.#getUnifiedHttpClientResponse({
                response,
                errorMessage,
                invokeOnHttpError,
                invokeOnHttpSuccess,
                successMessage,
                infoMessage,
                infoMessageDuration,
                useRespErrMsg,
                getSuccessResponse,
                getErrorResponse,
            });
        } catch (mainRequestError) {
            console.error(`mainRequestError: `, mainRequestError);

            return this.#getUnifiedHttpClientError({
                response: mainRequestError,
                errorMessage,
                invokeOnHttpError,
                useRespErrMsg,
                getErrorResponse,
            });
        }
    };

    #getDefaultError = (error = {}) => {
        return (
            get(error, "data") || {
                error: "Unknown request error",
                message: "Unknown request error",
                statusCode: "404",
            }
        );
    };

    #getDefaultSuccessResult = (result = {}) => {
        return {
            status: result?.status || "OK",
            result: result?.data,
        };
    };

    #constructURL = (baseURL, url, params) => {
        const queryString = params ? "?" + new URLSearchParams(this.#normalizeQueryParams(params)).toString() : "";
        return `${baseURL}/${url}${queryString}`;
    };

    #normalizeQueryParams = (params = {}) => {
        return mapValues(params, (value) => (Array.isArray(value) ? value.join(",") : value));
    };

    #parseJSON = async (response) => {
        try {
            return await response.json();
        } catch {
            return null;
        }
    };

    #getUnifiedHttpClientResponse = ({
        response,
        errorMessage,
        errorResult,
        invokeOnHttpError,
        invokeOnHttpSuccess,
        successMessage,
        useRespErrMsg,
        getSuccessResponse,
        infoMessage,
        infoMessageDuration,
        getErrorResponse,
    }) => {
        if (response.data?.status === "OK" || response.status === 200) {
            if (invokeOnHttpSuccess) {
                toast.success(successMessage);
                infoMessage && toast.info(infoMessage, { autoClose: infoMessageDuration });
            }

            return getSuccessResponse(response);
        }
        return this.#getUnifiedHttpClientError({
            response,
            errorMessage,
            errorResult,
            invokeOnHttpError,
            useRespErrMsg,
            getErrorResponse,
        });
    };

    #getUnifiedHttpClientError = ({
        response,
        errorMessage,
        errorResult,
        invokeOnHttpError,
        useRespErrMsg,
        getErrorResponse,
    }) => {
        console.error(`errorMessage: `, errorMessage);

        if (invokeOnHttpError) {
            const msg = errorMessage || "Unknown error occurred";
            toast.error(msg);
        }

        if (getErrorResponse) {
            return getErrorResponse(response);
        }

        return {
            response: {
                status: "ERROR",
                error: response?.data?.error,
                result: errorResult || response?.data?.message,
                message: errorResult || response?.data?.message,
                code: response?.status,
            },
        };
    };
}

export const API = new APIService();
