import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { useHotkeys } from 'react-hotkeys-hook';

import TableForm from '@/components/table_form';
import FieldForm from '@/components/field_form';
import LinkPath from '@/components/link_path';
import LinkModal from '@/components/link_modal';
import Nav from '@/components/nav';
import Table from '@/components/table';
import TableNav from '@/components/table_nav';
import ContextMenu from '@/components/context_menu';
import LogsDrawer from '@/components/logs';
import graphState from '@/hooks/use-graph-state';
import tableModel from '@/hooks/table-model';

const ExportModal = dynamic(() => import('@/components/export_modal'), {
    ssr: false,
});
const ImportModal = dynamic(() => import('@/components/import_modal'), {
    ssr: false,
});

export default function Home() {
    const {
        tableList,
        tableDict,
        setTableDict,
        linkDict,
        setLinkDict,
        box,
        setBox,
        name,
        version,
    } = graphState.useContainer();

    const { updateGraph, addTable } = tableModel();

    const links = useMemo(() => Object.values(linkDict), [linkDict]);
    const svg = useRef();

    // ''|dragging|moving|linking
    const [mode, setMode] = useState('');
    // offset of svg origin
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [movingTable, setMovingTable] = useState();

    const [showModal, setShowModal] = useState('');
    const [showDrawer, setShowDrawer] = useState('');
    const [formChange, setFormChange] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [tableSelectedId, setTableSelectId] = useState(null);

    const [linkStat, setLinkStat] = useState({
        startX: null,
        startY: null,
        startTableId: null,
        startField: null,
        endX: null,
        endY: null,
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
            const row = e.target.classList.contains('row') ? e.target : e.target.closest('.row');
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
                    )
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

        return point.matrixTransform(svg.current.getScreenCTM().inverse());
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
        let { deltaY, deltaX } = e;
        const cursor = getSVGCursor(e);

        if (!e.ctrlKey) {
            setBox(state => {
                if (state.w > 4000 && deltaY > 0) return state;
                if (state.w < 600 && deltaY < 0) return state;

                return {
                    x: state.x + deltaX,
                    y: state.y + deltaY,
                    w: state.w,
                    h: state.h,
                    clientH: state.clientH,
                    clientW: state.clientW,
                };
            });
        } else {
            setBox(state => {
                if (state.w > 4000 && deltaY > 0) return state;
                if (state.w < 600 && deltaY < 0) return state;

                deltaY = deltaY * 2;
                deltaX = deltaY * (state.w / state.h);

                const deltaLimit = 600;

                if (deltaY > deltaLimit) {
                    deltaY = deltaY > deltaLimit ? deltaLimit : deltaY;
                    deltaX = deltaY * (state.w / state.h);
                } else if (deltaY < -deltaLimit) {
                    deltaY = deltaY < -deltaLimit ? -deltaLimit : deltaY;
                    deltaX = deltaY * (state.w / state.h);
                }

                return {
                    x: state.x - ((cursor.x - state.x) / state.w) * deltaX,
                    y: state.y - ((cursor.y - state.y) / state.h) * deltaY,
                    w: state.w + deltaX,
                    h: state.h + deltaY,
                    clientH: state.clientH,
                    clientW: state.clientW,
                };
            });
        }

        e.preventDefault();
    };

    useEffect(() => {
        const instance = svg.current;
        instance.addEventListener('wheel', wheelHandler, { passive: false });
        return () => {
            instance.removeEventListener('wheel', wheelHandler, {
                passive: false,
            });
        };
    }, [version]);

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

    const handlerTableSelected = table => {
        // 表位置移动后的 x/y 会表现不一致
        const svgInfo = svg.current.getBBox();
        setBox(state => {
            const newX = table.x + svgInfo.x - (table.x > -16 ? 264 : -table.x / 2);
            return {
                w: state.w,
                h: state.h,
                x: newX,
                y: svgInfo.y + table.y + (svgInfo.y < 0 ? 88 : -72),
                clientH: state.clientH,
                clientW: state.clientW,
            };
        });
        setTableSelectId(table.id);
    };

    useHotkeys('ctrl+s, meta+s', () => updateGraph(), { preventDefault: true }, [
        tableDict,
        linkDict,
        name,
    ]);

    useHotkeys('ctrl+n, meta+n', () => addTable(), { preventDefault: true }, [tableDict, linkDict]);

    useHotkeys('ctrl+e, meta+e', () => setShowModal('export'), { preventDefault: true }, [
        tableDict,
        linkDict,
    ]);

    useHotkeys('ctrl+i, meta+i', () => setShowModal('import'), { preventDefault: true });

    useHotkeys('ctrl+h, meta+h', () => setShowDrawer('logs'), { preventDefault: true });

    useHotkeys(
        'ctrl+=, meta+=',
        () => {
            setBox(state => ({
                x: state.x + state.w * 0.05,
                y: state.y + state.h * 0.05,
                w: state.w * 0.9,
                h: state.h * 0.9,
                clientH: state.clientH,
                clientW: state.clientW,
            }));
        },
        { preventDefault: true }
    );

    useHotkeys(
        'ctrl+-, meta+-',
        () => {
            setBox(state => ({
                x: state.x - state.w * 0.05,
                y: state.y - state.h * 0.05,
                w: state.w * 1.1,
                h: state.h * 1.1,
                clientH: state.clientH,
                clientW: state.clientW,
            }));
        },
        { preventDefault: true }
    );

    useHotkeys(
        'ctrl+0, meta+0',
        () => {
            setBox(state => ({
                x: 0,
                y: 0,
                w: state.clientW,
                h: state.clientH,
                clientH: state.clientH,
                clientW: state.clientW,
            }));
        },
        { preventDefault: true }
    );

    useHotkeys(
        ['ctrl+a', 'meta+a'],
        () => {
            const svgInfo = svg.current.getBBox();
            setBox(state => ({
                x: 0,
                y: svgInfo.y - 72,
                w: svgInfo.width,
                h: svgInfo.height,
                clientH: state.clientH,
                clientW: state.clientW,
            }));
        },
        { preventDefault: true }
    );

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

            <Nav setShowModal={setShowModal} setShowDrawer={setShowDrawer} />

            <ContextMenu setShowModal={setShowModal}>
                <svg
                    className="main"
                    viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
                    onMouseDown={mouseDownHandler}
                    onMouseUp={mouseUpHandler}
                    onMouseMove={mouseMoveHandler}
                    // onWheel={wheelHandler}
                    ref={svg}
                >
                    {tableList.map(table => {
                        return (
                            <Table
                                key={table.id}
                                table={table}
                                onTableMouseDown={tableMouseDownHandler}
                                onGripMouseDown={gripMouseDownHandler}
                                tableSelectedId={tableSelectedId}
                                setTableSelectId={setTableSelectId}
                            />
                        );
                    })}
                    {links.map(link => {
                        return (
                            <LinkPath
                                link={link}
                                key={`${link.id}`}
                                setEditingLink={setEditingLink}
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
            </ContextMenu>

            <TableForm formChange={formChange} onFormChange={setFormChange} />
            <FieldForm formChange={formChange} onFormChange={setFormChange} />
            <LinkModal editingLink={editingLink} setEditingLink={setEditingLink} />
            <ImportModal showModal={showModal} onCloseModal={() => setShowModal('')} />
            <ExportModal showModal={showModal} onCloseModal={() => setShowModal('')} />
            <LogsDrawer showDrawer={showDrawer} onCloseDrawer={() => setShowDrawer('')} />
            <TableNav
                onTableSelected={handlerTableSelected}
                setTableSelectId={setTableSelectId}
                tableSelectedId={tableSelectedId}
            />
        </div>
    );
}
