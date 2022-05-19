import {
    Button,
    Space,
    Popconfirm,
    Dropdown,
    Menu,
} from '@arco-design/web-react';

import exportSQL from '../utils/export-sql';
import styles from '../styles/index.module.css';

export default function Nav(props) {
    return (
        <nav className={styles.nav}>
            <div>
                <a>
                    <strong>DBER</strong> | Database design tool based on entity
                    relation diagram
                </a>
            </div>
            <Space>
                <Button
                    onClick={props.addTable}
                    type="primary"
                    shape="round"
                    size="mini"
                >
                    + Add New Table
                </Button>
                <Popconfirm
                    title="Are you sure you want to reset?"
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
                        Reset
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
                                        tableDict,
                                        linkDict,
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
