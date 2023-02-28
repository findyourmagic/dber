import { Dropdown, Menu, Space, Divider } from '@arco-design/web-react';


export default function ContextMenu(props) {
    const menus = [
        {
            key: 'N',
            title: 'Add New Table',
            action: e => props.addTable({ x: e.clientX - 40, y: e.clientY - 100 }),
        },
        {
            key: 'I',
            title: 'Import Table',
            action: () => props.setImportType('MySQL'),
        },
        {
            key: 'line',
        },
        {
            key: 'S',
            title: 'Save Change',
            action: () => props.saveGraph(),
        },
        {
            key: 'E',
            title: 'Export Database',
            action: () => props.handlerExport(),
        }
    ];

    return (
        <Dropdown
            trigger="contextMenu"
            position="bl"
            popupVisible={props.popupVisible}
            droplist={
                props.version !== 'currentVersion' ? null : (
                    <Menu className="context-menu">
                        {menus.map(item => item.key === 'line' ? (
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
                        ))}
                    </Menu>
                )
            }
        >
            {props.children}
        </Dropdown>
    );
}
