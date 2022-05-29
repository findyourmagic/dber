import {
    Button,
    Space,
    Popconfirm,
    Dropdown,
    Menu,
    Notification,
    Input,
} from '@arco-design/web-react';
import Link from 'next/link';
import exportSQL from '../utils/export-sql';
import { db } from '../data/db';

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
                    <span>
                        <strong>DBER</strong> | Database design tool based on
                        entity relation diagram
                    </span>
                </Link>
            </div>
            <Space>
                <Input
                    type="text"
                    value={props.name}
                    onChange={value => {
                        props.setName(value);
                    }}
                />
                <Button
                    onClick={save}
                    type="primary"
                    status="success"
                    shape="round"
                    size="mini"
                >
                    Save
                </Button>
                <Button
                    onClick={props.addTable}
                    type="primary"
                    shape="round"
                    size="mini"
                >
                    + Add New Table
                </Button>
                <Popconfirm
                    title="Are you sure to fill the playground with demo data?"
                    okText="Yes"
                    cancelText="No"
                    position="br"
                    onOk={() => {
                        props.setTableDict(props.defaultTables);
                        props.setLinkDict(props.defaultLinks);
                    }}
                >
                    <Button
                        type="outline"
                        shape="round"
                        size="mini"
                        status="danger"
                    >
                        Demo graph
                    </Button>
                </Popconfirm>
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
                    <Button
                        type="outline"
                        shape="round"
                        size="mini"
                        status="danger"
                    >
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
                        </Menu>
                    }
                    position="br"
                >
                    <Button type="outline" shape="round" size="mini">
                        Export SQL
                    </Button>
                </Dropdown>
            </Space>
        </nav>
    );
}
