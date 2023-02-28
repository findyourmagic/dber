import { nanoid } from 'nanoid';
import graphState from './use-graph-state';
import { saveGraph, getGraph } from '../data/db';
import {
    tableWidth,
    tableMarginLeft,
    tableMarginTop,
    tableRowNumbers,
    fieldHeight,
    titleHeight,
    commentHeight,
} from '../data/settings';

const tableModel = () => {
    const {
        id,
        tableList,
        tableDict,
        setTableDict,
        linkDict,
        setLinkDict,
        box,
        name,
        setName,
        setVersion,
        setEditingTable,
        setEditingField,
        setAddingField,
    } = graphState.useContainer();

    const updateGraph = async () => {
        await saveGraph({ id, name, tableDict, linkDict, box });
        setVersion('currentVersion');
    };

    const calcXY = (start, tables = tableList) => {
        const index = start || Math.max(1, tables.length);
        let x, y;
        if (!tables.length) {
            x = box.x + 196 + 72;
            y = box.y + 72;
        } else {
            if (index < tableRowNumbers) {
                const lastTable = tables[index - 1];
                x = lastTable.x + tableWidth + tableMarginLeft;
                y = lastTable.y;
            } else {
                const lastTable = tables[index - tableRowNumbers];
                const { fields } = lastTable;
                x = lastTable.x;
                y =
                    lastTable.y +
                    fields.length * fieldHeight +
                    titleHeight +
                    commentHeight +
                    tableMarginTop;
            }
        }
        return [x, y];
    };

    /**
     * It creates a new table object and adds it to the table dictionary
     */
    const addTable = () => {
        const [x, y] = calcXY();
        const id = nanoid();
        const newTable = {
            [id]: {
                id,
                name: `Table Name ${tableList.length + 1}`,
                x,
                y,
                fields: [
                    {
                        id: nanoid(),
                        name: 'id',
                        type: 'INTEGER',
                        pk: true,
                        increment: true,
                    },
                ],
            },
        };
        // setTableDict(state => ({ ...state, ...newTable }));
        setEditingTable(newTable[id]);
    };

    /**
     * It takes a table object, updates the tableDict state with the new table object, and then sets
     * the editingTable state to null
     */
    const updateTable = table => {
        if (table) {
            setTableDict(state => {
                return {
                    ...state,
                    [table.id]: {
                        ...state[table.id],
                        ...table,
                    },
                };
            });
        }
        setLinkDict(state => {
            const newState = { ...state };
            Object.keys(newState).forEach(key => {
                if (
                    newState[key].endpoints.some(
                        endpoint =>
                            endpoint.id === table.id &&
                            !table.fields.some(field => field.id === endpoint.fieldId)
                    )
                )
                    delete newState[key];
            });
            return newState;
        });
        setEditingTable(null);
        setEditingField({});
    };

    /**
     * It removes a table from the table dictionary, and removes any links that are connected to that table
     */
    const removeTable = tableId => {
        setTableDict(state => {
            const newState = { ...state };
            delete newState[tableId];
            return newState;
        });

        setLinkDict(state => {
            const newState = { ...state };
            Object.keys(newState).forEach(key => {
                if (newState[key].endpoints.find(endpoint => endpoint.id === tableId)) {
                    delete newState[key];
                }
            });
            return newState;
        });

        setEditingTable(null);
    };

    const addField = (table, index) => {
        table.fields.splice(index + 1, 0, {
            id: nanoid(),
            name: 'new item' + table.fields.length,
            type: 'VARCHAR',
            unique: false,
        });
        setTableDict(state => {
            return {
                ...state,
                [table.id]: {
                    ...state[table.id],
                    ...table,
                },
            };
        });
        setEditingField({ field: table.fields[index + 1], table });
        setAddingField({ index: index + 1, table });
    };

    const removeField = (table, index) => {
        const [filed] = table.fields.splice(index, 1);
        setTableDict(state => {
            return {
                ...state,
                [table.id]: {
                    ...state[table.id],
                    ...table,
                },
            };
        });
        setLinkDict(state => {
            const newState = { ...state };
            Object.keys(newState).forEach(key => {
                if (newState[key].endpoints.find(endpoint => endpoint.fieldId === filed.id)) {
                    delete newState[key];
                }
            });
            return newState;
        });
    };

    const applyVersion = async item => {
        let graph;
        if (item === 'currentVersion') {
            graph = await getGraph(id);
            graph.updatedAt = 'currentVersion';
        } else {
            graph = item;
        }

        setVersion(graph.updatedAt);
        setTableDict(graph.tableDict);
        setLinkDict(graph.linkDict);
        setName(graph.name);
    };

    return {
        updateGraph,
        addTable,
        updateTable,
        removeTable,
        addField,
        removeField,
        applyVersion,
        calcXY,
    };
};

export default tableModel;
