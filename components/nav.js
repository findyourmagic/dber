import {
    Button,
    Space,
    Popconfirm,
    Dropdown,
    Menu,
    Notification,
    Input,
    Switch,
} from '@arco-design/web-react';
import { IconSunFill, IconMoonFill } from '@arco-design/web-react/icon';
import Link from 'next/link';
import exportSQL from '../utils/export-sql';
import { db } from '../data/db';

/**
 * It renders a nav bar with a title, a save button, a demo button, a clear button, an export button,
 * and a name input
 * @param props - the props passed to the component
 * @returns A Nav component that takes in a title, a save button, a demo button, a clear button, an export button
 */
export default function Nav(props) {
    const save = async () => {
        const id = new URLSearchParams(global.location.search).get('id');
        try {
            await db.graphs.put({
                id,
                tableDict: props.tableDict,
                linkDict: props.linkDict,
                box: props.box,
                name: props.name,
                updatedAt: new Date().valueOf(),
            });
            Notification.success({
                title: 'Save success',
            });
        } catch (e) {
            Notification.error({
                title: 'Save failed',
            });
        }
    };

    return (
        <nav className="nav">
            <div>
                <Link href="/graphs" passHref>
                    <a href="javascript:;">
                        <strong>DBER</strong> | Database design tool based on
                        entity relation diagram
                    </a>
                </Link>
            </div>
            <Space>
                <Input
                    type="text"
                    size="mini"
                    value={props.name}
                    onChange={value => {
                        props.setName(value);
                    }}
                />
                <Button
                    onClick={save}
                    type="primary"
                    status="success"
                    size="mini"
                >
                    Save
                </Button>
                <Button onClick={props.addTable} type="primary" size="mini">
                    + Add New Table
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
                    <Button type="outline" status="danger" size="mini">
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
                    <Button type="outline" size="mini">
                        Export SQL
                    </Button>
                </Dropdown>
                <Switch
                    type="round"
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
