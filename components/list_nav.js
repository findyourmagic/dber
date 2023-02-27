import { Space, Button, Dropdown, Menu, Switch } from '@arco-design/web-react';
import { IconSunFill, IconMoonFill } from '@arco-design/web-react/icon';
import Link from 'next/link';

/**
 * It renders a nav bar with a link to the home page, a button to add a new graph, and a dropdown menu
 * with a list of import options
 * @param props - the props passed to the component
 * @returns List Nav component
 */
export default function ListNav(props) {
    const { setImportType } = props;

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
                            {['DBML', 'PostgreSQL', 'MySQL', 'MSSQL'].map(item => (
                                <Menu.Item
                                    key={item}
                                    onClick={() => {
                                        setImportType(item);
                                    }}
                                >
                                    {item}
                                </Menu.Item>
                            ))}
                        </Menu>
                    }
                    position="br"
                >
                    <Button type="outline" shape="round">
                        import
                    </Button>
                </Dropdown>
                <Button
                    type="primary"
                    shape="round"
                    onClick={() => {
                        props.addGraph();
                    }}
                >
                    + New graph
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
        </div>
    );
}
