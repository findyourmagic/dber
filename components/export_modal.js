import { Modal, Notification } from '@arco-design/web-react';
import Editor from '@monaco-editor/react';

/**
 * It's a modal that displays the command to be exported
 * @returns Modal component
 */
export default function ExportModal({ command, setCommand, theme }) {
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
            onCancel={() => setCommand('')}
            style={{ width: 'auto' }}
        >
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
