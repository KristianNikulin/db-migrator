import React from "react";

import Visualizer from "../../components/Visualizer";
import CustomLoader from "../../components/Loader";
import Item from "../../components/Item";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { useMigrationState } from "./state";
import { BEGIN_STEPS } from "../../constants/text";

import styles from "./styles.module.scss";

/* миникарту в настройки */

/* выбор фона в настройки */

/* контроль в настройки */

/* отключение предупреждений в настройки (пример - связи с полями - время) */

// крестик на соединении для удаления при миграции
// https://reactflow.dev/learn/customization/custom-edges

const Migrator = () => {
    const { database, isError, config, isItem } = useMigrationState();
    console.log(`database: `, database);

    return (
        <div className={styles.migratorContainer}>
            <Allotment>
                <Allotment.Pane
                    className={!isItem ? styles.allotmentItem : {}}
                    preferredSize={"35%"}
                    minSize={400}
                    maxSize={700}
                >
                    <div className={styles.sidebar}>
                        {isItem ? (
                            <Item />
                        ) : (
                            <div className={styles.noitem}>
                                <p>To begin migrating your database, follow these steps:</p>
                                <ol>
                                    {BEGIN_STEPS.map((step, index) => (
                                        <li key={index}>
                                            {index + 1}. {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
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
