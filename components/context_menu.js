import { Menu, Item, Separator, Submenu, theme } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

export default function ContextMenu(props) {
    return (
        <Menu id={props.menuId} animation="fade" theme={props.theme === 'dark' ? theme.dark : theme.light}>
            <Item
                onClick={({ triggerEvent }) => {
                    props.addTable({ x: triggerEvent.clientX - 40, y: triggerEvent.clientY - 100 });
                }}
            >
                Add New Table
            </Item>
            <Submenu label="Import">
                <Item onClick={() => props.setImportType('DBML')}>
                    DBML
                </Item>
                <Item onClick={() => props.setImportType('PostgreSQL')}>
                    PostgreSQL
                </Item>
                <Item onClick={() => props.setImportType('MySQL')}>
                    MySQL
                </Item>
                <Item onClick={() => props.setImportType('MSSQL')}>
                    MSSQL
                </Item>
            </Submenu>
            <Separator />
            <Item onClick={() => props.saveGraph()}>Save</Item>
            <Submenu label="Export">
                <Item onClick={() => props.setCommand('dbml')}>
                    DBML
                </Item>
                <Item onClick={() => props.setCommand('')}>
                    PostgreSQL
                </Item>
                <Item onClick={() => props.setCommand('mysql')}>
                    MySQL
                </Item>
                <Item onClick={() => props.setCommand('mssql')}>
                    MSSQL
                </Item>
            </Submenu>
        </Menu>
    );
}
