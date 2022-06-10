import { Modal, Notification } from '@arco-design/web-react';

/**
 * It's a modal that displays the command to be exported
 * @returns Modal component
 */

export function ExportModal({ command, setCommand }) {
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
            <pre>{`${command}`}</pre>
        </Modal>
    );
}
