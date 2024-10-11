import React from "react";
import Visualizer from "../../components/Visualizer";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

import styles from "./styles.module.scss";

// ПОТОМ ЗАМЕНА НА ДИНАМИЧЕСКИЕ ДАННЫЕ
import databases from "../../config/databases.json";

/* миникарту в настройки */

/* выбор фона в настройки */

// крестик на соединении для удаления при миграции
// https://reactflow.dev/learn/customization/custom-edges

const Migrator = () => {
    const databaseNames = Object.keys(databases);
    const databaseName = databaseNames[0];

    return (
        <div className={styles.migratorContainer}>
            <Allotment>
                <Allotment.Pane preferredSize={"35%"} minSize={500} maxSize={700}>
                    <div className={styles.sidebar}>
                        <h2>Sidebar</h2>
                    </div>
                </Allotment.Pane>
                <Allotment.Pane preferredSize={"65%"}>
                    <div className={styles.reactFlowContainer}>
                        <div className={styles.projectNamesContainer}>projectName</div>
                        <div className={styles.reactFlow}>
                            <Visualizer database={databaseName} />
                        </div>
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
};

export default Migrator;

{
    /* <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                // fitView
                            >
                                {/* контроль в настройки */
}
// <Controls />
{
    /* миникарту в настройки */
}
{
    /* <MiniMap /> */
}
{
    /* выбор фона в настройки */
}
// <Background variant="dots" gap={12} size={1} />
// <Panel
// style={{ zIndex: 10, backgroundColor: "gray", padding: "10px" }}
// position="top-right"
// >
// top-right
// </Panel>
// </ReactFlow> */}
