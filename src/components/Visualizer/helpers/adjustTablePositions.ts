export interface DBField {
    name: string;
    handleType: string;
    type: string;
    key: boolean;
    description?: string;
}

export interface DBTable {
    name: string;
    schemaColor: string;
    description: string;
    columns: DBField[];
    x?: number;
    y?: number;
}

export interface DBRelationship {
    source: string;
    sourceKey: string;
    target: string;
    targetKey: string;
    relation: "hasMany" | "hasOne";
}

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
// export const deepCopy = <T>(obj: T): T => structuredClone(obj);

export const adjustTablePositions = ({
    tables: inputTables,
    relationships: inputRelationships,
}: {
    tables: DBTable[];
    relationships: DBRelationship[];
}): { [key: string]: { x: number; y: number } } => {
    const tables = deepCopy(inputTables);
    const relationships = deepCopy(inputRelationships);

    const tableWidth = 200;
    const tableHeight = 300;
    const gapX = 100;
    const gapY = 100;
    const startX = 100;
    const startY = 100;

    const tableConnections = new Map<string, Set<string>>();
    relationships.forEach((rel) => {
        const sourceTable = rel.source.split(".")[1];
        const targetTable = rel.target.split(".")[1];
        if (!tableConnections.has(sourceTable)) {
            tableConnections.set(sourceTable, new Set());
        }
        if (!tableConnections.has(targetTable)) {
            tableConnections.set(targetTable, new Set());
        }
        tableConnections.get(sourceTable)!.add(targetTable);
        tableConnections.get(targetTable)!.add(sourceTable);
    });

    const sortedTables = [...tables].sort(
        (a, b) => (tableConnections.get(b.name)?.size || 0) - (tableConnections.get(a.name)?.size || 0)
    );

    const positionedTables = new Set<string>();
    const tablePositions: { [key: string]: { x: number; y: number } } = {}; // Объект для хранения только позиций

    const isOverlapping = (x: number, y: number, currentTableName: string): boolean => {
        return Object.entries(tablePositions).some(([tableName, pos]) => {
            if (tableName === currentTableName) return false;
            return Math.abs(x - pos.x) < tableWidth + gapX && Math.abs(y - pos.y) < tableHeight + gapY;
        });
    };

    const findNonOverlappingPosition = (baseX: number, baseY: number, tableName: string): { x: number; y: number } => {
        const spiralStep = Math.max(tableWidth, tableHeight) / 2;
        let angle = 0;
        let radius = 0;
        let iterations = 0;
        const maxIterations = 1000;

        while (iterations < maxIterations) {
            const x = baseX + radius * Math.cos(angle);
            const y = baseY + radius * Math.sin(angle);
            if (!isOverlapping(x, y, tableName)) {
                return { x, y };
            }
            angle += Math.PI / 4;
            if (angle >= 2 * Math.PI) {
                angle = 0;
                radius += spiralStep;
            }
            iterations++;
        }

        return {
            x: baseX + radius * Math.cos(angle),
            y: baseY + radius * Math.sin(angle),
        };
    };

    const positionTable = (table: DBTable, baseX: number, baseY: number) => {
        if (positionedTables.has(table.name)) return;

        const { x, y } = findNonOverlappingPosition(baseX, baseY, table.name);

        tablePositions[table.name] = { x, y };
        positionedTables.add(table.name);

        const connectedTables = tableConnections.get(table.name) || new Set();
        let angle = 0;
        const angleStep = (2 * Math.PI) / connectedTables.size;

        connectedTables.forEach((connectedTableName) => {
            if (!positionedTables.has(connectedTableName)) {
                const connectedTable = tables.find((t) => t.name === connectedTableName);
                if (connectedTable) {
                    const newX = x + Math.cos(angle) * (tableWidth + gapX * 2);
                    const newY = y + Math.sin(angle) * (tableHeight + gapY * 2);
                    positionTable(connectedTable, newX, newY);
                    angle += angleStep;
                }
            }
        });
    };

    sortedTables.forEach((table, index) => {
        if (!positionedTables.has(table.name)) {
            const row = Math.floor(index / 6);
            const col = index % 6;
            const x = startX + col * (tableWidth + gapX * 2);
            const y = startY + row * (tableHeight + gapY * 2);
            positionTable(table, x, y);
        }
    });

    return tablePositions;
};
