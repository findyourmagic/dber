import Head from 'next/head';
import { useState, useRef, useMemo } from 'react';
import { Drawer } from '@arco-design/web-react';
import TableForm from '../../components/table_form';
import LinkPath from '../../components/link_path';
import LinkModal from '../../components/link_modal';
import { ExportModal } from '../../components/export_modal';
import defaultTables from '../../data/default_tables';
import defaultLinks from '../../data/default_links';
import Nav from '../../components/nav';
import Table from '../../components/table';
import useGraphState from '../../hooks/use-graph-state';

export default function Home() {
    const {
        tableDict,
        setTableDict,
        linkDict,
        setLinkDict,
        box,
        setBox,
        name,
        setName,
    } = useGraphState();

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

    // compute the distance from the pointer to svg origin when mousedown
    const mouseDownHanlder = e => {
        if (e.target.tagName == 'svg') {
            setOffset({
                x: box.x + (e.clientX * box.w) / global.innerWidth,
                y: box.y + (e.clientY * box.h) / global.innerHeight,
            });
            setMode('draging');
        }
    };

    const tableMouseDownHanlder = (e, table) => {
        const { x: cursorX, y: cursorY } = getSVGCursor(e);

        setMovingTable({
            id: table.id,
            offsetX: cursorX - table.x,
            offsetY: cursorY - table.y,
        });

        setMode('moving');
        e.preventDefault();
        e.stopPropagation();
    };

    const mouseUpHanlder = e => {
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

    const getSVGCursor = ({ clientX, clientY }) => {
        let point = svg.current.createSVGPoint();
        point.x = clientX;
        point.y = clientY;

        let cursor = point.matrixTransform(
            svg.current.getScreenCTM().inverse()
        );
        return cursor;
    };

    const mouseMoveHanlder = e => {
        if (!mode) return;
        if (mode == 'draging') {
            setBox(state => {
                return {
                    w: state.w,
                    h: state.h,
                    x: offset.x - e.clientX * (state.w / global.innerWidth),
                    y: offset.y - e.clientY * (state.h / global.innerHeight),
                    clientH: state.clientH,
                    clientW: state.clientW,
                };
            });
        }

        if (mode == 'moving') {
            const { x: cursorX, y: cursorY } = getSVGCursor(e);

            setTableDict(state => {
                return {
                    ...state,
                    [movingTable.id]: {
                        ...state[movingTable.id],
                        x: cursorX - movingTable.offsetX,
                        y: cursorY - movingTable.offsetY,
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

    const wheelHandler = e => {
        const { deltaY } = e;
        setBox(state => {
            if (state.w > 4000 && deltaY > 0) return state;
            if (state.w < 600 && deltaY < 0) return state;

            const cursor = getSVGCursor(e);
            const widthHeightRatio = state.w / state.h;
            deltaY = deltaY * 2;
            const deltaX = deltaY * widthHeightRatio;
            return {
                x: state.x - ((cursor.x - state.x) / state.w) * deltaX,
                y: state.y - ((cursor.y - state.y) / state.h) * deltaY,
                w: state.w + deltaX,
                h: state.h + deltaY,
                clientH: state.clientH,
                clientW: state.clientW,
            };
        });
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
                            type: 'INTEGER',
                            pk: true,
                            increment: true,
                        },
                    ],
                },
            };
        });
    };

    const updateTable = table => {
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

    const removeTable = tableId => {
        setTableDict(state => {
            const newState = { ...state };
            delete newState[tableId];
            return newState;
        });

        setLinkDict(state => {
            const newState = { ...state };
            Object.keys(newState).forEach(key => {
                if (
                    newState[key].endpoints.find(
                        endpoint => endpoint.id == tableId
                    )
                ) {
                    delete newState[key];
                }
            });
            return newState;
        });

        setEditingTable(null);
    };

    const tableClickHandler = table => {
        setEditingTable(table);
    };

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
        <div className="graph">
            <Head>
                <title>DBER</title>
                <meta
                    name="description"
                    content="Database design tool based on entity relation diagram"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ExportModal
                command={command}
                setCommand={setCommand}
            ></ExportModal>
            <Nav
                addTable={addTable}
                setTableDict={setTableDict}
                setLinkDict={setLinkDict}
                defaultTables={defaultTables}
                defaultLinks={defaultLinks}
                tableDict={tableDict}
                linkDict={linkDict}
                box={box}
                name={name}
                setName={setName}
                setCommand={setCommand}
            />
            <svg
                className="main"
                viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
                onMouseDown={mouseDownHanlder}
                onMouseUp={mouseUpHanlder}
                onMouseMove={mouseMoveHanlder}
                onWheel={wheelHandler}
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
                    return (
                        <Table
                            key={table.id}
                            table={table}
                            TableWidth={TableWidth}
                            tableMouseDownHanlder={tableMouseDownHanlder}
                            tableClickHandler={tableClickHandler}
                            gripMouseDownHandler={gripMouseDownHandler}
                        />
                    );
                })}

                <rect x="0" y="0" width="2" height="2"></rect>
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
            </svg>

            <Drawer
                width={420}
                title="Edit Table"
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
                        removeTable={removeTable}
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
        </div>
    );
}
