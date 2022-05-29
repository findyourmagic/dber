import { useState, useEffect, useCallback } from 'react';
import { db } from '../data/db';

export default function useGraphState() {
    const [tableDict, setTableDict] = useState({});
    const [linkDict, setLinkDict] = useState({});
    const [name, setName] = useState('Untitled graph');

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
    useEffect(() => {
        setId(new URLSearchParams(global.location.search).get('id'));
    }, []);

    useEffect(() => {
        if (!id) return;
        const initGraph = async () => {
            const graph = await db.graphs.get(id);
            if (graph) {
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
            } else {
                resizeHandler();
            }
        };
        initGraph();
    }, [id]);

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
    };
}
