import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useState, useRef, useMemo } from 'react';
import { Drawer, Modal, Tag } from '@arco-design/web-react';
import { nanoid } from 'nanoid';
import { useContextMenu } from 'react-contexify';

import TableForm from '../../components/table_form';
import FieldForm from '../../components/field_form';
import LinkPath from '../../components/link_path';
import LinkModal from '../../components/link_modal';
import Nav from '../../components/nav';
import Table from '../../components/table';
import ContextMenu from '../../components/context_menu';
import HistoryDrawer from '../../components/history';
import useGraphState from '../../hooks/use-graph-state';
import { db, saveGraph } from '../../data/db';
import exportSQL from '../../utils/export-sql';

const ExportModal = dynamic(() => import('../../components/export_modal'), {
    ssr: false,
});
const ImportModal = dynamic(() => import('../../components/import_modal'), {
    ssr: false,
});


const MENU_ID = 'svg-menu';

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
        theme,
        setTheme,
    } = useGraphState();

    const tables = useMemo(() => Object.values(tableDict), [tableDict]);

    const links = useMemo(() => Object.values(linkDict), [linkDict]);
    const svg = useRef();

    // ''|dragging|moving|linking
    const [mode, setMode] = useState('');

    const [movingTable, setMovingTable] = useState();

    const [history, setHistory] = useState(undefined);
    const [version, setVersion] = useState('currentVersion');

    const [editingTable, setEditingTable] = useState();
    const [editingField, setEditingField] = useState();

    // offset of svg origin
    const [offset, setOffset] = useState({
        x: 0,
        y: 0,
    });

    /**
     * It sets the offset to the mouse position relative to the box, and sets the mode to 'draging'
     */
    const mouseDownHandler = e => {
        if (e.target.tagName === 'svg' && e.button !== 2) {
            setOffset({
                x: box.x + (e.clientX * box.w) / global.innerWidth,
                y: box.y + (e.clientY * box.h) / global.innerHeight,
            });
            setMode('draging');
        }
    };

    const [importType, setImportType] = useState('');

    const { show } = useContextMenu({
        id: MENU_ID,
    });

    const contextMenuHandler = e => {
        e.preventDefault();
        show(e);
    };

    /**
     * It sets the moving table to the table that was clicked on, and sets the mode to moving
     * @param e - the event object
     * @param table - the table object that was clicked on
     */
    const tableMouseDownHandler = (e, table) => {
        if (e.button === 2 || version !== 'currentVersion') return;
        const { x: cursorX, y: cursorY } = getSVGCursor(e);

        setMovingTable({
            id: table.id,
            offsetX: cursorX - table.x,
            offsetY: cursorY - table.y,
        });

        setMode('moving');
        e.preventDefault();
        // e.stopPropagation();
    };

    /**
     * When the user releases the mouse button, if the user was in linking mode, and the user is not
     * linking the same table to itself, then add a new link to the link dictionary
     */
    const mouseUpHandler = e => {
        if (mode === 'linking') {
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
                                .join(' ') ===
                            [
                                `${linkStat.startTableId} ${linkStat.startField}`,
                                `${endTableId} ${endField}`,
                            ]
                                .sort()
                                .join(' ')
                    ) &&
                    linkStat.startTableId !== endTableId
                ) {
                    setLinkDict(state => {
                        const id = nanoid();
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

    /**
     * It takes a mouse event and returns the cursor position in SVG coordinates
     * @returns The cursor position in the SVG coordinate system.
     */
    const getSVGCursor = ({ clientX, clientY }) => {
        let point = svg.current.createSVGPoint();
        point.x = clientX;
        point.y = clientY;

        let cursor = point.matrixTransform(
            svg.current.getScreenCTM().inverse()
        );
        return cursor;
    };

    /**
     * > When the mouse is moving, if the mode is 'draging', then update the box state with the new x
     * and y values. If the mode is 'moving', then update the tableDict state with the new x and y
     * values. If the mode is 'linking', then update the linkStat state with the new endX and endY
     * values
     */
    const mouseMoveHandler = e => {
        if (!mode) return;
        if (mode === 'draging') {
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

        if (mode === 'moving') {
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

        if (mode === 'linking') {
            const { x, y } = getSVGCursor(e);
            setLinkStat({
                ...linkStat,
                endX: x,
                endY: y + 3,
            });
        }
    };

    /**
     * `wheelHandler` is a function that takes an event object as an argument and returns a function
     * that takes a state object as an argument and returns a new state object
     */
    const wheelHandler = e => {
        let { deltaY } = e;
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

    const updateGraph = () => {
        const id = new URLSearchParams(global.location.search).get('id');
        saveGraph({ id, name, tableDict, linkDict, box });
    };

    /**
     * It creates a new table object and adds it to the table dictionary
     */
    const addTable = ({
        x = box.x + box.w / 2 - 200 + tables.length * 20,
        y = box.y + box.h / 2 - 200 + tables.length * 20
    }) => {
        setTableDict(state => {
            const id = nanoid();
            return {
                ...state,
                [id]: {
                    id,
                    name: `Table Name ${tables.length + 1}`,
                    x,
                    y,
                    fields: [
                        {
                            id: nanoid(),
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

    /**
     * It takes a table object, updates the tableDict state with the new table object, and then sets
     * the editingTable state to null
     */
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
        setEditingField(null);
    };

    /**
     * It removes a table from the table dictionary, and removes any links that are connected to that table
     */
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
                        endpoint => endpoint.id === tableId
                    )
                ) {
                    delete newState[key];
                }
            });
            return newState;
        });

        setEditingTable(null);
    };

    /**
     * It sets the editing table to the table that was clicked.
     */
    const handlerEditingTable = table => {
        setEditingTable(table);
    };

    const handlerEditingField = field => {
        setEditingField(field);
    };

    const [linkStat, setLinkStat] = useState({
        startX: null,
        startY: null,
        startTableId: null,
        startField: null,
        endX: null,
        endY: null,
    });

    /**
     * It sets the linkStat object to the current mouse position and the table and field that the mouse
     * is over
     */
    const gripMouseDownHandler = e => {
        if (version !== 'currentVersion') return;
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

    const TableWidth = 240;

    const [committing, setCommitting] = useState(false);

    const [editingLink, setEditingLink] = useState(null);

    const [command, setCommand] = useState('');

    const [formChange, setFormChange] = useState(false);

    const fieldRef = useRef(null);

    const [addField, setAddField] = useState(null);

    const handlerAddField = (table, index) => {
        table.fields.splice(index + 1, 0, {
            id: nanoid(),
            name: 'new item' + table.fields.length,
            type: 'VARCHAR',
            unique: false,
        });
        setTableDict(state => {
            return {
                ...state,
                [table.id]: {
                    ...state[table.id],
                    ...table,
                },
            };
        });
        handlerEditingField({ field: table.fields[index + 1], table });
        setAddField({ index: index + 1, table });
    };

    const removeField = (table, index) => {
        table.fields.splice(index, 1);
        setTableDict(state => {
            return {
                ...state,
                [table.id]: {
                    ...state[table.id],
                    ...table,
                },
            };
        });
    };

    const handlerRemoveField = (table, index) => {
        // if (table.fields.length === 1) {
        //     return Modal.confirm({
        //         title: (
        //             <>
        //                 Are you sure delete table <Tag color="arcoblue">{table.name}</Tag> field <Tag color="arcoblue">{table.fields[index].name}</Tag>?
        //             </>
        //         ),
        //         content: 'This table only one field, and will be delete table.',
        //         okText: 'Delete',
        //         cancelText: 'Cancel',
        //         onOk: () => {
        //             removeTable(table.id);
        //         },
        //     });
        // }

        Modal.confirm({
            title: (
                <>
                    Are you sure delete table <Tag color="arcoblue">{table.name}</Tag> field <Tag color="arcoblue">{table.fields[index].name}</Tag>?
                </>
            ),
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: () => {
                removeField(table, index);
            },
        });
    };

    const handlerImportTable = ({ tableDict, linkDict }) => {
        setTableDict(state => ({
            ...state,
            ...tableDict,
        }));
        setLinkDict(state => ({
            ...state,
            ...linkDict,
        }));
    };

    const handlerHistory = async () => {
        const id = new URLSearchParams(global.location.search).get('id');
        const history = await db.logs.where('graphId').equals(id).desc().toArray();
        setHistory(history);
    };

    const handlerVersion = async item => {
        let graph;
        if (item === 'currentVersion') {
            const id = new URLSearchParams(global.location.search).get('id');
            graph = await db.graphs.get(id);
            graph.updatedAt = 'currentVersion';
        } else {
            graph = item;
        }

        setVersion(graph.updatedAt);
        setTableDict(graph.tableDict);
        setLinkDict(graph.linkDict);
        setName(graph.name);
    };

    const applyHistory = () => {
        updateGraph();
        setVersion('currentVersion');
        setHistory(undefined);
    };

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
            <Nav
                addTable={addTable}
                setTableDict={setTableDict}
                setLinkDict={setLinkDict}
                tableDict={tableDict}
                linkDict={linkDict}
                box={box}
                name={name}
                setName={setName}
                setCommand={setCommand}
                theme={theme}
                setTheme={setTheme}
                saveGraph={updateGraph}
                handlerHistory={handlerHistory}
                applyHistory={applyHistory}
                editable={version === 'currentVersion'}
            />
            <svg
                className="main"
                viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={mouseMoveHandler}
                onContextMenu={contextMenuHandler}
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
                            editable={version === 'currentVersion'}
                        />
                    );
                })}
                {tables.map(table => {
                    return (
                        <Table
                            key={table.id}
                            table={table}
                            TableWidth={TableWidth}
                            tableMouseDownHandler={tableMouseDownHandler}
                            handlerEditingTable={handlerEditingTable}
                            gripMouseDownHandler={gripMouseDownHandler}
                            handlerEditingField={handlerEditingField}
                            handlerAddField={handlerAddField}
                            handlerRemoveField={handlerRemoveField}
                            removeTable={removeTable}
                            updateTable={updateTable}
                            editable={version === 'currentVersion'}
                        />
                    );
                })}

                <rect x="0" y="0" width="2" height="2"></rect>
                {mode === 'linking' &&
                    version === 'currentVersion' &&
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
                width={620}
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
                escToExit={!formChange}
                maskClosable={!formChange}
                afterClose={() => {
                    setFormChange(false);
                }}
            >
                {editingTable ? (
                    <TableForm
                        table={editingTable}
                        updateTable={updateTable}
                        removeTable={removeTable}
                        committing={committing}
                        setCommitting={setCommitting}
                        formChange={formChange}
                        setFormChange={setFormChange}
                    />
                ) : null}
            </Drawer>
            <FieldForm
                {...editingField}
                ref={fieldRef}
                updateTable={updateTable}
                formChange={formChange}
                setFormChange={setFormChange}
                addField={addField}
                setAddField={setAddField}
                removeField={removeField}
                setEditingField={setEditingField}
            />
            <LinkModal
                editingLink={editingLink}
                setEditingLink={setEditingLink}
                setLinkDict={setLinkDict}
            />
            <ImportModal
                handlerImportTable={handlerImportTable}
                importType={importType}
                setImportType={setImportType}
                theme={theme}
            />
            <ExportModal
                command={command}
                setCommand={setCommand}
                theme={theme}
            />
            {version === 'currentVersion' && (
                <ContextMenu
                    theme={theme}
                    menuId={MENU_ID}
                    addTable={addTable}
                    setImportType={setImportType}
                    saveGraph={updateGraph}
                    setCommand={val => {
                        const sql = exportSQL(tableDict, linkDict, val);
                        setCommand(sql);
                    }}
                />
            )}
            <HistoryDrawer
                history={history}
                setHistory={setHistory}
                version={version}
                setVersion={setVersion}
                handlerVersion={handlerVersion}
                handlerHistory={handlerHistory}
            />
        </div>
    );
}
