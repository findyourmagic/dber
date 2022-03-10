import Head from "next/head";
import styles from "../styles/index.module.css";
import { useState, useEffect, useRef, useMemo, useReducer } from "react";
import SvgDefs from "../components/svg_defs";
import NodeForm from "../components/node_form";
import reducer from "../reducers/graph_reducer";
// graph node type
// {
//     id: window.crypto.randomUUID(),
//     name: "Node Name",
//     x: 100,
//     y: 100,
//     attrs: [
//         {
//             name: "id",
//             type: "Integer",
//             primary: true,
//         },
//     ],
// },

// graph ref type
// {
//     startNodeId: linkStat.startNodeId,
//     startAttr: linkStat.startAttr,
//     endNodeId: row.getAttribute("node-id"),
//     endAttr: row.getAttribute("key"),
//     type: 'one2one' | 'many2many' | 'one2many' | 'many2one'
// }

const initialState = {
    name: "public",
    note: "Default Public Schema",
    nodes: [
        // {
        //     name: "date",
        //     alias: null,
        //     fields: [
        //         {
        //             name: "id",
        //             type: {
        //                 type_name: "int",
        //                 args: null,
        //             },
        //             pk: true,
        //         }
        //     ],
        //     indexes: [],
        // },
    ],
    enums: [],
    nodeGroups: [],
    edges: [
        // {
        //     name: null,
        //     endpoints: [
        //         {
        //             nodeName: "sales",
        //             fieldNames: ["store_id"],
        //             relation: "1",
        //         },
        //         {
        //             nodeName: "store",
        //             fieldNames: ["store_id"],
        //             relation: "*",
        //         },
        //     ],
        // },
    ],
};

export default function Home() {
    const [graph, dispatch] = useReducer(reducer, initialState);

    const svg = useRef();

    const [mode, setMode] = useState("");

    const [movingNode, setMovingNode] = useState();

    const [editingNode, setEditingNode] = useState();

    const [offset, setOffset] = useState({
        x: 0,
        y: 0,
    });

    const [box, setBox] = useState({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    });

    const mouseDownHanlder = (e) => {
        if (e.target.tagName == "svg") {
            setOffset({
                x: box.x + e.clientX,
                y: box.y + e.clientY,
            });
            setMode("draging");
        }
    };

    const nodeMouseDownHanlder = (e, node) => {
        console.log("node mouse down");
        console.log(node);
        let point = svg.current.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        point = point.matrixTransform(svg.current.getScreenCTM().inverse());

        setMovingNode({
            id: node.id,
            offsetX: point.x - node.x,
            offsetY: point.y - node.y,
        });

        setMode("moving");
        console.log(movingNode);
        e.preventDefault();
        e.stopPropagation();
    };

    const mouseUpHanlder = (e) => {
        console.log("mouse up");
        if (mode == "linking") {
            const row = e.target.classList.contains("row")
                ? e.target
                : e.target.closest(".row");
            if (row) {
                const endNodeId = row.getAttribute("nodeid");
                const endAttr = row.getAttribute("attrid");

                if (
                    !graph.edges.find(
                        (edge) =>
                            edge.startNodeId == linkStat.startNodeId &&
                            edge.startAttr == linkStat.startAttr &&
                            edge.endNodeId == endNodeId &&
                            edge.endAttr == endAttr
                    )
                )
                    dispatch({
                        type: "createEdge",
                        payload: {
                            id: window.crypto.randomUUID(),
                            startNodeId: linkStat.startNodeId,
                            startAttr: linkStat.startAttr,
                            endNodeId,
                            endAttr,
                            type: "one2one",
                        },
                    });
            }
        }
        setMode("");
        setLinkStat({
            startX: null,
            startY: null,
            startNodeId: null,
            startAttr: null,
            endX: null,
            endY: null,
        });
        setMovingNode(null);

        // console.log(e.target.tagName);
    };

    const getSVGCursor = ({ clientX, clientY }) => {
        let point = svg.current.createSVGPoint();
        point.x = clientX;
        point.y = clientY;

        let cursor = point.matrixTransform(
            svg.current.getScreenCTM().inverse()
        );
        return cursor; // {x, y}
    };

    const mouseMoveHanlder = (e) => {
        // console.log(e.target.tagName);
        if (!mode) return;
        if (mode == "draging") {
            setBox((state) => {
                return {
                    w: state.w,
                    h: state.h,
                    x: offset.x - e.clientX,
                    y: offset.y - e.clientY,
                };
            });
        }

        if (mode == "moving") {
            const cursor = getSVGCursor(e);
            dispatch({
                type: "updateNode",
                payload: {
                    id: movingNode.id,
                    x: cursor.x - movingNode.offsetX,
                    y: cursor.y - movingNode.offsetY,
                },
            });
        }

        if (mode == "linking") {
            const { x, y } = getSVGCursor(e);
            setLinkStat({
                ...linkStat,
                endX: x,
                endY: y + 3,
            });
        }
    };

    const addNode = () => {
        dispatch({
            type: "createNode",
            payload: {
                id: window.crypto.randomUUID(),
                name: `Node Name ${graph.nodes.length + 1}`,
                x: box.x + box.w / 2 - 200 + graph.nodes.length * 20,
                y: box.y + box.h / 2 - 200 + graph.nodes.length * 20,
                attrs: [
                    {
                        id: window.crypto.randomUUID(),
                        name: "id",
                        type: "Integer",
                        primary: true,
                    },
                ],
            },
        });
    };

    const updateNode = (node) => {
        console.log(node);
        if (node) {
            dispatch({
                type: "updateNode",
                payload: node,
            });
        }
        setEditingNode(null);
    };

    const nodeClickHandler = (node) => {
        setEditingNode(node);
    };

    const resizeHandler = () => {
        setBox((state) => {
            return {
                x: state.x,
                y: state.y,
                w: global.innerWidth || 0,
                h: global.innerHeight || 0,
            };
        });
    };

    useEffect(() => {
        resizeHandler();
        global.addEventListener("resize", resizeHandler);
        return () => {
            global.removeEventListener("resize", resizeHandler);
        };
    }, []);

    const [linkStat, setLinkStat] = useState({
        startX: null,
        startY: null,
        startNodeId: null,
        startAttr: null,
        endX: null,
        endY: null,
    });

    const gripMouseDownHandler = (e) => {
        const { x, y } = getSVGCursor(e);
        const row = e.currentTarget.closest(".row");
        setLinkStat({
            ...linkStat,
            startX: x,
            startY: y,
            startNodeId: row.getAttribute("nodeid"),
            startAttr: row.getAttribute("attrid"),
        });
        setMode("linking");
        e.preventDefault();
        e.stopPropagation();
    };

    const NodeWidth = 220;

    function LinkPath(props) {
        const control = 20;
        const width = NodeWidth;
        const padding = 5;
        const gripWidth = 10;
        const gripRadius = gripWidth / 2;
        const margin = 3;
        const edge = props.edge;
        const [sourceNode, targetNode] = [
            graph.nodes.find((node) => node.id == edge.startNodeId),
            graph.nodes.find((node) => node.id == edge.endNodeId),
        ];

        const [sourceAttrIndex, targetAttrIndex] = [
            sourceNode.attrs.findIndex((attr) => attr.id == edge.startAttr),
            targetNode.attrs.findIndex((attr) => attr.id == edge.endAttr),
        ];

        const sourceAttrPosition = [
            sourceNode.x,
            sourceNode.y + sourceAttrIndex * 30 + 50 + gripRadius,
        ];

        const targetAttrPosition = [
            targetNode.x,
            targetNode.y + targetAttrIndex * 30 + 50 + gripRadius,
        ];

        const [source, target] = [sourceAttrPosition, targetAttrPosition].sort(
            (a, b) => {
                return a[0] - b[0] || a[1] - b[1];
            }
        );

        // 路径绘制
        const sourceLeft = source[0] + padding + gripRadius + margin;

        // 来源左侧位置坐标
        const sourceRight = source[0] + width - padding - gripRadius - margin;
        // 来源右侧位置坐标

        let x = sourceLeft;
        // 定义起点 x

        const y = source[1] + gripRadius + margin;
        // 来源 y 轴中点

        const targetLeft = target[0] + padding + gripRadius + margin;
        // 目标左侧点

        const targetRight = target[0] + width - padding - gripRadius - margin;
        // 目标右侧点

        let minDistance = Math.abs(sourceLeft - targetLeft);
        // 预设最小距离

        let x1 = targetLeft;
        // 定义终点 x

        [
            [sourceLeft, targetRight],
            [sourceRight, targetLeft],
            [sourceRight, targetRight],
        ].forEach((items) => {
            if (Math.abs(items[0] - items[1]) < minDistance) {
                minDistance = Math.min(items[0] - items[1]);
                x = items[0];
                x1 = items[1];
            }
        });
        // 计算距离最短的 x 轴坐标对

        const y1 = target[1] + gripRadius + margin;
        // 终点 y 轴中点

        // const midX = x1 - (x1 - x) / 2;
        const midX = x1 - (x1 - x) / 2;
        // 路径X轴中点

        const midY = y1 - (y1 - y) / 2;
        // 路径Y轴中点
        return (
            <>
                <foreignObject
                    x={midX - 15}
                    y={midY - 10}
                    width={30}
                    height={20}
                    onMouseDown={(e) => console.log(e)}
                >
                    <div style={{ cursor: "pointer", userSelect: "none" }}>
                        123
                    </div>
                </foreignObject>
                <path
                    d={`M ${x} ${y}
        C ${x + control} ${y} ${midX} ${midY} ${midX} ${midY}
        C ${midX} ${midY} ${x1 - control} ${y1} ${x1} ${y1}`}
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                    markerMid="url(#many-one)"
                />
            </>
        );
    }

    return (
        <>
            <Head>
                <title> Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <nav className={styles.nav}>
                <div>
                    <a>Brand</a>
                </div>
                <div>
                    <button onClick={addNode}>New Node</button>
                </div>
                <div>
                    <button>What ever</button>
                </div>
            </nav>
            <svg
                className={styles.main}
                viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
                onMouseDown={mouseDownHanlder}
                onMouseUp={mouseUpHanlder}
                onMouseMove={mouseMoveHanlder}
                ref={svg}
            >
                {graph.edges.map((edge) => {
                    return <LinkPath edge={edge} key={`${edge.id}`} />;
                })}
                {graph.nodes.map((node) => {
                    const height = node.attrs.length * 30 + 52;
                    return (
                        <foreignObject
                            x={node.x}
                            y={node.y}
                            width={NodeWidth}
                            height={height}
                            key={node.id}
                            onMouseDown={(e) => {
                                nodeMouseDownHanlder(e, node);
                            }}
                        >
                            <div className="table">
                                <div className="table-title">
                                    <span>{node.name}</span>
                                    <button
                                        onClick={() => {
                                            nodeClickHandler(node);
                                        }}
                                    >
                                        编辑
                                    </button>
                                </div>
                                {node.attrs.map((attr) => {
                                    return (
                                        <div
                                            className="row"
                                            key={attr.id}
                                            nodeid={node.id}
                                            attrid={attr.id}
                                        >
                                            <div
                                                className="start-grip grip"
                                                onMouseDown={
                                                    gripMouseDownHandler
                                                }
                                            ></div>
                                            <span>{attr.name}</span>
                                            <div
                                                className="end-grip grip"
                                                onMouseDown={
                                                    gripMouseDownHandler
                                                }
                                            ></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </foreignObject>
                    );
                })}

                <rect x="0" y="0" width="20" height="20"></rect>
                {mode == "linking" &&
                    linkStat.startX != null &&
                    linkStat.endX != null && (
                        <line
                            x1={linkStat.startX}
                            y1={linkStat.startY}
                            x2={linkStat.endX}
                            y2={linkStat.endY}
                            stroke="red"
                            strokeDasharray="5,5"
                        />
                    )}
                <SvgDefs />
            </svg>

            {editingNode && (
                <aside className={styles.aside}>
                    <NodeForm
                        node={editingNode}
                        updateNode={updateNode}
                    ></NodeForm>
                </aside>
            )}
        </>
    );
}
