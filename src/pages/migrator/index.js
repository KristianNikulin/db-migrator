import React, { useCallback } from "react";
import { ReactFlow, useNodesState, useEdgesState, addEdge, Controls, Background, Panel, MiniMap } from "@xyflow/react";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

import styles from "./styles.module.scss";
import "@xyflow/react/dist/style.css";

const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "11" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "22" } },
];

const initialEdges = [{ id: "1122", source: "1", target: "2", label: "to the", type: "step", animated: true }];

// крестик на соединении для удаления при миграции
// https://reactflow.dev/learn/customization/custom-edges

const Migrator = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
        [setEdges]
    );

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
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                // fitView
                            >
                                {/* контроль в настройки */}
                                <Controls />
                                {/* миникарту в настройки */}
                                {/* <MiniMap /> */}
                                {/* выбор фона в настройки */}
                                <Background variant="dots" gap={12} size={1} />
                                <Panel
                                    style={{ zIndex: 10, backgroundColor: "gray", padding: "10px" }}
                                    position="top-right"
                                >
                                    top-right
                                </Panel>
                            </ReactFlow>
                        </div>
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
};

export default Migrator;
