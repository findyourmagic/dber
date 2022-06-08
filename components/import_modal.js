import { Modal, Notification, Input } from '@arco-design/web-react';
import { Parser } from '@dbml/core';
import { useState } from 'react';
import { db } from '../data/db';

const save = async ({
    id,
    tableDict,
    linkDict,
    box,
    name = 'Untitled Graph',
}) => {
    try {
        await db.graphs.put({
            id,
            tableDict,
            linkDict,
            box,
            name,
            updatedAt: new Date().valueOf(),
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

export function ImportModal({ importType, setImportType, addGraph }) {
    const [value, setValue] = useState('');

    const handleOk = async () => {
        if (!value) return;
        try {
            const result = await Parser.parse(value, importType.toLowerCase());
            const graph = result.schemas[0];
            const tableDict = {};
            const linkDict = {};
            graph.tables.forEach((table, index) => {
                const id = window.crypto.randomUUID();
                tableDict[id] = {
                    id,
                    name: table.name,
                    note: table.note,
                    x: index * 220,
                    y: 20,
                    fields: table.fields.map(field => {
                        const fieldId = window.crypto.randomUUID();
                        return {
                            id: fieldId,
                            increment: field.increment,
                            name: field.name,
                            not_null: field.not_null,
                            note: field.note,
                            pk: field.pk,
                            unique: field.unique,
                            type: field.type.type_name.toUpperCase(),
                        };
                    }),
                };
            });

            graph.refs.forEach(ref => {
                const id = window.crypto.randomUUID();
                linkDict[id] = {
                    id,
                    endpoints: ref.endpoints.map(endpoint => {
                        const table = Object.values(tableDict).find(
                            table => table.name == endpoint.tableName
                        );
                        return {
                            id: table.id,
                            relation: endpoint.relation,
                            fieldId: table.fields.find(
                                field => field.name == endpoint.fieldNames[0]
                            ).id,
                        };
                    }),
                };
            });
            const graphId = window.crypto.randomUUID();
            await save({
                id: graphId,
                name: graph.name,
                tableDict,
                linkDict,
                box: {
                    x: 0,
                    y: 0,
                    w: window.innerWidth,
                    h: window.innerHeight,
                    clientH: window.innerHeight,
                    clientW: window.innerWidth,
                },
            });

            // addGraph(graph);
            setValue('');
            setImportType('');
            window.location.href = `/graphs/detail?id=${graphId}`;
        } catch (e) {
            console.log(e);
            Notification.error({
                title: 'Parse failed',
            });
        }
    };

    return (
        <Modal
            title={null}
            simple
            visible={importType}
            autoFocus={false}
            onOk={() => {
                handleOk();
            }}
            okText="Import"
            cancelText="Close"
            onCancel={() => setImportType('')}
            style={{ width: 'auto' }}
        >
            <Input.TextArea
                value={value}
                placeholder={`Paste your ${importType} content here.`}
                style={{ height: '400px', width: '500px' }}
                onChange={e => setValue(e)}
            />
        </Modal>
    );
}
