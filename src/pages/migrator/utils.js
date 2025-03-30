import { adjustTablePositions } from "../../components/Visualizer/helpers/adjustTablePositions";

export function transformData(data) {
    const tablesNameColor = "#FFA500";

    const tables = [];
    const edgeConfigs = [];

    const schemaColors = {
        DEFAULT: "#91C4F2",
        public: "#91C4F2",
    };

    data.forEach((table) => {
        const tableInfo = {
            name: table.name,
            description: table.comment || "",
            schemaColor: tablesNameColor,
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
                          : "",
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
