import React, { useCallback, useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Trans } from "@lingui/react";

import Input from "../Input";
import Check from "../Check";
import Textarea from "../Textarea";
import Select from "../Select";
import RelationsList from "../RelationsList";
import Button from "../Button";

import { useGlobalContext } from "../../state-providers/globalContext";
import { COLUMN_RELATION_STATUS, DATA_TYPES } from "../../constants/types";

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
        console.log("Column Updated:", data);
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
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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

            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <Button
                    style={{ flex: 1 }}
                    disabled={!isMigration || !isDirty}
                    type="button"
                    variant="failure"
                    onClick={handleDiscardChanges}
                >
                    <Trans id="discardChanges" message="Discard changes" />
                </Button>
                <Button style={{ flex: 1 }} disabled={!isMigration || !isDirty} type="submit" variant="success">
                    <Trans id="save" message="Save" />
                </Button>
            </div>
        </form>
    );
};

const ColumnForm = () => {
    const { globalState } = useGlobalContext();

    const choosedColumn = globalState.choosedColumn?.name || null;
    const choosedTable = globalState.choosedTable?.data?.name || null;

    const historyTables = globalState.changeHistory[globalState.migrationStep] || null;
    const tables = !!historyTables ? historyTables : globalState.originalTables;

    const table = tables?.find((item) => item.name === choosedTable) || null;
    const column = table?.columns?.find((item) => item.name === choosedColumn) || null;
    const isMigration = globalState.isMigration;
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
