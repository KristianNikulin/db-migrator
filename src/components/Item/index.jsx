import React, { useCallback, useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Trans } from "@lingui/react";

import Input from "../Input";
import Check from "../Check";
import Textarea from "../Textarea";
import Select from "../Select";
import List from "../RelationsList";
import Button from "../Button";

import { useGlobalContext } from "../../state-providers/globalContext";
import { DATA_TYPES } from "../../constants/types";

const ColumnForm = ({ column, table, isMigration }) => {
    const { register, handleSubmit, reset, formState } = useFormContext();
    const { isDirty } = formState;

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isDirty) {
                event.preventDefault();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);

    const onSubmit = (data) => {
        console.log("Column Updated:", data);
    };

    const handleDiscardChanges = useCallback(() => {
        if (column) {
            reset({
                table_name: table.name,
                column_name: column.name,
                data_type: column.data_type,
                comment: column.comment,
                is_nullable: column.is_nullable,
                is_unique: column.is_unique,
                relationships: table.relationships,
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
                label="Table Name"
                defaultValue={table.name}
                register={register}
                requiredMessage="Table name is required"
                disabled={!isMigration}
            />

            <Input
                id="column_name"
                label="Column Name"
                defaultValue={column.name}
                register={register}
                requiredMessage="Column name is required"
                disabled={!isMigration}
            />

            <Select
                id="data_type"
                label="Column Type"
                options={DATA_TYPES}
                value={column.data_type}
                onChange={(value) => reset({ ...formState.values, data_type: value })}
                renderOption={(option) => <>{option.label}</>}
                renderValue={(value) => <>{value}</>}
                disabled={!isMigration}
            />

            <Textarea id="comment" label="Comment" defaultValue={column.comment} disabled={!isMigration} />

            <Check id="is_nullable" label="Is Nullable" defaultChecked={column.is_nullable} disabled={!isMigration} />

            <Check id="is_unique" label="Is Unique" defaultChecked={column.is_unique} disabled={!isMigration} />

            <List
                id="relationships"
                label="Relationships"
                currentTable={table.name}
                currentColumn={column}
                items={table.relationships}
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

const Item = () => {
    const { globalState } = useGlobalContext();

    const choosedColumn = globalState.choosedColumn?.name || null;
    const choosedTable = globalState.choosedTable?.data?.name || null;

    const table = globalState.modifiedTables?.find((item) => item.name === choosedTable) || null;
    const column = table?.columns?.find((item) => item.name === choosedColumn) || null;
    const isMigration = globalState.isMigration;

    const methods = useForm({
        defaultValues: table
            ? {
                  table_name: table.name,
                  column_name: column?.name,
                  data_type: column?.data_type,
                  comment: column?.comment,
                  is_nullable: column?.is_nullable,
                  is_unique: column?.is_unique,
                  relationships: table?.relationships,
              }
            : {},
    });

    return (
        <FormProvider {...methods}>
            <ColumnForm isMigration={isMigration} column={column} table={table} />
        </FormProvider>
    );
};

export default Item;
