import Head from "next/head";
import styles from "../styles/index.module.css";
import { useState, useEffect, useRef, useMemo, useReducer } from "react";
import SvgDefs from "../components/svg_defs";
import TableForm from "../components/table_form";
import reducer from "../reducers/graph_reducer";

const initialState = {};

export default function Home() {
    console.log("render home");
    const [tableDict, setTableDict] = useState({
        table1: {
            id: "table1",
            name: "date",
            alias: null,
            x: 0,
            y: 0,
            fields: [
                {
                    name: "id",
                    type: {
                        type_name: "int",
                        args: null,
                    },
                    pk: true,
                },
                {
                    name: "date",
                    type: {
                        type_name: "datetime",
                        args: null,
                    },
                    note: "replace text here",
                },
            ],
            indexes: [],
        },
        table2: {
            id: "table2",
            name: "table2",
            alias: null,
            x: 400,
            y: 400,
            fields: [
                {
                    name: "id",
                    type: {
                        type_name: "int",
                        args: null,
                    },
                    pk: true,
                },
                {
                    name: "date",
                    type: {
                        type_name: "datetime",
                        args: null,
                    },
                    note: "replace text here",
                },
            ],
            indexes: [],
        },
    });
    const tables = useMemo(() => Object.values(tableDict), [tableDict]);

    const [refDict, setRefDict] = useState({
        ref1: {
            id: "ref1",
            name: null,
            endpoints: [
                {
                    id: "table1",
                    tableName: "sales",
                    fieldNames: ["id"],
                    relation: "1",
                },
                {
                    id: "table2",
                    tableName: "store",
                    fieldNames: ["id"],
                    relation: "*",
                },
            ],
        },
    });

    const refs = useMemo(() => Object.values(refDict), [refDict]);

    const svg = useRef();

    // ''|dragging|moving|linking
    const [mode, setMode] = useState("");

    const [movingTable, setMovingTable] = useState();

    const [editingTable, setEditingTable] = useState();

    // offset of svg origin
    const [offset, setOffset] = useState({
        x: 0,
        y: 0,
    });

    // viewbox of svg
    const [box, setBox] = useState({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    });

    // compute the distance from the pointer to svg origin when mousedown
    const mouseDownHanlder = (e) => {
        if (e.target.tagName == "svg") {
            setOffset({
                x: box.x + e.clientX,
                y: box.y + e.clientY,
            });
            setMode("draging");
        }
    };

    const tableMouseDownHanlder = (e, table) => {
        console.log("table mouse down");
        console.log(table);
        let point = svg.current.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        point = point.matrixTransform(svg.current.getScreenCTM().inverse());

        setMovingTable({
            id: table.id,
            offsetX: point.x - table.x,
            offsetY: point.y - table.y,
        });

        setMode("moving");
        console.log(movingTable);
        e.preventDefault();
        e.stopPropagation();
    };

    const mouseUpHanlder = (e) => {
        console.log("mouse up");
        // if (mode == "linking") {
        //     const row = e.target.classList.contains("row")
        //         ? e.target
        //         : e.target.closest(".row");
        //     if (row) {
        //         const endTableId = row.getAttribute("tableid");
        //         const endAttr = row.getAttribute("filedid");

        //         if (
        //             !graph.edges.find(
        //                 (edge) =>
        //                     edge.startTableId == linkStat.startTableId &&
        //                     edge.startAttr == linkStat.startAttr &&
        //                     edge.endTableId == endTableId &&
        //                     edge.endAttr == endAttr
        //             )
        //         )
        //             dispatch({
        //                 type: "createEdge",
        //                 payload: {
        //                     id: window.crypto.randomUUID(),
        //                     startTableId: linkStat.startTableId,
        //                     startAttr: linkStat.startAttr,
        //                     endTableId,
        //                     endAttr,
        //                     type: "one2one",
        //                 },
        //             });
        //     }
        // }
        setMode("");
        setLinkStat({
            startX: null,
            startY: null,
            startTableId: null,
            startAttr: null,
            endX: null,
            endY: null,
        });
        setMovingTable(null);

        // console.log(e.target.tagName);
    };

    const tableMouseUpHandler = (e, table) => {
        console.log("table mouse up");
        console.log(e);
        console.log(table);
        e.stopPropagation();
        e.preventDefault();
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
            // dispatch({
            //     type: "updateTable",
            //     payload: {
            //         id: movingTable.id,
            //         x: cursor.x - movingTable.offsetX,
            //         y: cursor.y - movingTable.offsetY,
            //     },
            // });
        }

        if (mode == "linking") {
            const { x, y } = getSVGCursor(e);
            // setLinkStat({
            //     ...linkStat,
            //     endX: x,
            //     endY: y + 3,
            // });
        }
    };

    const addTable = () => {
        // dispatch({
        //     type: "createTable",
        //     payload: {
        //         id: window.crypto.randomUUID(),
        //         name: `Table Name ${graph.tables.length + 1}`,
        //         x: box.x + box.w / 2 - 200 + graph.tables.length * 20,
        //         y: box.y + box.h / 2 - 200 + graph.tables.length * 20,
        //         fields: [
        //             {
        //                 id: window.crypto.randomUUID(),
        //                 name: "id",
        //                 type: "Integer",
        //                 primary: true,
        //             },
        //         ],
        //     },
        // });
    };

    const updateTable = (table) => {
        // console.log(table);
        // if (table) {
        //     dispatch({
        //         type: "updateTable",
        //         payload: table,
        //     });
        // }
        // setEditingTable(null);
    };

    const tableClickHandler = (table) => {
        // setEditingTable(table);
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
        startTableId: null,
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
            startTableId: row.getAttribute("tableid"),
            startAttr: row.getAttribute("filedid"),
        });
        setMode("linking");
        e.preventDefault();
        e.stopPropagation();
    };

    const TableWidth = 220;

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
                    <button onClick={addTable}>New Table</button>
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
                {/* {graph.edges.map((edge) => {
                    return <LinkPath edge={edge} key={`${edge.id}`} />;
                })} */}
                {tables.map((table) => {
                    const height = table.fields.length * 30 + 52;
                    return (
                        <foreignObject
                            x={table.x}
                            y={table.y}
                            width={TableWidth}
                            height={height}
                            key={table.id}
                            onMouseDown={(e) => {
                                tableMouseDownHanlder(e, table);
                            }}
                            onMouseUp={(e) => {
                                tableMouseUpHandler(e, table);
                            }}
                        >
                            <div className="table">
                                <div className="table-title">
                                    <span>{table.name}</span>
                                    <button
                                        onClick={() => {
                                            tableClickHandler(table);
                                        }}
                                    >
                                        编辑
                                    </button>
                                </div>
                                {table.fields.map((filed) => {
                                    return (
                                        <div
                                            className="row"
                                            key={filed.id}
                                            tableid={table.id}
                                            filedid={filed.id}
                                        >
                                            <div
                                                className="start-grip grip"
                                                onMouseDown={
                                                    gripMouseDownHandler
                                                }
                                            ></div>
                                            <span>{filed.name}</span>
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

            {editingTable && (
                <aside className={styles.aside}>
                    <TableForm
                        table={editingTable}
                        updateTable={updateTable}
                    ></TableForm>
                </aside>
            )}
        </>
    );
}
