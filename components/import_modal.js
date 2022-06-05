import { Modal, Notification, Input } from '@arco-design/web-react';

export function ImportModal({ importType, setImportType, addGraph }) {
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
            visible={importType}
            autoFocus={false}
            onOk={() => {}}
            okText="Import"
            cancelText="Close"
            onCancel={() => setImportType('')}
            style={{ width: 'auto' }}
        >
            <Input.TextArea
                placeholder={`Paste your ${importType} content here.`}
                style={{ height: '400px', width: '500px' }}
            />
        </Modal>
    );
}
