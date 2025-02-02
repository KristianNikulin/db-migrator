import React from "react";

import ReactFlow, { Background } from "reactflow";

import styles from "./styles.module.scss";

const Settings = () => {
    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsMainBlock}>
                <h1>Migrator settings</h1>
                <h3>Settings for visualizer</h3>
                <div className={styles.settingsReactFlow}>
                    <ReactFlow style={{ border: "1px solid black" }} proOptions={{ hideAttribution: true }}>
                        <Background variant={"dots"} gap={12} size={1} />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
};

export default Settings;
