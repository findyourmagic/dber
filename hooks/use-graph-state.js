import { useState, useEffect, useCallback, useMemo } from 'react';
import { createContainer } from 'unstated-next';
import { useRouter } from 'next/router';
import { Modal } from '@arco-design/web-react';
import { getGraph } from '../data/db';

/**
 * It returns a state object that contains the graph data, and a set of functions to update the graph
 * data
 * @returns An object with the following properties:
 */
function useGraphState() {
    const [init, setInit] = useState(false);
    const [name, setName] = useState('Untitled graph');
    const [theme, setTheme] = useState('');
    const [version, setVersion] = useState('currentVersion');

    // viewbox of svg
    const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0, clientW: 0, clientH: 0 });
    const [tableDict, setTableDict] = useState({});
    const [linkDict, setLinkDict] = useState({});

    const [editingTable, setEditingTable] = useState();
    const [editingField, setEditingField] = useState({});
    const [addingField, setAddingField] = useState(null);

    const router = useRouter();
    const { id } = router.query;
    // const id = new URLSearchParams(global?.location?.search).get('id');

    /* A callback function that is used to update the viewbox of the svg. */
    const resizeHandler = useCallback(() => {
        setBox(state => {
            return {
                x: state.x,
                y: state.y,
                w:
                    state.w && state.clientW
                        ? state.w * (window.innerWidth / state.clientW)
                        : window.innerWidth,
                h:
                    state.h && state.clientH
                        ? state.h * (window.innerHeight / state.clientH)
                        : window.innerHeight,
                clientW: window.innerWidth,
                clientH: window.innerHeight,
            };
        });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    /**
     * It takes a graph object and sets the state of the app to match the graph object
     */
    const loadGraph = graph => {
        if (!graph) return resizeHandler();

        if (graph.tableDict) setTableDict(graph.tableDict);
        if (graph.linkDict) setLinkDict(graph.linkDict);
        if (graph.box) {
            const { x, y, w, h, clientH, clientW } = graph.box;
            setBox({
                x,
                y,
                w: w && clientW ? w * (window.innerWidth / clientW) : window.innerWidth,
                h: h && clientH ? h * (window.innerHeight / clientH) : window.innerHeight,
                clientW: window.innerWidth,
                clientH: window.innerHeight,
            });
        }
        if (graph.name) setName(graph.name);
    };

    useEffect(() => {
        if (!id) {
            setTableDict({});
            setLinkDict({});
            setName('');
            resizeHandler();
            return;
        }

        /**
         * > If the graph is in the local storage, and the graph in the local storage is newer than the
         * graph in the database, then ask the user if they want to load the graph from the local
         * storage
         */
        const initGraph = async () => {
            setInit(true);

            const graph = await getGraph(id);
            loadGraph(graph);

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
                        window.localStorage.removeItem(id);
                    },
                });
            } else {
                resizeHandler();
            }
        };
        initGraph();
    }, [id]);

    useEffect(() => {
        if (init) setInit(false);
        if (!id || init || !Object.keys(tableDict).length) return;

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
    }, [box, linkDict, tableDict, name]);

    useEffect(() => {
        const t = theme || window.localStorage.getItem('theme') || 'light';
        t === 'dark'
            ? document.body.setAttribute('arco-theme', 'dark')
            : document.body.removeAttribute('arco-theme');
        window.localStorage.setItem('theme', t);
        if (!theme) setTheme(t);
    }, [theme]);

    const tableList = useMemo(() => Object.values(tableDict), [tableDict]);

    return {
        id,
        tableList,
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
        version,
        setVersion,
        editingTable,
        setEditingTable,
        editingField,
        setEditingField,
        addingField,
        setAddingField,
    };
}

export default createContainer(useGraphState);
