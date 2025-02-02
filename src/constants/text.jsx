export const ERROR_MESSAGE = {
    BANNED_RELATION_TYPE: `It's not recommended to make relation with this column!`,
};

export const BEGIN_STEPS = ["Select table and column from your database schema", "Click 'Start migration' button"];

export const DISCARD_CHANGES_WARNING = (
    <p>
        <span style={{ color: "red" }}>Внимание!</span> При отмене миграции все несохранённые изменения будут удалены!
    </p>
);
