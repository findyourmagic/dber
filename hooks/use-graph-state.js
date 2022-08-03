import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@arco-design/web-react';
import { db } from '../data/db';

/**
 * It returns a state object that contains the graph data, and a set of functions to update the graph
 * data
 * @returns An object with the following properties:
 * {
 *  tableDict,
 *  setTableDict,
 *  linkDict,
 *  setLinkDict,
 *  box,
 *  setBox,
 *  name,
 *  setName,
 *  }
 */
export default function useGraphState() {
    const [tableDict, setTableDict] = useState({});
    const [linkDict, setLinkDict] = useState({});
    const [name, setName] = useState('Untitled graph');
    const [theme, setTheme] = useState(null);

    // viewbox of svg
    const [box, setBox] = useState({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        clientW: 0,
        clientH: 0,
    });

    const [id, setId] = useState(null);
    const [inited, setInited] = useState(false);

    /**
     * It takes a graph object and sets the state of the app to match the graph object
     */
    const loadGraph = graph => {
        if (graph.tableDict) setTableDict(graph.tableDict);
        if (graph.linkDict) setLinkDict(graph.linkDict);
        if (graph.box) {
            const { x, y, w, h, clientH, clientW } = graph.box;
            setBox({
                x,
                y,
                w:
                    w && clientW
                        ? w * (global.innerWidth / clientW)
                        : global.innerWidth,
                h:
                    h && clientH
                        ? h * (global.innerHeight / clientH)
                        : global.innerHeight,
                clientW: global.innerWidth,
                clientH: global.innerHeight,
            });
        }
        if (graph.name) setName(graph.name);
    };

    useEffect(() => {
        setId(new URLSearchParams(global.location.search).get('id'));
    }, []);

    useEffect(() => {
        if (!id) return;

        /**
         * > If the graph is in the local storage, and the graph in the local storage is newer than the
         * graph in the database, then ask the user if they want to load the graph from the local
         * storage
         */
        const initGraph = async () => {
            const graph = await db.graphs.get(id);
            const storageGraph = JSON.parse(window.localStorage.getItem(id));
            if (graph?.updatedAt < storageGraph?.updatedAt) {
                Modal.confirm({
                    title: 'Unsaved changes',
                    content:
                        'You have some unsaved changes after last version, do you want to restore them? Once you press the no button, the unsaved changes will be cleaned immediately. You can’t undo this action.',
                    cancelButtonProps: { status: 'danger' },
                    okText: 'Yes, restore them',
                    cancelText: 'No, ignore them',
                    onOk: () => {
                        loadGraph(storageGraph);
                    },
                    onCancel: () => {
                        loadGraph(graph);
                        window.localStorage.removeItem(id);
                    },
                });
            } else if (graph) {
                loadGraph(graph);
            } else {
                resizeHandler();
            }
            setInited(true);
        };
        initGraph();
    }, [id]);

    useEffect(() => {
        if (!id || !inited) return;
        window.localStorage.setItem(
            id,
            JSON.stringify({
                id,
                tableDict,
                linkDict,
                box,
                name,
                updatedAt: new Date().valueOf(),
            })
        );
    }, [id, inited, box, linkDict, tableDict, name]);

    useEffect(() => {
        const t = theme || window.localStorage.getItem('theme') || 'light';
        t === 'dark'
            ? document.body.setAttribute('arco-theme', 'dark')
            : document.body.removeAttribute('arco-theme');
        window.localStorage.setItem('theme', t);
        if (theme === null) setTheme(t);
    }, [theme]);

    /* A callback function that is used to update the viewbox of the svg. */
    const resizeHandler = useCallback(() => {
        setBox(state => {
            return {
                x: state.x,
                y: state.y,
                w:
                    state.w && state.clientW
                        ? state.w * (global.innerWidth / state.clientW)
                        : global.innerWidth,
                h:
                    state.h && state.clientH
                        ? state.h * (global.innerHeight / state.clientH)
                        : global.innerHeight,
                clientW: global.innerWidth,
                clientH: global.innerHeight,
            };
        });
    }, []);

    useEffect(() => {
        global.addEventListener('resize', resizeHandler);
        return () => {
            global.removeEventListener('resize', resizeHandler);
        };
    }, []);

    return {
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
    };
}
