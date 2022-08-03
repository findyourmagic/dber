import { Modal, Notification } from '@arco-design/web-react';
import { Parser } from '@dbml/core';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import Editor from '@monaco-editor/react';


/**
 * It's a modal that allows you to import a graph from a string
 * @returns Modal component
 */
export default function ImportModal({ importType, setImportType, theme, handlerImportTable }) {
    const [value, setValue] = useState('');

    const handleOk = async () => {
        if (!value) {
            setImportType('');
            return;
        }
        try {
            const result = await Parser.parse(value, importType.toLowerCase());
            const graph = result.schemas[0];
            const tableDict = {};
            const linkDict = {};
            graph.tables.forEach((table, index) => {
                const id = nanoid();
                tableDict[id] = {
                    id,
                    name: table.name,
                    note: table.note,
                    x: index * 260 + 60,
                    y: 120,
                    fields: table.fields.map(field => {
                        const fieldId = nanoid();
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
                const id = nanoid();
                linkDict[id] = {
                    id,
                    endpoints: ref.endpoints.map(endpoint => {
                        const table = Object.values(tableDict).find(
                            table => table.name === endpoint.tableName
                        );
                        return {
                            id: table.id,
                            relation: endpoint.relation,
                            fieldId: table.fields.find(
                                field => field.name === endpoint.fieldNames[0]
                            ).id,
                        };
                    }),
                };
            });

            handlerImportTable({ tableDict, linkDict });
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
            unmountOnExit
        >
            <Editor
                language={importType === 'DBML' ? 'apex' : 'sql'}
                width="680px"
                height="80vh"
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                options={{
                    minimap: { enabled: false },
                    scrollbar: { // 滚动条设置
                        verticalScrollbarSize: 6, // 竖滚动条
                        horizontalScrollbarSize: 6, // 横滚动条
                    },
                    lineNumbers: 'off', // 控制行号的出现on | off
                }}
                onChange={setValue}
            />
        </Modal>
    );
}
