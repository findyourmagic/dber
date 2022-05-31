import { useState, useEffect, useRef, forwardRef } from 'react';
import { Button, Space, Input, Card, Popconfirm } from '@arco-design/web-react';
import classNames from 'classnames';
import SelectInput from './select_input';
import fieldTypes from '../data/filed_typs';

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
        <form
            ref={ref}
            className={classNames({
                dropping:
                    props.draggingId &&
                    props.droppingId == props.field.id &&
                    props.droppingId != props.draggingId &&
                    props.index != props.draggingIndex - 1,
                dragging:
                    props.draggingId && props.draggingId == props.field.id,
                'table-form': true,
            })}
            draggable="true"
            onDragStart={() => {
                props.onDragStart(props.field.id);
            }}
            onDragEnd={() => {
                props.setDraggingId(null);
                props.setDroppingId(null);
            }}
            onDragOver={e => {
                props.setDroppingId(props.field.id);
                e.preventDefault();
            }}
            onDrop={e => {
                props.onDrop(props.field.id);
            }}
        >
            <Card>
                <input
                    type="hidden"
                    name="id"
                    defaultValue={props.field.id || ''}
                />
                <Space direction="vertical">
                    <Space>
                        <label className="table-form-label">Name:</label>
                        <Input
                            type="text"
                            name="name"
                            defaultValue={props.field.name || ''}
                        />
                        <label className="table-form-label">Type:</label>
                        <SelectInput
                            defaultValue={props.field.type || ''}
                            options={fieldTypes}
                            width={150}
                            name="type"
                        ></SelectInput>
                    </Space>
                    <Space>
                        <label className="table-form-label">Note:</label>

                        <Input
                            type="text"
                            name="note"
                            placeholder="note"
                            defaultValue={props.field.note || ''}
                        />
                        <label className="table-form-label">Default:</label>
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

    // Drag and drop
    const [draggingId, setDraggingId] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(false);
    const [droppingId, setDroppingId] = useState(false);

    const onDragStart = id => {
        setDraggingId(id);
        setDraggingIndex(fields.findIndex(item => item.id == id));
    };

    const onDrop = id => {
        setDroppingId(null);
        const index = fields.findIndex(item => item.id === id);
        const draggingIndex = fields.findIndex(item => item.id === draggingId);

        if (index === draggingIndex) {
            return setDraggingId(null);
        }

        if (index === draggingIndex - 1) {
            setFields(state => {
                const fields = [...state];
                [fields[draggingIndex], fields[draggingIndex - 1]] = [
                    fields[draggingIndex - 1],
                    fields[draggingIndex],
                ];
                return fields;
            });
        } else {
            setFields(state => {
                const _fields = [...state];
                const draggingFiled = _fields.splice(draggingIndex, 1)[0];
                const index = _fields.findIndex(item => item.id === id);

                if (index + 1 < _fields.length) {
                    _fields.splice(index + 1, 0, draggingFiled);
                } else {
                    _fields.push(draggingFiled);
                }

                return _fields;
            });
        }

        setDraggingId(null);
    };

    const unShiftFileds = () => {
        const draggingIndex = fields.findIndex(item => item.id === draggingId);
        setFields(state => {
            const _fields = [...state];
            const field = _fields.splice(draggingIndex, 1);
            _fields.unshift(...field);
            return _fields;
        });
        setDraggingId(null);
        setDroppingId(null);
    };

    return (
        <Space direction="vertical">
            <div
                className={droppingId == 'root' ? 'dropping' : ''}
                onDragOver={e => {
                    if (draggingIndex != 0) setDroppingId('root');
                    e.preventDefault();
                }}
                onDrop={e => {
                    unShiftFileds();
                }}
            >
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
            </div>
            {fields.map((field, index) => (
                <TalbeRefFormItem
                    field={field}
                    key={field.id}
                    index={index}
                    ref={dom => (forms.current[index] = dom)}
                    removeItem={removeItem}
                    setFields={setFields}
                    onDragStart={onDragStart}
                    onDrop={onDrop}
                    draggingIndex={draggingIndex}
                    draggingId={draggingId}
                    droppingId={droppingId}
                    setDroppingId={setDroppingId}
                    setDraggingId={setDraggingId}
                ></TalbeRefFormItem>
            ))}
            <Button onClick={addItem} type="outline" long>
                + Add field
            </Button>
        </Space>
    );
}
