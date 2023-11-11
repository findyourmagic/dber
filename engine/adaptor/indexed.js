/* Creating a database called graphDB and creating a table called graphs. */
import Dexie from 'dexie';
import { nanoid } from 'nanoid';

export const db = new Dexie('graphDB');

db.version(4).stores({
    graphs: 'id',
    logs: '++id, graphId',
});

export const getAllGraphs = async () => await db.graphs.toArray();

export const getGraph = async id => await db.graphs.get(id);

export const saveGraph = async graph => {
    graph.updatedAt = new Date().valueOf();
    return await db.graphs.put(graph);
};

export const delGraph = async id => await db.graphs.delete(id);

export const addGraph = async (graph = {}, id = null) => {
    const graphId = id || nanoid();
    const now = new Date().valueOf();
    await db.graphs.add({
        ...graph,
        id: graphId,
        box: {
            x: 0,
            y: 0,
            w: global.innerWidth,
            h: global.innerHeight,
            clientW: global.innerWidth,
            clientH: global.innerHeight,
        },
        createdAt: now,
        updatedAt: now,
    });
    return graphId;
};

export const addLogs = async data => await db.logs.add(data);

export const getLogs = async id => await db.logs.where('graphId').equals(id).desc().toArray();

export const delLogs = id => db.logs.delete(id);
