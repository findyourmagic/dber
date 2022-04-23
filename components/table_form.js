import { useState, useEffect, useRef, forwardRef } from 'react';
import { Button, Space, Input, Card, Popconfirm } from '@arco-design/web-react';
import fieldTypes from '../data/filed_typs';
// name: string;
// type: any;
// unique: boolean;
// pk: boolean;
// not_null: boolean;
// note: string;
// dbdefault: any;
// increment: boolean;

function TalbeFormItem(props, ref) {
    const moveUp = () => {
        props.setFields(fields => {
            if (props.index > 0) {
                const _fields = [...fields];
                [_fields[props.index], _fields[props.index - 1]] = [
                    _fields[props.index - 1],
                    _fields[props.index],
                ];
                return _fields;
            }
            return fields;
        });
    };

    const moveDown = () => {
        props.setFields(fields => {
            if (props.index < fields.length - 1) {
                const _fields = [...fields];
                [_fields[props.index], _fields[props.index + 1]] = [
                    _fields[props.index + 1],
                    _fields[props.index],
                ];
                return _fields;
            }
            return fields;
        });
    };

    return (
        <form ref={ref} className="table-form">
            <Card>
                <input
                    type="hidden"
                    name="id"
                    defaultValue={props.field.id || ''}
                />
                <Space direction="vertical">
                    <Space>
                        <label>Name:</label>

                        <Input
                            type="text"
                            name="name"
                            defaultValue={props.field.name || ''}
                        />
                        <label>Type:</label>
                        <div className="arco-select arco-select-single arco-select-size-default">
                            <select
                                className="arco-input arco-input-size-default"
                                name="type"
                                defaultValue={props.field.type || ''}
                                style={{ width: 120 }}
                            >
                                {fieldTypes.map(item => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Space>
                    <Space>
                        <label>Note:</label>

                        <Input
                            type="text"
                            name="note"
                            placeholder="note"
                            defaultValue={props.field.note || ''}
                        />
                        <label>Default:</label>

                        <Input
                            type="text"
                            name="dbdefault"
                            placeholder="default"
                            defaultValue={props.field.dbdefault || ''}
                        />
                    </Space>
                    <Space
                        style={{
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <label>
                            Primary&nbsp;
                            <input
                                type="checkbox"
                                name="pk"
                                defaultChecked={props.field.pk || false}
                            />
                        </label>
                        <label>
                            Unique&nbsp;
                            <input
                                type="checkbox"
                                name="unique"
                                defaultChecked={props.field.unique || false}
                            />
                        </label>
                        <label>
                            Not Null&nbsp;
                            <input
                                type="checkbox"
                                name="not_null"
                                defaultChecked={props.field.not_null || false}
                            />
                        </label>
                        <label>
                            Increment&nbsp;
                            <input
                                type="checkbox"
                                name="increment"
                                defaultChecked={props.field.increment || false}
                            />
                        </label>
                    </Space>
                    <Space>
                        <Button onClick={moveUp} type="primary">
                            ↑ Move up
                        </Button>
                        <Button onClick={moveDown} type="primary">
                            ↓ Move down
                        </Button>

                        <Popconfirm
                            title="Are you sure delete this field?"
                            onOk={() => {
                                props.removeItem(props.field.id);
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button status="danger">Remove field</Button>
                        </Popconfirm>
                    </Space>
                </Space>
            </Card>
        </form>
    );
}

const TalbeRefFormItem = forwardRef(TalbeFormItem);

export default function TalbeForm(props) {
    const [fields, setFields] = useState(props.table.fields);
    const [name, setName] = useState(props.table.name);
    const forms = useRef([]);

    useEffect(() => {
        setFields(props.table.fields);
    }, [props.table]);

    useEffect(() => {
        forms.current = forms.current.slice(0, fields.length);
    }, [fields]);

    const save = () => {
        const updatedFields = forms.current.map(form => {
            return [...new FormData(form).entries()].reduce((prev, cur) => {
                prev[cur[0]] = cur[1];
                return prev;
            }, {});
        });
        const table = { ...props.table, name, fields: updatedFields };
        delete table.x;
        delete table.y;
        props.updateTable(table);
        props.setCommitting(false);
    };

    useEffect(() => {
        if (props.committing) {
            save();
        }
    }, [props.committing]);

    const addItem = () => {
        setFields(state => {
            return [
                ...state,
                {
                    id: window.crypto.randomUUID(),
                    name: 'new item' + state.length,
                    type: 'INTEGER',
                    unique: false,
                },
            ];
        });
    };

    const removeItem = id => {
        setFields(state => {
            const fields = state.filter(item => item.id != id);
            return fields.length ? fields : [];
        });
    };

    return (
        <Space direction="vertical">
            <Space>
                <label>Table Name:</label>
                <Input
                    defaultValue={props.table.name}
                    type="text"
                    onChange={value => {
                        setName(value);
                    }}
                ></Input>
                <Popconfirm
                    position="br"
                    title="Are you sure you want to delete this table?"
                    okText="Yes"
                    cancelText="No"
                    onOk={() => {
                        props.removeTable(props.table.id);
                    }}
                >
                    <Button type="outline" status="warning">
                        Delete table
                    </Button>
                </Popconfirm>
            </Space>
            {fields.map((field, index) => (
                <TalbeRefFormItem
                    field={field}
                    key={field.id}
                    index={index}
                    ref={dom => (forms.current[index] = dom)}
                    removeItem={removeItem}
                    setFields={setFields}
                ></TalbeRefFormItem>
            ))}
            <Button onClick={addItem} type="outline" long>
                + Add field
            </Button>
        </Space>
    );
}
