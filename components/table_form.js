import { useState, useEffect, useRef, forwardRef } from 'react';
import { Button, Space } from '@arco-design/web-react';
// name: string;
// type: any;
// unique: boolean;
// pk: boolean;
// not_null: boolean;
// note: string;
// dbdefault: any;
// increment: boolean;

function TalbeFormItem(props, ref) {
    return (
        <form ref={ref}>
            <input
                type="hidden"
                name="id"
                defaultValue={props.field.id || ''}
            />
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    defaultValue={props.field.name || ''}
                />
            </label>
            <label>
                Type:
                <input
                    type="text"
                    name="type"
                    placeholder="type"
                    defaultValue={props.field.type || ''}
                />
            </label>
            <label>
                Note:
                <input
                    type="text"
                    name="note"
                    placeholder="note"
                    defaultValue={props.field.note || ''}
                />
            </label>
            <label>
                Default:
                <input
                    type="text"
                    name="dbdefault"
                    placeholder="default"
                    defaultValue={props.field.dbdefault || ''}
                />
            </label>
            <label>
                Primary:
                <input
                    type="checkbox"
                    name="primary"
                    defaultChecked={props.field.primary || false}
                />
            </label>
            <label>
                Unique:
                <input
                    type="checkbox"
                    name="unique"
                    defaultChecked={props.field.unique || false}
                />
            </label>
            <label>
                Not Null:
                <input
                    type="checkbox"
                    name="not_null"
                    defaultChecked={props.field.not_null || false}
                />
            </label>
            <label>
                Increment:
                <input
                    type="checkbox"
                    name="increment"
                    defaultChecked={props.field.increment || false}
                />
            </label>
            <button
                onClick={() => {
                    props.removeItem(props.field.id);
                }}
            >
                x
            </button>
        </form>
    );
}

const TalbeRefFormItem = forwardRef(TalbeFormItem);

export default function TalbeForm(props) {
    const [fields, setFields] = useState(props.table.fields);
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
        let table = { ...props.table, fields: updatedFields };
        delete table.x;
        delete table.y;
        console.log(props);
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
                    type: '',
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
            <input defaultValue={props.table.name} type="text"></input>
            {fields.map((field, index) => (
                <TalbeRefFormItem
                    field={field}
                    key={field.id}
                    ref={dom => (forms.current[index] = dom)}
                    removeItem={removeItem}
                ></TalbeRefFormItem>
            ))}
            <Button onClick={addItem} type="outline" long>
                + 添加字段
            </Button>
        </Space>
    );
}
