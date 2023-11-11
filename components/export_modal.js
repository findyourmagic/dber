import { useState, useEffect } from 'react';
import { Modal, Notification, Tabs } from '@arco-design/web-react';
import Editor from '@monaco-editor/react';

import graphState from '@/hooks/use-graph-state';
import exportSQL from '@/utils/export-sql';

const TabPane = Tabs.TabPane;

/**
 * It's a modal that displays the command to be exported
 * @returns Modal component
 */
export default function ExportModal({ showModal, onCloseModal }) {
    const [exportType, setExportType] = useState('dbml');
    const [sqlValue, setSqlValue] = useState('');
    const { tableDict, linkDict, theme } = graphState.useContainer();

    const copy = async () => {
        try {
            await window.navigator.clipboard.writeText(sqlValue);
            Notification.success({
                title: 'Copy Success',
            });
        } catch (e) {
            console.log(e);
            Notification.error({
                title: 'Copy Failed',
            });
        }
    };

    useEffect(() => {
        if (showModal === 'export') {
            const sql = exportSQL(tableDict, linkDict, exportType);
            setSqlValue(sql);
        }
    }, [showModal, exportType]);

    return (
        <Modal
            title={null}
            simple
            visible={showModal === 'export'}
            autoFocus={false}
            onOk={() => copy()}
            okText="Copy"
            cancelText="Close"
            onCancel={() => onCloseModal()}
            style={{ width: 'auto' }}
        >
            <Tabs activeTab={exportType} onChange={val => setExportType(val)}>
                <TabPane key="dbml" title="DBML" />
                <TabPane key="postgres" title="PostgreSQL" />
                <TabPane key="mysql" title="MySQL" />
                <TabPane key="mssql" title="MSSQL" />
            </Tabs>
            <Editor
                value={sqlValue}
                language={exportType === 'dbml' ? 'apex' : 'sql'}
                width="680px"
                height="80vh"
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollbar: {
                        // 滚动条设置
                        verticalScrollbarSize: 6, // 竖滚动条
                        horizontalScrollbarSize: 6, // 横滚动条
                    },
                    lineNumbers: 'on', // 控制行号的出现on | off
                }}
            />
        </Modal>
    );
}
