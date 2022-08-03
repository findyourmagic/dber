import { Space } from '@arco-design/web-react';
import { Menu, Item, Separator, theme } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

export default function ContextMenu(props) {
    return (
        <Menu id={props.menuId} animation="fade" theme={props.theme === 'dark' ? theme.dark : theme.light}>
            <Item
                onClick={({ triggerEvent }) => {
                    props.addTable({ x: triggerEvent.clientX - 40, y: triggerEvent.clientY - 100 });
                }}
                style={{ justifyContent: 'center' }}
            >
                Add New Table
                <Space size={4}>
                    <div className="arco-home-key">⌘</div>
                    <div className="arco-home-key">N</div>
                </Space>
            </Item>
            <Item onClick={() => props.setImportType('MySQL')}>
                Import Table
                <Space size={4}>
                    <div className="arco-home-key">⌘</div>
                    <div className="arco-home-key">I</div>
                </Space>
            </Item>
            <Separator />
            <Item onClick={() => props.saveGraph()}>
                Save
                <Space size={4}>
                    <div className="arco-home-key">⌘</div>
                    <div className="arco-home-key">S</div>
                </Space>
            </Item>
            <Item onClick={() => props.handlerExport()}>
                Export Database
                <Space size={4}>
                    <div className="arco-home-key">⌘</div>
                    <div className="arco-home-key">E</div>
                </Space>
            </Item>
        </Menu>
    );
}
