import { diffJson } from 'diff';

import { dbAdaptor } from '@/package.json';

const dbc = {
    indexed: require('./adaptor/indexed'),
    soul: require('./adaptor/soul'),
}[dbAdaptor];

export const getAllGraphs = async () => await dbc.getAllGraphs();

export const getGraph = async id => await dbc.getGraph(id);

export const saveGraph = async data => {
    const { id, ...newData } = data;
    const { id: _, ...curData } = await dbc.getGraph(id);

    newData.createdAt = curData.createdAt;
    await dbc.saveGraph({ id, ...newData });

    if (diffJson(newData, curData).length > 1) {
        curData.graphId = id;
        await dbc.addLogs(curData);
    }
};

export const delGraph = async id => await dbc.delGraph(id);

export const addGraph = async (graph = {}, id = null) => await dbc.addGraph(graph, id);

export const getLogs = async id => await dbc.getLogs(id);

export const delLogs = async id => await dbc.delLogs(id);
