const defaultLinks = {
    link1: {
        id: 'link1',
        name: null,
        endpoints: [
            {
                id: 'table1',
                // tableName: "sales",
                // fieldNames: ["id"],
                fieldId: 'field1',
                relation: '1',
            },
            {
                id: 'table2',
                // tableName: "store",
                // fieldNames: ["id"],
                relation: '*',
                fieldId: 'field3',
            },
        ],
    },
};

export default defaultLinks;
