import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button, Input, Menu, Tooltip } from '@arco-design/web-react';
import {
    IconToLeft,
    IconToRight,
    IconSortAscending,
    IconSortDescending,
    IconFilter,
} from '@arco-design/web-react/icon';
import graphState from '../hooks/use-graph-state';

export default function TableNav({ onTableSelected, tableSelectedId, setTableSelectId }) {
    const [collapsed, setCollapsed] = useState(false);
    const [tableList, setTableList] = useState([]);
    const [order, setOrder] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const { tableList: tables } = graphState.useContainer();

    useEffect(() => {
        setTableList(tables);
        return () => setTableList([]);
    }, [tables]);

    const handlerSort = () => {
        if (!Array.isArray(tables) && !tables.length) return;

        const newList = tables.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return order;
            }
            if (nameA > nameB) {
                return -order;
            }

            // names must be equal
            return 0;
        });
        setTableList(newList);
        setOrder(val => -val);
    };

    const handlerFilter = e => {
        const { value } = e.target;
        if (!value) {
            setTableList(tables);
            return;
        }
        const newList = tableList.filter(
            item => item.name.toUpperCase().indexOf(value.toUpperCase()) > -1
        );
        setTableList(newList);
        setFilterValue(value);
    };

    useHotkeys('ctrl+., meta+.', () => setCollapsed(val => !val), { preventDefault: true }, [
        tables,
    ]);

    return (
        <div className="left-table-nav">
            <div className="table-nav-title">
                <div>
                    Tables
                    <span className="table-nav-count">({tableList.length})</span>
                </div>
                <div>
                    <Button
                        size="mini"
                        icon={!collapsed ? <IconToLeft /> : <IconToRight />}
                        onClick={() => setCollapsed(val => !val)}
                    />
                    <Button
                        size="mini"
                        icon={order === 1 ? <IconSortAscending /> : <IconSortDescending />}
                        onClick={() => handlerSort()}
                    />
                    <Button
                        size="mini"
                        className={filterValue ? 'table-filter' : ''}
                        icon={<IconFilter />}
                        onClick={() => setShowFilter(val => !val)}
                    />
                </div>
            </div>

            {!collapsed && tableList.length ? (
                <div className="table-nav-content">
                    {showFilter && (
                        <div className="table-nav-search">
                            <Input
                                style={{ width: 180 }}
                                allowClear
                                defaultValue={filterValue}
                                placeholder="input table name"
                                onPressEnter={e => handlerFilter(e)}
                                onClear={() => {
                                    setTableList(tables);
                                    setFilterValue('');
                                }}
                                // onChange={val => setFilterValue(val)}
                            />
                        </div>
                    )}
                    <Menu
                        className="table-nav-menu"
                        autoScrollIntoView
                        selectedKeys={[tableSelectedId]}
                    >
                        {tableList.map(table => (
                            <Menu.Item
                                key={table.id}
                                onClick={() => onTableSelected(table)}
                                onMouseOver={() => setTableSelectId(table.id)}
                            >
                                <Tooltip position="right" content={table.note || ''}>
                                    <div>
                                        {table.name}
                                        <span className="table-nav-count">
                                            ({table.fields.length})
                                        </span>
                                    </div>
                                </Tooltip>
                            </Menu.Item>
                        ))}
                    </Menu>
                </div>
            ) : null}
        </div>
    );
}
