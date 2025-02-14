import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
    Node,
    useNodesState,
    useEdgesState,
    Controls,
    ControlButton,
    Background,
    useStoreApi,
    ReactFlowProvider,
    getConnectedEdges,
    OnSelectionChangeParams,
    NodeChange,
    getIncomers,
    getOutgoers,
    ReactFlowInstance,
    MiniMap,
    Panel,
    Edge,
} from "reactflow";

import { MaximizeIcon, MinimizeIcon, InfoIcon, InfoPopup, Markers, TableNode } from "./components";

import {
    edgeClassName,
    edgeMarkerName,
    calculateTargetPosition,
    calculateSourcePosition,
    initializeNodes,
    moveSVGInFront,
    setHighlightEdgeClassName,
    logTablePositions,
    setEdgeClassName,
    calculateEdges,
} from "./helpers";

import { EdgeConfig, DatabaseConfig } from "./types";

import { Trans } from "@lingui/react";

// this is important! You need to import the styles from the lib to make it work
import "reactflow/dist/style.css";
import "./Style";
// import DatabaseIcon from "./components/DatabaseIcon";
import Button from "../Button";
import Modal from "../Modal";

import { changeHistoryAtom, choosedColumnAtom, isMigrationAtom, setChoosedTable } from "../../state-providers/state";
import { useAction, useAtom } from "@reatom/npm-react";

import { DISCARD_CHANGES_WARNING } from "../../constants/text";

const nodeTypes = {
    table: TableNode,
};

interface FlowProps {
    currentDatabase: DatabaseConfig;
}

interface VisualizerProps {
    database?: string;
}

function hash(obj: any) {
    let cache: any[] = [];

    function sanitize(obj: any): any {
        if (obj === null) {
            return obj;
        }
        if (["undefined", "boolean", "number", "string", "function"].indexOf(typeof obj) >= 0) {
            return obj;
        }
        if (typeof obj === "object") {
            let keys = Object.keys(obj).sort(),
                values = [];
            for (let i = 0; i < keys.length; i++) {
                let value = obj[keys[i]];
                if (cache.indexOf(value) === -1) {
                    values.push(sanitize(value));
                    cache.push(value);
                } else {
                    values.push("[ Previously hashed object ]");
                }
            }
            return [keys, values];
        }
    }

    return JSON.stringify(sanitize(obj));
}

const Flow: React.FC<FlowProps> = (props: FlowProps) => {
    const currentDatabase = props.currentDatabase;
    const initialNodes = initializeNodes(props.currentDatabase);

    const store = useStoreApi();
    // 1eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [fullscreenOn, setFullScreen] = useState(false);
    const [infoPopupOn, setInfoPopupOn] = useState(false);
    const [unknownDatasetOn, setUnknownDatasetOn] = useState(false);
    const [databaseMenuPopupOn, setDatabaseMenuPopupOn] = useState(false);
    const [nodeHoverActive, setNodeHoverActive] = useState(true);

    const [isModalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleStartMigration = () => setIsMigration(true);
    const handleStopMigration = () => setIsMigration(false);

    const handleConfirmAction = () => {
        setModalOpen(false);
        setChoosedColumn(null);
        updateTable(null);
        setIsMigration(false);
    };

    const [isMigration, setIsMigration] = useAtom(isMigrationAtom);
    const [choosedColumn, setChoosedColumn] = useAtom(choosedColumnAtom);
    const [history] = useAtom(changeHistoryAtom);

    const updateTable = useAction(setChoosedTable);

    const isHistory = Boolean(history?.length > 1);
    const isChoosed = Boolean(choosedColumn);

    const onInit = (instance: ReactFlowInstance) => {
        const nodes = instance.getNodes();
        const initialEdges = calculateEdges({ nodes, currentDatabase });
        setEdges(() => initialEdges);

        const handleKeyboard = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "p") {
                const nodes = instance.getNodes();

                logTablePositions(nodes);
            }
        };

        document.addEventListener("keydown", handleKeyboard);

        // https://javascriptf1.com/snippet/detect-fullscreen-mode-with-javascript
        window.addEventListener("resize", (event) => {
            setFullScreen(window.innerHeight === window.screen.height);
        });

        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.code === "Escape") {
                setInfoPopupOn(false);
                setUnknownDatasetOn(false);
                setDatabaseMenuPopupOn(false);
            }
        });

        // https://stackoverflow.com/questions/42066421/property-value-does-not-exist-on-type-eventtarget
        document.addEventListener("click", (event: Event) => {
            const popup = document.querySelector(".info-popup");

            if (!popup) {
                return;
            }

            const target = event.target as HTMLInputElement;

            if (target && target.closest(".into-popup-toggle")) {
                return;
            }

            if (target && !target.closest(".info-popup__inner")) {
                setInfoPopupOn(false);
                setUnknownDatasetOn(false);
                setDatabaseMenuPopupOn(false);
            }
        });

        document.addEventListener(
            "keydown",
            (e: KeyboardEvent) => {
                if (e.code === "MetaLeft") {
                    setNodeHoverActive(false);
                }
            },
            false
        );

        document.addEventListener(
            "keyup",
            (e: KeyboardEvent) => {
                if (e.code === "MetaLeft") {
                    setNodeHoverActive(true);
                }
            },
            false
        );
    };

    // https://github.com/wbkd/react-flow/issues/2580
    const onNodeMouseEnter = useCallback(
        (_: any, node: Node) => {
            if (!nodeHoverActive) {
                return;
            }

            const state = store.getState();
            state.resetSelectedElements();
            state.addSelectedNodes([node.id]);

            const connectedEdges = getConnectedEdges([node], edges);
            setEdges((eds) => {
                return eds.map((ed) => {
                    if (connectedEdges.find((e) => e.id === ed.id)) {
                        setHighlightEdgeClassName(ed);
                    }

                    return ed;
                });
            });
        },
        [edges, nodeHoverActive, setEdges, store]
    );

    const onNodeMouseLeave = useCallback(
        (_: any, node: Node) => {
            if (!nodeHoverActive) {
                return;
            }

            const state = store.getState();
            state.resetSelectedElements();

            setEdges((eds) => eds.map((ed) => setEdgeClassName(ed)));

            // https://stackoverflow.com/questions/2520650/how-do-you-clear-the-focus-in-javascript
            (document.activeElement as HTMLElement).blur();
        },
        [nodeHoverActive, setEdges, store]
    );

    const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
        const edges = params.edges;
        edges.forEach((ed) => {
            const svg = document
                .querySelector(".react-flow__edges")
                ?.querySelector(`[data-testid="rf__edge-${ed.id}"]`);
            moveSVGInFront(svg);
        });
    }, []);

    const handleNodesChange = useCallback(
        (nodeChanges: NodeChange[]) => {
            nodeChanges.forEach((nodeChange) => {
                if (nodeChange.type === "position" && nodeChange.positionAbsolute) {
                    // nodeChange.positionAbsolute contains new position
                    const node = nodes.find((node) => node.id === nodeChange.id);

                    if (!node) {
                        return;
                    }

                    const incomingNodes = getIncomers(node, nodes, edges);
                    incomingNodes.forEach((incomingNode) => {
                        const edge = edges.find((edge) => {
                            return edge.id === `${incomingNode.id}-${node.id}`;
                        });

                        const edgeConfig = currentDatabase.edgeConfigs.find((edgeConfig: EdgeConfig) => {
                            return edgeConfig.source === incomingNode.id && edgeConfig.target === node.id;
                        });

                        if (nodeChange.positionAbsolute?.x) {
                            setEdges((eds) =>
                                eds.map((ed) => {
                                    if (edge && ed.id === edge.id) {
                                        const sourcePosition =
                                            edgeConfig!.sourcePosition ||
                                            calculateSourcePosition(
                                                incomingNode.width as number,
                                                incomingNode.position.x,
                                                node.width as number,
                                                nodeChange.positionAbsolute!.x
                                            );
                                        const targetPosition =
                                            edgeConfig!.targetPosition ||
                                            calculateTargetPosition(
                                                incomingNode.width as number,
                                                incomingNode.position.x,
                                                node.width as number,
                                                nodeChange.positionAbsolute!.x
                                            );

                                        const sourceHandle = `${edgeConfig!.sourceKey}-${sourcePosition}`;
                                        const targetHandle = `${edgeConfig!.targetKey}-${targetPosition}`;

                                        ed.sourceHandle = sourceHandle;
                                        ed.targetHandle = targetHandle;
                                        ed.className = edgeClassName(edgeConfig, targetPosition);
                                        ed.markerEnd = edgeMarkerName(edgeConfig, targetPosition);
                                    }

                                    return ed;
                                })
                            );
                        }
                    });

                    const outgoingNodes = getOutgoers(node, nodes, edges);
                    outgoingNodes.forEach((targetNode) => {
                        const edge = edges.find((edge) => {
                            return edge.id === `${node.id}-${targetNode.id}`;
                        });

                        const edgeConfig = currentDatabase.edgeConfigs.find((edgeConfig: EdgeConfig) => {
                            return edgeConfig.source === nodeChange.id && edgeConfig.target === targetNode.id;
                        });

                        if (nodeChange.positionAbsolute?.x) {
                            setEdges((eds) =>
                                eds.map((ed) => {
                                    if (edge && ed.id === edge.id) {
                                        const sourcePosition =
                                            edgeConfig!.sourcePosition ||
                                            calculateSourcePosition(
                                                node.width as number,
                                                nodeChange.positionAbsolute!.x,
                                                targetNode.width as number,
                                                targetNode.position.x
                                            );
                                        const targetPosition =
                                            edgeConfig!.targetPosition ||
                                            calculateTargetPosition(
                                                node.width as number,
                                                nodeChange.positionAbsolute!.x,
                                                targetNode.width as number,
                                                targetNode.position.x
                                            );

                                        const sourceHandle = `${edgeConfig!.sourceKey}-${sourcePosition}`;
                                        const targetHandle = `${edgeConfig!.targetKey}-${targetPosition}`;

                                        ed.sourceHandle = sourceHandle;
                                        ed.targetHandle = targetHandle;
                                        ed.className = edgeClassName(edgeConfig, targetPosition);
                                        ed.markerEnd = edgeMarkerName(edgeConfig, targetPosition);
                                    }

                                    return ed;
                                })
                            );
                        }
                    });
                }
            });

            onNodesChange(nodeChanges);
        },
        [onNodesChange, setEdges, nodes, edges, currentDatabase]
    );

    const toggleFullScreen = () => {
        if (fullscreenOn) {
            document
                .exitFullscreen()
                .then(function () {
                    setFullScreen(false);
                })
                .catch(function (error) {
                    alert("Can't exit fullscreen");
                    console.error(error);
                });
        } else {
            let element = document.querySelector("body");

            // make the element go to full-screen mode
            element &&
                element
                    .requestFullscreen()
                    .then(function () {
                        setFullScreen(true);
                    })
                    .catch(function (error) {
                        alert("Can't turn on fullscreen");
                        console.error(error);
                    });
        }
    };

    // Remove ReactFlow link
    const proOptions = { hideAttribution: true };

    // Обработчик клика на таблицу
    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        event.preventDefault();
        updateTable(node);
    }, []);

    // Обработчик клика на связь
    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        event.preventDefault();
        // console.log(`edge: `, edge);
    }, []);

    // УБРАТЬ
    // useEffect(() => {
    // console.log("Updated globalState:", globalState);
    // }, [globalState]);

    // https://stackoverflow.com/questions/16664584/changing-an-svg-markers-color-css
    return (
        <>
            <div className="Flow">
                <Markers />
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgeClick={onEdgeClick}
                    onInit={onInit}
                    snapToGrid={true}
                    fitView
                    snapGrid={[16, 16]}
                    nodeTypes={nodeTypes}
                    onNodeMouseEnter={onNodeMouseEnter}
                    onNodeMouseLeave={onNodeMouseLeave}
                    onSelectionChange={onSelectionChange}
                    onNodeClick={onNodeClick}
                    proOptions={proOptions}
                >
                    <Controls showInteractive={false}>
                        <ControlButton onClick={toggleFullScreen}>
                            {!fullscreenOn ? <MaximizeIcon /> : <MinimizeIcon />}
                        </ControlButton>
                    </Controls>
                    <Background variant={"dots" as any} gap={12} size={1} />
                    <MiniMap />
                    <Panel style={{ zIndex: 10 }} position="top-left">
                        {!isMigration ? (
                            <Button disabled={!isChoosed} onClick={handleStartMigration} variant="success">
                                <Trans id="startMigrating" message="Start migration" />
                            </Button>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                <div style={{ display: "flex", gap: "5px" }}>
                                    <Button
                                        onClick={isHistory ? handleOpenModal : handleStopMigration}
                                        variant="failure"
                                    >
                                        <Trans id="cancelMigration" message="Cancel migration" />
                                    </Button>
                                    <Button onClick={() => {}} variant="success">
                                        <Trans id="createTable" message="Create new table" />
                                    </Button>
                                </div>
                                <div style={{ display: "flex", gap: "5px" }}>
                                    <Button onClick={() => {}} variant="primary">
                                        <span style={{ fontSize: "16px" }}>&lt;</span>
                                    </Button>
                                    <Button onClick={() => {}} variant="primary">
                                        <span style={{ fontSize: "16px" }}>&gt;</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Panel>
                    <Panel style={{ zIndex: 10 }} position="top-right">
                        <Button onClick={() => {}} disabled={true} variant="success">
                            <Trans id="deployChanges" message="Deploy changes" />
                        </Button>
                    </Panel>
                </ReactFlow>
                {infoPopupOn && (
                    <InfoPopup
                        onClose={() => {
                            setInfoPopupOn(false);
                        }}
                    />
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
                leftBtnText="Cancel"
                rightBtnText="Confirm"
            >
                {DISCARD_CHANGES_WARNING}
            </Modal>
        </>
    );
};

interface IVisualizer {
    database: DatabaseConfig;
}

// https://codesandbox.io/s/elastic-elion-dbqwty?file=/src/App.js
// 1eslint-disable-next-line import/no-anonymous-default-export
const Visualizer: React.FC<IVisualizer> = (props: IVisualizer) => {
    const [currentDatabase, setCurrentDatabase] = useState({
        tables: [],
        edgeConfigs: [],
        schemaColors: {},
        tablePositions: {},
    } as DatabaseConfig);
    const [databasesLoaded, setDatabasesLoaded] = useState(false);

    useEffect(() => {
        // console.log("RELOADING DB");
        setDatabasesLoaded(false);
        if (!props.database) {
            return;
        }
        setCurrentDatabase(props.database);
        setDatabasesLoaded(true);
    }, [props.database]);

    // console.log(`currentDatabase: `, currentDatabase);
    return (
        <ReactFlowProvider>
            {databasesLoaded && <Flow key={hash(currentDatabase)} currentDatabase={{ ...currentDatabase }} />}
        </ReactFlowProvider>
    );
};

export default Visualizer;
