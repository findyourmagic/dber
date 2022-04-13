import {
    Modal,
    Button,
    Input,
    Select,
    Space,
    Notification,
} from '@arco-design/web-react';
import { useEffect, useState, useMemo } from 'react';

export default function LinkModal(props) {
    const { editingLink, setEditingLink } = props;
    return (
        <Modal
            title="Link"
            visible={editingLink}
            onCancel={() => setEditingLink(null)}
            footer={null}
            autoFocus={false}
            focusLock={false}
        >
            <Space direction="vertical">
                <Button long>1:1</Button>
                <Button long>1:N</Button>
                <Button long>N:1</Button>
                <Button long>Delete Path</Button>
            </Space>
        </Modal>
    );
}
