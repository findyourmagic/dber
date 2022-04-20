import {
    Modal,
    Button,
    Input,
    Select,
    Space,
    Notification,
    Popconfirm,
} from '@arco-design/web-react';
import { useEffect, useState, useMemo } from 'react';

export default function LinkModal(props) {
    const { editingLink, setEditingLink, setLinkDict } = props;
    const changeRelation = relation => {
        const { linkId, fieldId } = editingLink;
        setLinkDict(state => {
            return {
                ...state,
                [linkId]: {
                    ...state[linkId],
                    endpoints: state[linkId].endpoints.map(endpoint => {
                        if (endpoint.fieldId == fieldId) {
                            return {
                                ...endpoint,
                                relation,
                            };
                        }
                        if (relation == '*' && endpoint.fieldId != fieldId) {
                            return {
                                ...endpoint,
                                relation: '1',
                            };
                        }
                        return endpoint;
                    }),
                },
            };
        });
        setEditingLink(null);
    };
    const removeLink = () => {
        const { linkId, fieldId } = editingLink;
        setLinkDict(state => {
            delete state[linkId];
            return { ...state };
        });
        setEditingLink(null);
    };
    return (
        <Modal
            title="Link"
            visible={editingLink}
            onCancel={() => setEditingLink(null)}
            footer={null}
            autoFocus={false}
            focusLock={false}
        >
            <Space
                style={{
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Space>
                    <label>Change relation:</label>
                    <Button
                        type="primary"
                        onClick={() => {
                            changeRelation('1');
                        }}
                    >
                        1
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            changeRelation('*');
                        }}
                    >
                        *
                    </Button>
                </Space>
                <Popconfirm
                    title="Are you sure to delete this path?"
                    onOk={() => {
                        removeLink();
                    }}
                >
                    <Button>Delete Path</Button>
                </Popconfirm>
            </Space>
        </Modal>
    );
}
