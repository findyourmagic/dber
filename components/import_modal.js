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
