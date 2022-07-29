import {
    Button,
    Space,
    Popconfirm,
    Dropdown,
    Menu,
    Input,
    Switch,
} from '@arco-design/web-react';
import { IconSunFill, IconMoonFill, IconLeft } from '@arco-design/web-react/icon';
import Link from 'next/link';
import exportSQL from '../utils/export-sql';

/**
 * It renders a nav bar with a title, a save button, a demo button, a clear button, an export button,
 * and a name input
 * @param props - the props passed to the component
 * @returns A Nav component that takes in a title, a save button, a demo button, a clear button, an export button
 */
export default function Nav(props) {
    if (!props.editable) {
        return (
            <nav className="nav">
                <Space>
                    <div className="nav-title">
                        History Record: {props.name}
                    </div>
                    <Button
                        onClick={props.applyHistory}
                        type="primary"
                        status="success"
                        shape="round"
                        style={{ marginLeft: 8 }}
                    >
                        Apply
                    </Button>
                </Space>
            </nav>
        );
    }

    return (
        <nav className="nav">
            <Space>
                <Link href="/graphs" passHref>
                    <a href="javascript:;">
                        <IconLeft style={{ fontSize: 20 }} />
                    </a>
                </Link>
                <Input
                    type="text"
                    value={props.name}
                    onChange={value => {
                        props.setName(value);
                    }}
                />
            </Space>

            <Space>
                <Button
                    onClick={() => props.saveGraph()}
                    type="primary"
                    status="success"
                    shape="round"
                >
                    Save
                </Button>
                <Button onClick={props.addTable} type="primary" shape="round">
                    + New Table
                </Button>
                <Popconfirm
                    title="Are you sure you want to delete all the tables?"
                    okText="Yes"
                    cancelText="No"
                    position="br"
                    onOk={() => {
                        props.setTableDict({});
                        props.setLinkDict({});
                    }}
                >
                    <Button type="outline" status="danger" shape="round">
                        Clear
                    </Button>
                </Popconfirm>
                <Dropdown
                    droplist={
                        <Menu>
                            <Menu.Item
                                onClick={() => {
                                    const sql = exportSQL(
                                        props.tableDict,
                                        props.linkDict
                                    );
                                    props.setCommand(sql);
                                }}
                            >
                                PostgreSQL
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    const sql = exportSQL(
                                        props.tableDict,
                                        props.linkDict,
                                        'mysql'
                                    );
                                    props.setCommand(sql);
                                }}
                            >
                                MySQL
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    const sql = exportSQL(
                                        props.tableDict,
                                        props.linkDict,
                                        'mssql'
                                    );
                                    props.setCommand(sql);
                                }}
                            >
                                MSSQL
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    const sql = exportSQL(
                                        props.tableDict,
                                        props.linkDict,
                                        'dbml'
                                    );
                                    props.setCommand(sql);
                                }}
                            >
                                DBML
                            </Menu.Item>
                        </Menu>
                    }
                    position="br"
                >
                    <Button type="outline" shape="round">
                        Export SQL
                    </Button>
                </Dropdown>
                <Button
                    onClick={props.handlerHistory}
                    type="secondary"
                    shape="round"
                >
                    History
                </Button>
                <Switch
                    checkedIcon={<IconMoonFill />}
                    uncheckedIcon={<IconSunFill />}
                    checked={props.theme === 'dark'}
                    onChange={(e) => {
                        props.setTheme(e ? 'dark' : 'light');
                    }}
                />
            </Space>
        </nav>
    );
}
