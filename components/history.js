import { Button, Drawer, Notification, Popconfirm, Space } from '@arco-design/web-react';

import { db } from '../data/db';

export default function HistoryDrawer(props) {
    const { history, setHistory, version, handlerVersion } = props;

    const deleteHistory = (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        db.logs.delete(id);
        props.handlerHistory();
        Notification.success({
            title: 'Delete history record success',
        });
    };

    return (
        <Drawer
            width={320}
            title="History Record"
            visible={history !== undefined}
            autoFocus={false}
            footer={null}
            mask={false}
            onCancel={() => {
                setHistory(undefined);
                handlerVersion('currentVersion');
            }}
            style={{ boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)' }}
        >
            <Space
                align="start"
                className={`custom-radio-card ${version === 'currentVersion' ? 'custom-radio-card-checked' : ''}`}
                onClick={() => handlerVersion('currentVersion')}
            >
                <div className="custom-radio-card-dot"></div>
                <div>
                    <div className="custom-radio-card-title">
                        Current Version
                    </div>
                </div>
            </Space>

            {history ? history.map(item => (
                <Space
                    key={item.updatedAt}
                    align="start"
                    className={`custom-radio-card ${version === item.updatedAt ? 'custom-radio-card-checked' : ''}`}
                    onClick={() => handlerVersion(item)}
                >
                    <div className="custom-radio-card-dot"></div>
                    <div>
                        <div className="custom-radio-card-title">
                            Version {item.id}
                        </div>
                        <div className="custom-radio-card-secondary">
                            Auto save at {new Date(item.updatedAt).toLocaleString()}
                        </div>
                    </div>
                    <Popconfirm
                        position="tr"
                        title="Are you sure you want to delete this history record?"
                        okText="Yes"
                        cancelText="No"
                        onOk={e => {
                            deleteHistory(e, item.id);
                        }}
                        onCancel={e => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <a
                            className="delete-btn"
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            [DELETE]
                        </a>
                    </Popconfirm>
                </Space>
            )) : null}
        </Drawer>
    );
};
