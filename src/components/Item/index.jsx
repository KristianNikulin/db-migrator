import React, { useCallback, useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Trans } from "@lingui/react";
import { useAtom } from "@reatom/npm-react";
import { updateHistory } from "../../lib/utils";

import Input from "../Input";
import Check from "../Check";
import Textarea from "../Textarea";
import Select from "../Select";
import RelationsList from "../RelationsList";
import Button from "../Button";

import {
    changeHistoryAtom,
    choosedColumnAtom,
    choosedTableAtom,
    isMigrationAtom,
    migrationStepAtom,
} from "../../state-providers/state";
import { COLUMN_RELATION_STATUS, DATA_TYPES } from "../../constants/types";

import styles from "./styles.module.scss";

const Item = ({ column, table, isMigration }) => {
    const { register, handleSubmit, reset, formState } = useFormContext();
    const { isDirty } = formState;

    // useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //         if (isDirty) {
    //             event.preventDefault();
    //         }
    //     };
    //     window.addEventListener("beforeunload", handleBeforeUnload);
    //     return () => {
    //         window.removeEventListener("beforeunload", handleBeforeUnload);
    //     };
    // }, [isDirty]);

    const onSubmit = (data) => {
        updateHistory(data, "column");
        // handleDiscardChanges(); // ????????
    };

    const handleDiscardChanges = useCallback(() => {
        if (column) {
            const relationships = (table?.relationships || []).map((rel) => ({
                ...rel,
                status: COLUMN_RELATION_STATUS.EXISTING,
            }));
            reset({
                table_name: table.name,
                column_name: column.name,
                data_type: column.data_type,
                comment: column.comment,
                is_nullable: column.is_nullable,
                is_unique: column.is_unique,
                relationships,
            });
        }
    }, [column, reset]);

    useEffect(() => {
        handleDiscardChanges();
    }, [column, reset]);

    if (!column) return;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.itemFormContainer}>
            <Input
                id="table_name"
                label={<Trans id="tableName" message="Table Name" />}
                defaultValue={table.name}
                register={register}
                requiredMessage={<Trans id="fieldRequired" message="Field is required" />}
                disabled={!isMigration}
            />

            <Input
                id="column_name"
                label={<Trans id="columnName" message="Column Name" />}
                defaultValue={column.name}
                register={register}
                requiredMessage={<Trans id="fieldRequired" />}
                disabled={!isMigration}
            />

            <Select
                id="data_type"
                label={<Trans id="columnType" message="Column Type" />}
                options={DATA_TYPES}
                value={column.data_type}
                onChange={(value) => reset({ ...formState.values, data_type: value })}
                renderOption={(option) => <>{option.label}</>}
                renderValue={(value) => <>{value}</>}
                disabled={!isMigration}
                style={{ width: "100%" }}
            />

            <Textarea
                id="comment"
                label={<Trans id="columnComment" message="Comment" />}
                defaultValue={column.comment}
                disabled={!isMigration}
            />

            <Check
                id="is_nullable"
                label={<Trans id="columnNullable" message="Is Nullable" />}
                disabled={!isMigration}
            />

            <Check id="is_unique" label={<Trans id="columnUnique" message="Is Unique" />} disabled={!isMigration} />

            <RelationsList
                id="relationships"
                label={<Trans id="columnRelationships" message="Relationships" />}
                currentTable={table.name}
                currentColumn={column}
                disabled={!isMigration}
            />

            <div className={styles.itemButtonsContainer}>
                <Button
                    className={styles.itemButton}
                    disabled={!isMigration || !isDirty}
                    type="button"
                    variant="failure"
                    onClick={handleDiscardChanges}
                >
                    <Trans id="discardChanges" message="Discard changes" />
                </Button>
                <Button
                    className={styles.itemButton}
                    disabled={!isMigration || !isDirty}
                    type="submit"
                    variant="success"
                >
                    <Trans id="save" message="Save" />
                </Button>
            </div>
        </form>
    );
};

const ColumnForm = () => {
    const [choosedColumn] = useAtom(choosedColumnAtom);
    const [choosedTable] = useAtom(choosedTableAtom);
    const [tables] = useAtom(changeHistoryAtom);
    const [migrationStep] = useAtom(migrationStepAtom);
    const [isMigration] = useAtom(isMigrationAtom);

    const curTables = tables[migrationStep] || null;

    const table = curTables?.find((item) => item.name === choosedTable?.data?.name) || null;
    const column = table?.columns?.find((item) => item.name === choosedColumn?.name) || null;
    const relationships = (table?.relationships || []).map((rel) => ({
        ...rel,
        status: rel.status || COLUMN_RELATION_STATUS.EXISTING,
    }));

    const methods = useForm({
        defaultValues: table
            ? {
                  table_name: table.name,
                  column_name: column?.name,
                  data_type: column?.data_type,
                  comment: column?.comment,
                  is_nullable: column?.is_nullable,
                  is_unique: column?.is_unique,
                  relationships,
              }
            : {},
    });

    return (
        <FormProvider {...methods}>
            <Item isMigration={isMigration} column={column} table={table} />
        </FormProvider>
    );
};

export default ColumnForm;
