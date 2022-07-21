import { Button } from '@arco-design/web-react';

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
    } = props;

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
                    table.fields.map(field => {
                        return (
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
                                    <div>{field.name}</div>
                                    <div className="field-type">{field.type}</div>
                                </div>
                                {/*<div
                                    className="end-grip grip"
                                    onMouseDown={gripMouseDownHandler}
                                ></div>*/}
                            </div>
                        );
                    })}
            </div>
        </foreignObject>
    );
}
