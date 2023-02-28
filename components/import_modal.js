import { Modal, Notification, Tabs } from '@arco-design/web-react';
import { Parser } from '@dbml/core';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import Editor from '@monaco-editor/react';
import graphState from '../hooks/use-graph-state';
import tableModel from '../hooks/table-model';

const TabPane = Tabs.TabPane;

/**
 * It's a modal that allows you to import a graph from a string
 * @returns Modal component
 */
export default function ImportModal({ showModal, onCloseModal, cb = p => {} }) {
    const { theme, setTableDict, setLinkDict, tableList } = graphState.useContainer();
    const { calcXY } = tableModel();

    const [value, setValue] = useState('');
    const [importType, setImportType] = useState('dbml');

    const handleOk = async () => {
        if (!value) {
            onCloseModal();
            return;
        }
        try {
            const result = await Parser.parse(value, importType);
            const graph = result.schemas[0];
            const tableDict = {};
            const linkDict = {};
            const tables = [...tableList];
            graph.tables.forEach((table, index) => {
                const id = nanoid();
                const [x, y] = calcXY(0, tables);
                const newTable = {
                    id,
                    name: table.name,
                    note: table.note,
                    x,
                    y,
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
                tableDict[id] = newTable;
                tables.push(newTable);
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

            setTableDict(state => ({
                ...state,
                ...tableDict,
            }));
            setLinkDict(state => ({
                ...state,
                ...linkDict,
            }));

            setValue('');
            onCloseModal();
            cb({ tableDict, linkDict });
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
            visible={showModal === 'import'}
            autoFocus={false}
            onOk={() => handleOk()}
            okText="Import"
            cancelText="Close"
            onCancel={() => onCloseModal()}
            style={{ width: 'auto' }}
            unmountOnExit
        >
            <Tabs activeTab={importType} onChange={val => setImportType(val)}>
                <TabPane key="dbml" title="DBML" />
                <TabPane key="postgres" title="PostgreSQL" />
                <TabPane key="mysql" title="MySQL" />
                <TabPane key="mssql" title="MSSQL" />
            </Tabs>
            <Editor
                language={importType === 'dbml' ? 'apex' : 'sql'}
                width="680px"
                height="80vh"
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                options={{
                    minimap: { enabled: false },
                    scrollbar: {
                        // 滚动条设置
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
