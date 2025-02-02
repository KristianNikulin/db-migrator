import React, { useCallback, useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import CustomInput from "../Input/index";
import CustomCheck from "../Check/input";
import CustomTextarea from "../Textarea/index";
import CustomSelect from "../Select/index";
import CustomList from "../RelationsList/index";
import Button from "../Button/index";

import { useGlobalContext } from "../../state-providers/global/globalContext";
import { DATA_TYPES } from "../../constants/types";

const ColumnForm = ({ column, table, isMigration }) => {
    const { register, handleSubmit, reset } = useFormContext();

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
            <CustomInput
                id="table_name"
                label="Table Name"
                defaultValue={table.name}
                register={register}
                requiredMessage="Table name is required"
                disabled={!isMigration}
            />

            <CustomInput
                id="column_name"
                label="Column Name"
                defaultValue={column.name}
                register={register}
                requiredMessage="Column name is required"
                disabled={!isMigration}
            />

            <CustomSelect id="data_type" label="Column Type" options={DATA_TYPES} disabled={!isMigration} />

            <CustomTextarea id="comment" label="Comment" defaultValue={column.comment} disabled={!isMigration} />

            <CustomCheck
                id="is_nullable"
                label="Is Nullable"
                defaultChecked={column.is_nullable}
                disabled={!isMigration}
            />

            <CustomCheck id="is_unique" label="Is Unique" defaultChecked={column.is_unique} disabled={!isMigration} />

            <CustomList
                id="relationships"
                label="Relationships"
                currentTable={table.name}
                currentColumn={column}
                items={table.relationships}
                disabled={!isMigration}
            />

            <div style={{ display: "flex", gap: "10px" }}>
                <Button disabled={!isMigration} type="button" variant="failure" onClick={handleDiscardChanges}>
                    Discard changes
                </Button>
                <Button disabled={!isMigration} type="submit" variant="success">
                    Save
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
