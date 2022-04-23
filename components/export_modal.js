import { Modal, Notification } from '@arco-design/web-react';

export function ExportModal({ command, setCommand }) {
    const copy = async () => {
        try {
            await window.navigator.clipboard.writeText(command);
            Notification.success({
                title: '复制成功',
            });
        } catch (e) {
            console.log(e);
            Notification.error({
                title: '复制出错，请手动复制',
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
            okText="复制"
            onCancel={() => setCommand('')}
            style={{ width: 'auto' }}
        >
            <pre>{`${command}`}</pre>
        </Modal>
    );
}
