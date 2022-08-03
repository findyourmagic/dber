/* Creating a database called graphDB and creating a table called graphs. */
import Dexie from 'dexie';
import { Notification } from '@arco-design/web-react';
import { diffJson } from 'diff';

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
