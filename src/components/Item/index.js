import React, { useCallback, useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import CustomInput from "../Input/index";
import CustomCheck from "../Check/input";
import CustomTextarea from "../Textarea/index";
import CustomSelect from "../Select/index";
import CustomList from "../RelationsList/index";
import Button from "../Button/input.tsx";

import { useGlobalContext } from "../../state-providers/global/globalContext";
import { DATA_TYPES } from "../../constants/types";

const ColumnForm = ({ column, table }) => {
    console.log(`table: `, table);
    console.log(`column: `, column);
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

    if (!column) return <p>No column choosed</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <CustomInput
                id="table_name"
                label="Table Name"
                defaultValue={table.name}
                register={register}
                requiredMessage="Table name is required"
            />

            <CustomInput
                id="column_name"
                label="Column Name"
                defaultValue={column.name}
                register={register}
                requiredMessage="Column name is required"
            />

            <CustomSelect id="data_type" label="Column Type" options={DATA_TYPES} />

            <CustomTextarea id="comment" label="Comment" defaultValue={column.comment} />

            <CustomCheck id="is_nullable" label="Is Nullable" defaultChecked={column.is_nullable} />

            <CustomCheck id="is_unique" label="Is Unique" defaultChecked={column.is_unique} />

            <CustomList
                id="relationships"
                label="Relationships"
                currentTable={table.name}
                currentColumn={column.name}
                items={table.relationships}
            />

            <div style={{ display: "flex", gap: "10px" }}>
                <Button type="button" variant="failure" onClick={handleDiscardChanges}>
                    Discard changes
                </Button>
                <Button type="submit" variant="primary">
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
            <ColumnForm column={column} table={table} />
        </FormProvider>
    );
};

export default Item;
