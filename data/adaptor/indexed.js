/* Creating a database called graphDB and creating a table called graphs. */
import Dexie from 'dexie';
import { Notification } from '@arco-design/web-react';
import { diffJson } from 'diff';
import { nanoid } from 'nanoid';

export const db = new Dexie('graphDB');

db.version(4).stores({
    graphs: 'id',
    logs: '++id, graphId',
});

export const getAllGraphs = async () => await db.graphs.toArray();

export const getGraph = async id => await db.graphs.get(id);

export const saveGraph = async ({ id, name, tableDict, linkDict, box }) => {
    const now = new Date().valueOf();
    try {
        const data = await db.graphs.get(id);
        await db.graphs.put({
            id,
            tableDict,
            linkDict,
            box,
            name,
            updatedAt: now,
            createdAt: data.createdAt,
        });

        const logJson = {
            tableDict: data.tableDict,
            linkDict: data.linkDict,
            name: data.name,
        };

        if (diffJson({ tableDict, linkDict, name }, logJson).length > 1) {
            db.logs.add({
                graphId: id,
                updatedAt: data.updatedAt,
                ...logJson,
            });
        }

        Notification.success({
            title: 'Save success',
        });
    } catch (e) {
        Notification.error({
            title: 'Save failed',
        });
    }
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

export const getLogs = async id => await db.logs.where('graphId').equals(id).desc().toArray();

export const delLogs = id => db.logs.delete(id);
