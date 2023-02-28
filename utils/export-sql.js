import { ModelExporter, Parser } from '@dbml/core';

/**
 * It takes a table dictionary and a link dictionary and returns a SQL string
 * @param tableDict - a dictionary of tables, where the key is the table ID and the value is the tableobject
 * @param linkDict - a dictionary of links, where the key is the link id and the value is the linkobject
 * @param [databaseType=postgres] - The type of database you want to export to.
 * @returns SQL string.
 */
const exportSQL = (tableDict, linkDict, databaseType = 'postgres') => {
    const combined = {
        name: 'public',
        note: '',
        tables: Object.values(tableDict).map(table => {
            return {
                name: table.name,
                note: table.note,
                fields: table.fields.map(field => {
                    return {
                        ...field,
                        type: {
                            // To lower case because of typing 'BIGINT' with upper case and increment get wrong pg sql type when export
                            type_name: field.type.toLowerCase(),
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
                            tableDict[endpoint.id].fields.find(
                                field => field.id == endpoint.fieldId
                            ).name,
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
