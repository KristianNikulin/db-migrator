export const DATA_TYPES = [
    { value: "integer", label: "integer" },
    { value: "text", label: "text" },
    { value: "numeric", label: "numeric" },
    { value: "bigint", label: "bigint" },
    { value: "timestamp with time zone", label: "timestamp with time zone" },
];

export const BANNED_RELATION_TYPES = ["timestamp with time zone"];

export const LANGUAGES = [
    { code: "EN", label: "English", flag: "GB" },
    { code: "RU", label: "Русский", flag: "RU" },
];

export const COLUMN_RELATION_STATUS = {
    EXISTING: "existing",
    NEW: "new",
    DELETED: "deleted",
};
