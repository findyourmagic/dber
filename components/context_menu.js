import { Dropdown, Menu, Space, Divider } from '@arco-design/web-react';
import graphState from '../hooks/use-graph-state';
import tableModel from '../hooks/table-model';

export default function ContextMenu({ setShowModal, children }) {
    const { version } = graphState.useContainer();
    const { updateGraph, addTable } = tableModel();

    const menus = [
        {
            key: 'N',
            title: 'Add New Table',
            action: () => addTable(),
        },
        {
            key: 'I',
            title: 'Import Table',
            action: () => setShowModal('import'),
        },
        {
            key: 'line',
        },
        {
            key: 'S',
            title: 'Save Change',
            action: () => updateGraph(),
        },
        {
            key: 'E',
            title: 'Export Database',
            action: () => setShowModal('export'),
        },
    ];

    return (
        <Dropdown
            trigger="contextMenu"
            position="bl"
            droplist={
                version !== 'currentVersion' ? null : (
                    <Menu className="context-menu">
                        {menus.map(item =>
                            item.key === 'line' ? (
                                <Divider key={item.key} className="context-menu-line" />
                            ) : (
                                <Menu.Item
                                    key={item.key}
                                    className="context-menu-item"
                                    onClick={item.action}
                                >
                                    {item.title}
                                    <Space size={4}>
                                        <div className="arco-home-key">⌘</div>
                                        <div className="arco-home-key">{item.key}</div>
                                    </Space>
                                </Menu.Item>
                            )
                        )}
                    </Menu>
                )
            }
        >
            {children}
        </Dropdown>
    );
}
