import React, { useEffect, useState } from "react";
import Visualizer from "../../components/Visualizer";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { adjustTablePositions } from "../../components/Visualizer/helpers/adjustTablePositions";

import * as styles from "./styles.module.scss";

// import axios from "axios";

/* миникарту в настройки */

/* выбор фона в настройки */

/* контроль в настройки */

// крестик на соединении для удаления при миграции
// https://reactflow.dev/learn/customization/custom-edges

function transformData(data) {
    const tables = [];

    const edgeConfigs = [];

    const schemaColors = {
        DEFAULT: "#91C4F2",
        public: "#91C4F2",
    };

    data.forEach((table) => {
        if (table.name?.includes("knex")) {
            return;
        }

        const tableInfo = {
            name: table.name,
            description: table.comment || "",
            schemaColor: "#91C4F2",
            columns: table.columns
                .map((column) => ({
                    name: column.name,
                    description: column.comment || "",
                    type: column.data_type,
                    key: table.primary_keys.some((pk) => pk.name === column.name),
                    handleType: table.relationships.some((rel) => rel.source_column_name === column.name)
                        ? "target"
                        : table.relationships.some((rel) => rel.target_column_name === column.name)
                          ? "source"
                          : "", // handleType НЕ РАБОТАЕТ
                }))
                .filter((column) => column.name),
        };

        tables.push(tableInfo);

        table.relationships.forEach((rel) => {
            const relationType = rel.source_column_name === rel.target_column_name ? "hasOne" : "hasMany";

            const edgeConfig = {
                source: `${rel.target_table_schema}.${rel.target_table_name}`,
                sourceKey: rel.target_column_name,
                target: `${rel.source_schema}.${rel.source_table_name}`,
                targetKey: rel.source_column_name,
                relation: relationType,
            };

            const isDuplicate = edgeConfigs.some(
                (existingEdge) =>
                    existingEdge.source === edgeConfig.source &&
                    existingEdge.sourceKey === edgeConfig.sourceKey &&
                    existingEdge.target === edgeConfig.target &&
                    existingEdge.targetKey === edgeConfig.targetKey
            );

            if (!isDuplicate) {
                edgeConfigs.push(edgeConfig);
            }
        });
    });

    const tablePositions = adjustTablePositions({ tables, relationships: edgeConfigs });

    return {
        tables,
        edgeConfigs,
        schemaColors,
        tablePositions,
    };
}

const Migrator = () => {
    const [database, setDatabase] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/tables"); // ЗАМЕНИТЬ НА AXIOS
                const data = await response.json();
                const transformedData = transformData(data);
                setDatabase(transformedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.migratorContainer}>
            <Allotment>
                <Allotment.Pane preferredSize={"35%"} minSize={400} maxSize={700}>
                    <div className={styles.sidebar}>
                        <h2>Sidebar</h2>
                    </div>
                </Allotment.Pane>
                <Allotment.Pane preferredSize={"65%"}>
                    <div className={styles.reactFlowContainer}>
                        <div className={styles.projectNamesContainer}>projectName</div>
                        <div className={styles.reactFlow}>{database && <Visualizer database={database} />}</div>
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
};

export default Migrator;
