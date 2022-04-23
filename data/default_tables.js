const defaultTables = {
    table1: {
        id: 'table1',
        name: 'date',
        alias: null,
        x: 100,
        y: 100,
        fields: [
            {
                id: 'field1',
                name: 'id',
                type: 'int',
                // type: {
                //     type_name: "int",
                //     args: null,
                // },
                pk: true,
            },
            {
                id: 'field2',
                name: 'date',
                type: 'datetime',
                // type: {
                //     type_name: "datetime",
                //     args: null,
                // },
                note: 'replace text here',
            },
        ],
        indexes: [],
    },
    table2: {
        id: 'table2',
        name: 'table2',
        alias: null,
        x: 400,
        y: 400,
        fields: [
            {
                id: 'field3',
                name: 'id',
                type: 'int',
                // type: {
                //     type_name: "int",
                //     args: null,
                // },
                pk: true,
            },
            {
                id: 'field4',
                name: 'date',
                type: 'datetime',
                // type: {
                //     type_name: "datetime",
                //     args: null,
                // },
                note: 'replace text here',
            },
        ],
        indexes: [],
    },
};

export default defaultTables;
