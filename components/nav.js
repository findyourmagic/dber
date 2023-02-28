import { Button, Space, Popconfirm, Input, Switch, Dropdown, Menu } from '@arco-design/web-react';
import { IconSunFill, IconMoonFill, IconLeft } from '@arco-design/web-react/icon';
import Link from 'next/link';
import graphState from '../hooks/use-graph-state';
import tableModel from '../hooks/table-model';

/**
 * It renders a nav bar with a title, a save button, a demo button, a clear button, an export button,
 * and a name input
 * @param props - the props passed to the component
 * @returns A Nav component that takes in a title, a save button, a demo button, a clear button, an export button
 */
export default function Nav({ setShowModal, setShowDrawer }) {
    const { name, setName, theme, setTheme, setTableDict, setLinkDict, version } =
        graphState.useContainer();
    const { updateGraph, addTable, applyVersion } = tableModel();

    if (version !== 'currentVersion') {
        return (
            <nav className="nav">
                <div className="nav-title">Logs Record: {name}</div>
                <Space>
                    <Button
                        onClick={() => updateGraph()}
                        type="primary"
                        status="success"
                        shape="round"
                        style={{ marginLeft: 8 }}
                    >
                        Apply Select Version
                    </Button>
                    <Button
                        onClick={() => applyVersion('currentVersion')}
                        shape="round"
                        style={{ marginLeft: 8 }}
                    >
                        Exit Logs View
                    </Button>
                </Space>
            </nav>
        );
    }

    return (
        <nav className="nav">
            <Space>
                <Link href="/graphs" passHref>
                    <IconLeft style={{ fontSize: 20 }} />
                </Link>
                <Input
                    type="text"
                    value={name}
                    onChange={value => setName(value)}
                    style={{ width: '240px' }}
                />
            </Space>

            <Space>
                <Button
                    size="small"
                    type="primary"
                    status="success"
                    shape="round"
                    onClick={() => updateGraph()}
                >
                    Save
                </Button>
                <Dropdown
                    position="bottom"
                    droplist={
                        <Menu>
                            <Menu.Item
                                key="add"
                                className="context-menu-item"
                                onClick={() => addTable()}
                            >
                                Add Table
                            </Menu.Item>
                            <Menu.Item
                                key="import"
                                className="context-menu-item"
                                onClick={() => setShowModal('import')}
                            >
                                Import Table
                            </Menu.Item>
                        </Menu>
                    }
                >
                    <Button size="small" type="primary" shape="round">
                        + New Table
                    </Button>
                </Dropdown>
                <Popconfirm
                    title="Are you sure you want to delete all the tables?"
                    okText="Yes"
                    cancelText="No"
                    position="br"
                    onOk={() => {
                        setTableDict({});
                        setLinkDict({});
                    }}
                >
                    <Button size="small" type="outline" status="danger" shape="round">
                        Clear
                    </Button>
                </Popconfirm>
                <Button
                    size="small"
                    type="outline"
                    shape="round"
                    onClick={() => setShowModal('export')}
                >
                    Export
                </Button>
                <Button
                    size="small"
                    type="secondary"
                    shape="round"
                    onClick={() => setShowDrawer('logs')}
                >
                    Logs
                </Button>
                <Switch
                    checkedIcon={<IconMoonFill />}
                    uncheckedIcon={<IconSunFill />}
                    checked={theme === 'dark'}
                    onChange={e => setTheme(e ? 'dark' : 'light')}
                />
            </Space>
        </nav>
    );
}
