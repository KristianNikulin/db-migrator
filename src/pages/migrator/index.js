import React from "react";

import Visualizer from "../../components/Visualizer";
import CustomLoader from "../../components/Loader";
import Item from "../../components/Item";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { useMigrationState } from "./state";

import * as styles from "./styles.module.scss";

/* миникарту в настройки */

/* выбор фона в настройки */

/* контроль в настройки */

// крестик на соединении для удаления при миграции
// https://reactflow.dev/learn/customization/custom-edges

const Migrator = () => {
    const { database, isError, config } = useMigrationState();

    return (
        <div className={styles.migratorContainer}>
            <Allotment>
                <Allotment.Pane preferredSize={"35%"} minSize={400} maxSize={700}>
                    <div className={styles.sidebar}>
                        <Item />
                    </div>
                </Allotment.Pane>
                <Allotment.Pane preferredSize={"65%"}>
                    <div className={styles.reactFlowContainer}>
                        <div className={styles.projectNamesContainer}>{config.version}</div>
                        <div className={styles.reactFlow}>
                            {database ? (
                                <Visualizer database={database} />
                            ) : isError ? (
                                <p>Service is currently unavailable</p>
                            ) : (
                                <CustomLoader type="box-up" />
                            )}
                        </div>
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
};

export default Migrator;
