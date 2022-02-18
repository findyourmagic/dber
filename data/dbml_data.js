const dbml = {
    name: "public",
    note: "Default Public Schema",
    tables: [
        {
            name: "date",
            alias: null,
            fields: [
                {
                    name: "id",
                    type: {
                        type_name: "int",
                        args: null,
                    },
                    pk: true,
                },
                {
                    name: "date",
                    type: {
                        type_name: "datetime",
                        args: null,
                    },
                    note: "replace text here",
                },
            ],
            indexes: [],
        },
    ],
    enums: [],
    tableGroups: [],
    refs: [
        {
            name: null,
            endpoints: [
                {
                    tableName: "sales",
                    fieldNames: ["store_id"],
                    relation: "1",
                },
                {
                    tableName: "store",
                    fieldNames: ["store_id"],
                    relation: "*",
                },
            ],
        },
    ],
};

export default dbml;
