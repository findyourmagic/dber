/* Creating a database called graphDB and creating a table called graphs. */
import Dexie from 'dexie';
import { Notification } from '@arco-design/web-react';

export const db = new Dexie('graphDB');

db.version(3).stores({
    graphs: 'id',
    meta: '++id, inited',
    logs: '++id, graphId',
});

export const saveGraph = async ({
    id,
    name,
    tableDict,
    linkDict,
    box,
}) => {
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
        });
        db.logs.add({
            graphId: id,
            tableDict: data.tableDict,
            linkDict: data.linkDict,
            name: data.name,
            updatedAt: data.updatedAt,
        });
        Notification.success({
            title: 'Save success',
        });
    } catch (e) {
        Notification.error({
            title: 'Save failed',
        });
    }
};
