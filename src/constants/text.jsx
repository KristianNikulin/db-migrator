import { Trans } from "@lingui/react";

export const PROJECT_NAME = "DB Migrator";

export const ERROR_MESSAGE = {
    BANNED_RELATION_TYPE: (
        <Trans id="notRecommended" message="It's not recommended to make relation with this column!" />
    ),
};

export const BEGIN_STEPS = [
    <Trans id="selectTable" message="Select table and column from your database schema" />,
    <Trans id="clickStartMigration" message="Click 'Start migration' button" />,
];

export const DISCARD_CHANGES_WARNING = (
    <Trans id="attention" message="Attention! If you cancel the migration, all unsaved changes will be deleted!" />
);

export const CHOOSE_COLUMN_MESSAGE = BEGIN_STEPS[0];
