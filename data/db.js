/* Creating a database called graphDB and creating a table called graphs. */
import Dexie from 'dexie';

export const db = new Dexie('graphDB');

db.version(2).stores({
    graphs: 'id',
    meta: '++id, inited',
});
