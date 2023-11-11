import { nanoid } from 'nanoid';

import { soulUrl } from '@/package.json';

const initGraphs = async () => {
    const data = {
        name: 'graphs',
        autoAddCreatedAt: true,
        autoAddUpdatedAt: true,
        schema: [
            { name: 'id', type: 'Text', primaryKey: true },
            { name: 'name', type: 'Text', unique: true },
            { name: 'box', type: 'Text' },
            { name: 'linkDict', type: 'Text' },
            { name: 'tableDict', type: 'Text' },
        ],
    };
    await fetch(`${soulUrl}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data),
    });

    const logs = {
        name: 'logs',
        autoAddCreatedAt: false,
        autoAddUpdatedAt: false,
        schema: [
            { name: 'graphId', type: 'Text', index: true },
            { name: 'name', type: 'Text' },
            { name: 'linkDict', type: 'Text' },
            { name: 'tableDict', type: 'Text' },
            { name: 'createdAt', type: 'Integer' },
            { name: 'updatedAt', type: 'Integer' },
        ],
    };
    await fetch(`${soulUrl}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(logs),
    });
};

export const getAllGraphs = async () => {
    const r = await (
        await fetch(`${soulUrl}/tables/graphs/rows?_schema=name,id,updatedAt,createdAt`)
    ).json();
    if (r.error) {
        await initGraphs();
    }
    return r.data;
};

export const getGraph = async id => {
    const r = await (await fetch(`${soulUrl}/tables/graphs/rows/${id}/`)).json();
    const [res] = r.data || [];
    if (res) {
        ['box', 'linkDict', 'tableDict'].forEach(key => {
            if (res[key]) res[key] = JSON.parse(res[key]);
        });
    }
    return res;
};

export const addGraph = async (graph = {}, id = null) => {
    const graphId = id || nanoid();
    const data = {
        id: graphId,
        name: graph.name,
        linkDict: graph.linkDict ? JSON.stringify(graph.linkDict) : undefined,
        tableDict: graph.tableDict ? JSON.stringify(graph.tableDict) : undefined,
        box: JSON.stringify({
            x: 0,
            y: 0,
            w: global.innerWidth,
            h: global.innerHeight,
            clientW: global.innerWidth,
            clientH: global.innerHeight,
        }),
    };
    const r = await (
        await fetch(`${soulUrl}/tables/graphs/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ fields: data }),
        })
    ).json();
    return graphId;
};

export const saveGraph = async graph => {
    const data = {
        name: graph.name,
        box: JSON.stringify(graph.box),
        linkDict: JSON.stringify(graph.linkDict),
        tableDict: JSON.stringify(graph.tableDict),
    };
    return await (
        await fetch(`${soulUrl}/tables/graphs/rows/${graph.id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ fields: data }),
        })
    ).json();
};

export const delGraph = async id => {
    return await (await fetch(`${soulUrl}/tables/graphs/rows/${id}/`, { method: 'DELETE' })).json();
};

export const getLogs = async id => {
    const r = await (await fetch(`${soulUrl}/tables/logs/rows?_filters=graphId:${id}`)).json();
    const res = r.data || [];
    console.log(res);
    res.forEach(item => {
        if (item) {
            ['linkDict', 'tableDict'].forEach(key => {
                if (item[key]) item[key] = JSON.parse(item[key]);
            });
        }
    });
    return res;
};

export const addLogs = async logs => {
    const data = {
        name: logs.name,
        graphId: logs.graphId,
        createdAt: logs.createdAt,
        updatedAt: logs.updatedAt,
        linkDict: JSON.stringify(logs.linkDict),
        tableDict: JSON.stringify(logs.tableDict),
    };
    return await (
        await fetch(`${soulUrl}/tables/logs/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ fields: data }),
        })
    ).json();
};

export const delLogs = async id => {
    return await (await fetch(`${soulUrl}/tables/logs/rows/${id}/`, { method: 'DELETE' })).json();
};
