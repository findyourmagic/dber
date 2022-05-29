// db.js
import Dexie from 'dexie';

export const db = new Dexie('graphDB');

db.version(1).stores({
    graphs: 'id',
});
