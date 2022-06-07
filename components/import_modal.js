import { Modal, Notification, Input } from '@arco-design/web-react';
import { Parser } from '@dbml/core';
import { useState } from 'react';

export function ImportModal({ importType, setImportType, addGraph }) {
    const [value, setValue] = useState('');

    const handleOk = async () => {
        if (!value) return;
        try {
            const graph = await Parser.parse(value, importType.toLowerCase());
            console.log(graph);
            const tableDict = {};
            const linkDict = {};
            graph.tables.forEach(table => {
                const id = window.crypto.randomUUID();
                tableDict[id] = {
                    ...table,
                    id,
                    fields: table.fields.map(field => {
                        const fieldId = window.crypto.randomUUID();
                        return {
                            ...field,
                            id: fieldId,
                            type: field.type.type_name
                        }
                    })
                }
            })

            graph.refs.forEach(ref => {
                const id = window.crypto.randomUUID();
                linkDict[id] = {
                    ...ref,
                    id,
                    endpoints: ref.endpoints.map(endpoint => {
                        const table = Object.values(tableDict).find(table=> table.name == endpoint.tableName);
                        return {
                            id: table.id,
                            fieldId: table.fields.find(field => field.name == endpoint.fieldNames[0]).id
                        }
                    })
                }
            });

            console.log(tableDict);
            console.log(linkDict);
            // addGraph(graph);
            setValue('');
            setImportType('');
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
                placeholder={`Paste your ${importType} content here.`}
                style={{ height: '400px', width: '500px' }}
                onChange={e => setValue(e)}
            />
        </Modal>
    );
}
