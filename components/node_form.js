import { useState, useEffect, useRef, forwardRef } from "react";

// name: string;
// type: any;
// unique: boolean;
// pk: boolean;
// not_null: boolean;
// note: string;
// dbdefault: any;
// increment: boolean;

function NodeFormItem(props, ref) {
    return (
        <form ref={ref}>
            <input type="hidden" name="id" defaultValue={props.attr.id || ""} />
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    defaultValue={props.attr.name || ""}
                />
            </label>
            <label>
                Type:
                <input
                    type="text"
                    name="type"
                    placeholder="type"
                    defaultChecked={props.attr.type || ""}
                />
            </label>
            <label>
                Note:
                <input
                    type="text"
                    name="note"
                    placeholder="note"
                    defaultChecked={props.attr.note || ""}
                />
            </label>
            <label>
                Default:
                <input
                    type="text"
                    name="dbdefault"
                    placeholder="default"
                    defaultChecked={props.attr.dbdefault || ""}
                />
            </label>
            <label>
                Primary:
                <input
                    type="checkbox"
                    name="primary"
                    defaultChecked={props.attr.primary || false}
                />
            </label>
            <label>
                Unique:
                <input
                    type="checkbox"
                    name="unique"
                    defaultChecked={props.attr.unique || false}
                />
            </label>
            <label>
                Not Null:
                <input
                    type="checkbox"
                    name="not_null"
                    defaultChecked={props.attr.not_null || false}
                />
            </label>
            <label>
                Increment:
                <input
                    type="checkbox"
                    name="increment"
                    defaultChecked={props.attr.increment || false}
                />
            </label>
            <button
                onClick={() => {
                    props.removeItem(props.attr.id);
                }}
            >
                x
            </button>
        </form>
    );
}

const NodeRefFormItem = forwardRef(NodeFormItem);

export default function NodeForm(props) {
    const [attrs, setAttrs] = useState(props.node.attrs);
    const forms = useRef([]);

    useEffect(() => {
        setAttrs(props.node.attrs);
    }, [props.node]);

    useEffect(() => {
        forms.current = forms.current.slice(0, attrs.length);
    }, [attrs]);

    const save = () => {
        const updatedAttrs = forms.current.map((form) => {
            return [...new FormData(form).entries()].reduce((prev, cur) => {
                prev[cur[0]] = cur[1];
                return prev;
            }, {});
        });
        let node = { ...props.node, attrs: updatedAttrs };
        delete node.x;
        delete node.y;
        props.updateNode(node);
    };

    const addItem = () => {
        setAttrs((state) => {
            return [
                ...state,
                {
                    id: window.crypto.randomUUID(),
                    name: "new item" + state.length,
                    type: "",
                    unique: false,
                },
            ];
        });
    };

    const removeItem = (id) => {
        setAttrs((state) => {
            const attrs = state.filter((item) => item.id != id);
            return attrs.length ? attrs : [];
        });
    };

    return (
        <>
            <div
                onClick={() => {
                    props.updateNode(null);
                }}
            >
                关闭
            </div>
            <input defaultValue={props.node.name} type="text"></input>
            {attrs.map((attr, index) => (
                <NodeRefFormItem
                    attr={attr}
                    key={attr.id}
                    ref={(dom) => (forms.current[index] = dom)}
                    removeItem={removeItem}
                ></NodeRefFormItem>
            ))}
            <button onClick={addItem}>添加</button>
            <button onClick={save}>确定</button>
        </>
    );
}
