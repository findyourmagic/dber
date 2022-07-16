import { Space, Button, Dropdown, Menu } from '@arco-design/web-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const ImportModal = dynamic(() => import('./import_modal'), { ssr: false });

/**
 * It renders a nav bar with a link to the home page, a button to add a new graph, and a dropdown menu
 * with a list of import options
 * @param props - the props passed to the component
 * @returns List Nav component
 */
export default function ListNav(props) {
    const [importType, setImportType] = useState('');

    return (
        <div className="nav">
            <div>
                <Link href="/" passHref>
                    <a href="javascript:;">
                        <strong>DBER</strong> | Database design tool based on
                        entity relation diagram
                    </a>
                </Link>
            </div>
            <Space>
                <Dropdown
                    droplist={
                        <Menu>
                            <Menu.Item
                                onClick={() => {
                                    setImportType('DBML');
                                }}
                            >
                                DBML
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setImportType('PostgreSQL');
                                }}
                            >
                                PostgreSQL
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setImportType('MySQL');
                                }}
                            >
                                MySQL
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setImportType('MSSQL');
                                }}
                            >
                                MSSQL
                            </Menu.Item>
                        </Menu>
                    }
                    position="br"
                >
                    <Button type="outline" shape="round" size="mini">
                        import
                    </Button>
                </Dropdown>
                <Button
                    type="primary"
                    shape="round"
                    size="mini"
                    onClick={() => {
                        props.addGraph();
                    }}
                >
                    + New graph
                </Button>
            </Space>
            <ImportModal
                addGraph={props.addGraph}
                importType={importType}
                setImportType={setImportType}
            ></ImportModal>
        </div>
    );
}
