import { Button, Popover, Space, Tag } from '@arco-design/web-react';
import { IconEdit } from '@arco-design/web-react/icon';

/**
 * It renders a table with a title, a list of fields, and a button to edit the table
 * @param props - {
 *            table,
 *            TableWidth,
 *            tableMouseDownHandler,
 *            tableClickHandler,
 *            gripMouseDownHandler,
 *        }
 * @returns A table component with a title and a list of fields.
 */
export default function Table(props) {
    const {
        table,
        TableWidth,
        tableMouseDownHandler,
        tableClickHandler,
        gripMouseDownHandler,
        handlerEditingField,
    } = props;

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

    const height = table.fields.length * 32 + 52;
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
        >
            <div className="table">
                <div className="table-title">
                    <span>{table.name}</span>
                    <Button
                        size="mini"
                        onClick={() => {
                            tableClickHandler(table);
                        }}
                    >
                        Edit
                    </Button>
                </div>
                {table.fields &&
                    table.fields.map(field => (
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
                                </div>
                            </div>
                        </Popover>
                    ))}
            </div>
        </foreignObject>
    );
}
