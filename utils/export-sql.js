import { ModelExporter, Parser } from '@dbml/core';

const exportSQL = (tableDict, linkDict, databaseType = 'postgres') => {
    const combined = {
        name: 'public',
        note: '',
        tables: Object.values(tableDict).map(table => {
            return {
                name: table.name,
                note: table.note,
                fields: Object.values(table.fields).map(field => {
                    return {
                        ...field,
                        type: {
                            type_name: field.type,
                            args: null,
                        },
                    };
                }),
            };
        }),
        enums: [],
        tableGroups: [],
        refs: Object.values(linkDict).map(ref => {
            return {
                ...ref,
                endpoints: ref.endpoints.map(endpoint => {
                    return {
                        ...endpoint,
                        tableName: tableDict[endpoint.id].name,
                        fieldNames: [
                            tableDict[endpoint.id].fields.find(field => {
                                if (field.id == endpoint.fieldId) return true;
                                return false;
                            }).name,
                        ],
                    };
                }),
            };
        }),
    };

    const database = Parser.parse(combined, 'json');
    const sql = ModelExporter.export(database, databaseType, false);

    return sql;
};

export default exportSQL;
