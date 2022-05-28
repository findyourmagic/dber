import { useState, useEffect, useCallback } from 'react';

export default function useGraphState({ defaultTables, defaultLinks }) {
    const [tableDict, setTableDict] = useState(defaultTables);
    const [linkDict, setLinkDict] = useState(defaultLinks);

    // viewbox of svg
    const [box, setBox] = useState({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        clientW: 0,
        clientH: 0,
    });

    const [inited, setInited] = useState(false);

    useEffect(() => {
        const _tableDict = window.localStorage.getItem('tableDict');
        const _linkDict = window.localStorage.getItem('linkDict');
        const _box = window.localStorage.getItem('box');
        if (_tableDict) {
            setTableDict(JSON.parse(_tableDict));
        }
        if (_linkDict) {
            setLinkDict(JSON.parse(_linkDict));
        }
        if (_box) {
            setBox(() => {
                console.log(_box);
                const state = JSON.parse(_box);
                console.log(state.w && state.clientW);
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
        } else {
            resizeHandler();
        }
        setInited(true);
    }, []);

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

    useEffect(() => {
        if (inited) {
            window.localStorage.setItem('box', JSON.stringify(box));
        }
    }, [box]);

    return {
        tableDict,
        setTableDict,
        linkDict,
        setLinkDict,
        box,
        setBox,
    };
}
