import { useState } from 'react';
import { Button, Popover, Space, Tag, Popconfirm, Input } from '@arco-design/web-react';
import { IconEdit, IconDelete, IconMessage, IconPlus, IconMinus, IconPalette } from '@arco-design/web-react/icon';

import themes from '../data/theme';

/**
 * It renders a table with a title, a list of fields, and a button to edit the table
 * @param props - {
 *            table,
 *            TableWidth,
 *            tableMouseDownHandler,
 *            handlerEditingTable,
 *            gripMouseDownHandler,
 *        }
 * @returns A table component with a title and a list of fields.
 */
export default function Table(props) {
    const {
        table,
        TableWidth,
        tableMouseDownHandler,
        handlerEditingTable,
        gripMouseDownHandler,
        handlerEditingField,
        handlerAddField,
        handlerRemoveField,
    } = props;

    const handlerContextMenu = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const RenderTableTips = ({ field }) => (
        <div className="table-tips">
            <div className="head">
                <span className="field-name">{field.name}</span>
                <span className="field-type">{field.type}</span>
            </div>
            <div className="content">
                <Space wrap size={4}>
                    {field.pk && <Tag size="small" color="gold">PRIMARY</Tag>}
                    {field.unique && <Tag size="small" color="green">UNIQUE</Tag>}
                    {field.not_null && <Tag size="small" color="magenta">NOT NULL</Tag>}
                    {field.increment && <Tag size="small" color="lime">INCREMENT</Tag>}
                </Space>

                <div className="field-item dbdefault"><span>DEFAULT:</span>{field.dbdefault}</div>
                <div className="field-item note"><span>COMMENT:</span>{field.note}</div>
            </div>
        </div>
    )

    const [note, setNote] = useState(table.note);

    const height = table.fields.length * 32 + 52 + 24;
    return (
        <foreignObject
            x={table.x}
            y={table.y}
            width={TableWidth}
            height={height}
            key={table.id}
            onMouseDown={e => {
                tableMouseDownHandler(e, table);
            }}
            // onMouseUp={(e) => {
            //     tableMouseUpHandler(e, table);
            // }}
            onContextMenu={handlerContextMenu}
        >
            <div className="table" style={{ borderColor: table.theme }}>
                <div className="table-title" style={{ background: table.theme }}>
                    <span>
                        {table.name}
                    </span>

                    <Space size={4}>
                        <Button
                            size="mini"
                            onClick={() => {
                                handlerEditingTable(table);
                            }}
                            icon={<IconEdit />}
                        />
                        <Popconfirm
                            icon={null}
                            position="tr"
                            style={{ width: 480 }}
                            title={
                                <Space>
                                    <label>Comment:</label>
                                    <Input
                                        style={{ width: 240 }}
                                        defaultValue={table.note}
                                        allowClear
                                        placeholder="Please Enter Comment"
                                        onChange={value => {
                                            setNote(value);
                                        }}
                                    />
                                </Space>
                            }
                            okText="Commit"
                            cancelText="Cancel"
                            onOk={() => {
                                props.updateTable({ ...props.table, note });
                            }}
                            onCancel={() => {
                                setNote(props.table.note);
                            }}
                        >
                            <Button
                                size="mini"
                                icon={<IconMessage />}
                            />
                        </Popconfirm>
                        <Popover
                            position="tr"
                            title={
                                <>
                                    Theme

                                    <Button
                                        size="mini"
                                        style={{ float: 'right', fontSize: '12px' }}
                                        onClick={() => props.updateTable({ ...props.table, theme: undefined })}
                                    >
                                        Clear
                                    </Button>
                                </>
                            }
                            content={
                                <Space warp direction="vertical" size="medium" style={{ margin: '8px 0 4px' }}>
                                    {themes.map(list => (
                                        <Space size="medium" key={list.toString()}>
                                            {list.map(item => (
                                                <Button
                                                    key={item}
                                                    shape="circle"
                                                    style={{ background: item }}
                                                    onClick={() => props.updateTable({ ...props.table, theme: item })}
                                                />
                                            ))}
                                        </Space>
                                    ))}
                                </Space>
                            }
                            trigger="click"
                        >
                            <Button
                                size="mini"
                                icon={<IconPalette />}
                            />
                        </Popover>
                        <Popconfirm
                            position="tr"
                            title="Are you sure you want to delete this table?"
                            okText="Yes"
                            cancelText="No"
                            onOk={() => {
                                props.removeTable(table.id);
                            }}
                        >
                            <Button
                                status='danger'
                                size="mini"
                                icon={<IconDelete />}
                            />
                        </Popconfirm>
                    </Space>
                </div>
                <div className={`table-comment ${note ? '' : 'no-comment'}`}>
                    {table.note || 'No Comment'}
                </div>
                {table.fields &&
                    table.fields.map((field, index) => (
                        <Popover key={field.id} position="rt" content={<RenderTableTips field={field} />}>
                            <div
                                className="row"
                                key={field.id}
                                tableid={table.id}
                                fieldid={field.id}
                            >
                                <div
                                    className="start-grip grip"
                                    onMouseDown={gripMouseDownHandler}
                                ></div>
                                <div className="field-content">
                                    <div>
                                        {field.name}
                                        {field.pk && (
                                            <img style={{ width: 10, height: 10, marginLeft: 4 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB30lEQVR4AYySg44eURxHm75MbdvmCzQso0a1bdsKatu2MTNre3fMT6c3t1gjyS+6Oef+1QpoMgVXR+4X4W/2131vEZwIs2UakjQPe5+JKo4Ttx8DKSnJuTD8aJOCmnBYso2o8tS/3wHIOdWPt/v6PWlCIMuWcFC4nLBsr8hDpOTicFIJnayD3aWkUYEoWcIyRaukJG49xEnfgpc1jmT4jPSdXWm8guCXqGATQlBDtBpbGYP5ua9o7zLK0nYNwq1F9pe/nCuAlVjfBuFlTMPPmYOjTsX41JO4sQ5lRTvur++p1d/39VGUv5pPTL8ofusn4Eni9xnYnwdivOsuYXVVBx5s7PUTwdUUiOFYxK0H+IVLML+3xfvZBz93DQXnBpNwToqyz6Gu7sCTLb2+/ONqXhpR+QUcbTLGuw44yiCCvM2839xdv7umR6ayrB3auo482977Q82W//5sipKv4moj0N+2xVWHEeRv4sOW7lXXN/Y909CgawrsmPEA61s/9Fdt8TMnC3gd77d0129t6XekUbhmBXH3NZYyAi9jLF7eat5u7Gbe2dbvYHOwFORdHP4pqHiJn7eCoPgE7zZ3N+7v7L+rJfDvgQ04Ndeu+uI0s6dnJhi/Bvn50FTrdpAEsRgA3aj/RFymC/IAAAAASUVORK5CYII=" />
                                        )}
                                        {(field.unique || field.index) && (
                                            <img style={{ width: 10, height: 10, marginLeft: 4 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAA7UlEQVR4AW2Qg26GURQEb/rWtW3bts2otm27jdpouv39YTeeuTjH2FNdUo1a4gBB/KVaFQt+Zp9bkFJe5Yo3OKBahUJSZ60CX8KLbHMhoZIfsq1Kta5eVJel3LDIEA+kYxHeWBPwSn20ckkMQRxWXTLEEh1MMMsgzWwSS9Rh4Hs1jHJKJ0PM0U6jcDzRu4HLf7lmgUYJi5RzzLlw3EbI5o51aT3drJDwHnEaSyIJKyGnz+ijll7hxLfIRvt6vq9op4ZhlnU6ptK5Xh7oYZBF4j5jy4wzFWv6HrskfMTnG7dkRWbcJb8kvqWkGtf8ARG87I1KSSe4AAAAAElFTkSuQmCC" />
                                        )}
                                    </div>
                                    <div className="field-type">{field.type}</div>
                                </div>
                                <div className="grip-setting">
                                    <Button
                                        type="secondary"
                                        className="grip-setting-btn"
                                        size="mini"
                                        icon={<IconEdit />}
                                        onClick={() => {
                                            handlerEditingField({ field, table });
                                        }}
                                    />
                                    <Button
                                        status="success"
                                        className="grip-setting-btn"
                                        size="mini"
                                        icon={<IconPlus />}
                                        onClick={() => {
                                            handlerAddField(table, index);
                                        }}
                                    />
                                    <Button
                                        status='danger'
                                        className="grip-setting-btn"
                                        size="mini"
                                        icon={<IconMinus />}
                                        onClick={() => {
                                            handlerRemoveField(table, index);
                                        }}
                                    />
                                </div>
                            </div>
                        </Popover>
                    ))}
            </div>
        </foreignObject>
    );
}
