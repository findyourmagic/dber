import { Modal, Notification, Tabs } from '@arco-design/web-react';
import Editor from '@monaco-editor/react';

const TabPane = Tabs.TabPane;

/**
 * It's a modal that displays the command to be exported
 * @returns Modal component
 */
export default function ExportModal({ command, handlerExport, exportType, theme }) {
    const copy = async () => {
        try {
            await window.navigator.clipboard.writeText(command);
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
    return (
        <Modal
            title={null}
            simple
            visible={command}
            autoFocus={false}
            onOk={() => copy()}
            okText="Copy"
            cancelText="Close"
            onCancel={() => handlerExport('')}
            style={{ width: 'auto' }}
        >
            <Tabs
                activeTab={exportType}
                onChange={val => handlerExport(val)}
            >
                <TabPane key="dbml" title="DBML" />
                <TabPane key="postgresql" title="PostgreSQL" />
                <TabPane key="mysql" title="MySQL" />
                <TabPane key="mssql" title="MSSQL" />
            </Tabs>
            <Editor
                value={command}
                language="sql"
                width="680px"
                height="80vh"
                theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollbar: { // 滚动条设置
                        verticalScrollbarSize: 6, // 竖滚动条
                        horizontalScrollbarSize: 6, // 横滚动条
                    },
                    lineNumbers: 'on', // 控制行号的出现on | off
                }}
            />
        </Modal>
    );
}
