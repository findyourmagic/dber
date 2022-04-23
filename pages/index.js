import Head from 'next/head';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Drawer, Button, Space } from '@arco-design/web-react';

import styles from '../styles/index.module.css';
import SvgDefs from '../components/svg_defs';
import TableForm from '../components/table_form';
import LinkPath from '../components/link_path';
import LinkModal from '../components/link_modal';
import exportSQL from '../utils/export-sql';
import { ExportModal } from '../components/export_modal';
import defaultTables from '../data/default_tables';
import defaultLinks from '../data/default_links';

export default function Home() {
    console.log('render home');

    const [tableDict, setTableDict] = useState(defaultTables);
    const [linkDict, setLinkDict] = useState(defaultLinks);

    const [inited, setInited] = useState(false);

    useEffect(() => {
        const _tableDict = window.localStorage.getItem('tableDict');
        const _linkDict = window.localStorage.getItem('linkDict');
        if (_tableDict) {
            setTableDict(JSON.parse(_tableDict));
        }
        if (_linkDict) {
            setLinkDict(JSON.parse(_linkDict));
        }
        setInited(true);
    }, []);

    useEffect(() => {
        if (inited) {
            window.localStorage.setItem('tableDict', JSON.stringify(tableDict));
        }
    }, [tableDict]);

    useEffect(() => {
        if (inited) {
            window.localStorage.setItem('linkDict', JSON.stringify(linkDict));
        }
    }, [linkDict]);

    const tables = useMemo(() => Object.values(tableDict), [tableDict]);

    const links = useMemo(() => Object.values(linkDict), [linkDict]);

    const svg = useRef();

    // ''|dragging|moving|linking
    const [mode, setMode] = useState('');

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
    const mouseDownHanlder = e => {
        if (e.target.tagName == 'svg') {
            setOffset({
                x: box.x + e.clientX,
                y: box.y + e.clientY,
            });
            setMode('draging');
        }
    };

    const tableMouseDownHanlder = (e, table) => {
        console.log('table mouse down');
        let point = svg.current.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        point = point.matrixTransform(svg.current.getScreenCTM().inverse());

        setMovingTable({
            id: table.id,
            offsetX: point.x - table.x,
            offsetY: point.y - table.y,
        });

        setMode('moving');
        console.log(movingTable);
        e.preventDefault();
        e.stopPropagation();
    };

    const mouseUpHanlder = e => {
        console.log('mouse up');
        if (mode == 'linking') {
            const row = e.target.classList.contains('row')
                ? e.target
                : e.target.closest('.row');
            if (row) {
                const endTableId = row.getAttribute('tableid');
                const endField = row.getAttribute('fieldid');

                if (
                    !links.find(
                        link =>
                            [
                                `${link.endpoints[0].id} ${link.endpoints[0].fieldId}`,
                                `${link.endpoints[1].id} ${link.endpoints[1].fieldId}`,
                            ]
                                .sort()
                                .join(' ') ==
                            [
                                `${linkStat.startTableId} ${linkStat.startField}`,
                                `${endTableId} ${endField}`,
                            ]
                                .sort()
                                .join(' ')
                    ) &&
                    linkStat.startTableId != endTableId
                ) {
                    setLinkDict(state => {
                        const id = window.crypto.randomUUID();
                        return {
                            ...state,
                            [id]: {
                                id,
                                name: null,
                                endpoints: [
                                    {
                                        id: linkStat.startTableId,
                                        // tableName: "sales",
                                        // fieldNames: ["id"],
                                        fieldId: linkStat.startField,
                                        relation: '1',
                                    },
                                    {
                                        id: endTableId,
                                        // tableName: "store",
                                        // fieldNames: ["id"],
                                        fieldId: endField,
                                        relation: '*',
                                    },
                                ],
                            },
                        };
                    });
                }
            }
        }
        setMode('');
        setLinkStat({
            startX: null,
            startY: null,
            startTableId: null,
            startField: null,
            endX: null,
            endY: null,
        });
        setMovingTable(null);
    };

    const tableMouseUpHandler = (e, table) => {
        console.log('table mouse up');
        // console.log(e);
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

    const mouseMoveHanlder = e => {
        // console.log(e.target.tagName);
        if (!mode) return;
        if (mode == 'draging') {
            setBox(state => {
                return {
                    w: state.w,
                    h: state.h,
                    x: offset.x - e.clientX,
                    y: offset.y - e.clientY,
                };
            });
        }

        if (mode == 'moving') {
            const cursor = getSVGCursor(e);

            setTableDict(state => {
                return {
                    ...state,
                    [movingTable.id]: {
                        ...state[movingTable.id],
                        x: cursor.x - movingTable.offsetX,
                        y: cursor.y - movingTable.offsetY,
                    },
                };
            });
        }

        if (mode == 'linking') {
            const { x, y } = getSVGCursor(e);
            setLinkStat({
                ...linkStat,
                endX: x,
                endY: y + 3,
            });
        }
    };

    const addTable = () => {
        setTableDict(state => {
            const id = window.crypto.randomUUID();
            return {
                ...state,
                [id]: {
                    id,
                    name: `Table Name ${tables.length + 1}`,
                    x: box.x + box.w / 2 - 200 + tables.length * 20,
                    y: box.y + box.h / 2 - 200 + tables.length * 20,
                    fields: [
                        {
                            id: window.crypto.randomUUID(),
                            name: 'id',
                            type: 'int',
                            pk: true,
                        },
                    ],
                },
            };
        });
    };

    const updateTable = table => {
        // console.log(table);
        if (table) {
            setTableDict(state => {
                return {
                    ...state,
                    [table.id]: {
                        ...state[table.id],
                        ...table,
                    },
                };
            });
        }
        setEditingTable(null);
    };

    const tableClickHandler = table => {
        setEditingTable(table);
    };

    const resizeHandler = () => {
        setBox(state => {
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
        global.addEventListener('resize', resizeHandler);
        return () => {
            global.removeEventListener('resize', resizeHandler);
        };
    }, []);

    const [linkStat, setLinkStat] = useState({
        startX: null,
        startY: null,
        startTableId: null,
        startField: null,
        endX: null,
        endY: null,
    });

    const gripMouseDownHandler = e => {
        const { x, y } = getSVGCursor(e);
        const row = e.currentTarget.closest('.row');
        setLinkStat({
            ...linkStat,
            startX: x,
            startY: y,
            startTableId: row.getAttribute('tableid'),
            startField: row.getAttribute('fieldid'),
        });
        setMode('linking');
        e.preventDefault();
        e.stopPropagation();
    };

    const TableWidth = 220;

    const [committing, setCommitting] = useState(false);

    const [editingLink, setEditingLink] = useState(null);

    const [command, setCommand] = useState('');

    return (
        <>
            <Head>
                <title>DBER</title>
                <meta
                    name="description"
                    content="Entity Relationship Diagram For Database"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ExportModal
                command={command}
                setCommand={setCommand}
            ></ExportModal>
            <nav className={styles.nav}>
                <div>
                    <a>
                        <strong>DBER</strong> | Entity Relationship Diagram For
                        Database
                    </a>
                </div>
                <Space>
                    <Button
                        onClick={addTable}
                        type="outline"
                        shape="round"
                        size="mini"
                    >
                        + Add New Table
                    </Button>
                    <Button
                        onClick={() => {
                            const sql = exportSQL(tableDict, linkDict);
                            setCommand(sql);
                        }}
                        type="outline"
                        shape="round"
                        size="mini"
                    >
                        Export SQL
                    </Button>
                </Space>
            </nav>
            <svg
                className={styles.main}
                viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
                onMouseDown={mouseDownHanlder}
                onMouseUp={mouseUpHanlder}
                onMouseMove={mouseMoveHanlder}
                ref={svg}
            >
                {links.map(link => {
                    return (
                        <LinkPath
                            TableWidth={TableWidth}
                            link={link}
                            key={`${link.id}`}
                            tableDict={tableDict}
                            linkDict={linkDict}
                            setEditingLink={setEditingLink}
                        />
                    );
                })}
                {tables.map(table => {
                    const height = table.fields.length * 30 + 52;
                    return (
                        <foreignObject
                            x={table.x}
                            y={table.y}
                            width={TableWidth}
                            height={height}
                            key={table.id}
                            onMouseDown={e => {
                                tableMouseDownHanlder(e, table);
                            }}
                            // onMouseUp={(e) => {
                            //     tableMouseUpHandler(e, table);
                            // }}
                        >
                            <div className="table">
                                <div className="table-title">
                                    <span>{table.name}</span>
                                    <Button
                                        size="mini"
                                        onClick={() => {
                                            tableClickHandler(table);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </div>
                                {table.fields.map(field => {
                                    return (
                                        <div
                                            className="row"
                                            key={field.id}
                                            tableid={table.id}
                                            fieldid={field.id}
                                        >
                                            <div
                                                className="start-grip grip"
                                                onMouseDown={
                                                    gripMouseDownHandler
                                                }
                                            ></div>
                                            <span>{field.name}</span>
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
                {mode == 'linking' &&
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

            <Drawer
                width={420}
                title={null}
                visible={editingTable}
                okText="Commit"
                autoFocus={false}
                onOk={() => {
                    setCommitting(true);
                }}
                cancelText="Cancel"
                onCancel={() => {
                    setEditingTable(false);
                }}
            >
                {editingTable ? (
                    <TableForm
                        table={editingTable}
                        updateTable={updateTable}
                        committing={committing}
                        setCommitting={setCommitting}
                    ></TableForm>
                ) : null}
            </Drawer>
            <LinkModal
                editingLink={editingLink}
                setEditingLink={setEditingLink}
                setLinkDict={setLinkDict}
            ></LinkModal>
        </>
    );
}
