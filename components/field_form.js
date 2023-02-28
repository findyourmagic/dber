import { Checkbox, Form, Input, Space, Tag, Modal, AutoComplete } from '@arco-design/web-react';
import fieldTypes from '../data/filed_typs';
import graphState from '../hooks/use-graph-state';
import tableModel from '../hooks/table-model';

/**
 * It renders a form for editing a table
 * @param props - The props passed to the component.
 * @returns A TableForm component
 */
export default function FieldForm(props) {
    const [form] = Form.useForm();
    const { formChange, onFormChange } = props;
    const { editingField, setEditingField, addingField, setAddingField } =
        graphState.useContainer();
    const { updateTable, removeField } = tableModel();
    const { field, table } = editingField;

    const save = values => {
        const data = { ...field, ...values };
        table.fields = table.fields.map(f => (f.id === data.id ? data : f));
        updateTable(table);
    };

    return table ? (
        <Modal
            title={
                <div style={{ textAlign: 'left' }}>
                    Edit
                    {table ? (
                        <Tag color="arcoblue" style={{ margin: '0 4px' }}>
                            {table.name}
                        </Tag>
                    ) : (
                        ''
                    )}
                    Field
                </div>
            }
            visible={!!table}
            onCancel={() => {
                if (addingField?.index) {
                    removeField(addingField.table, addingField.index);
                }
                setEditingField({});
            }}
            onOk={() => {
                setAddingField(null);
                form.submit();
            }}
            escToExit={!formChange}
            maskClosable={!formChange}
            afterClose={() => {
                onFormChange(false);
            }}
            afterOpen={() => {
                form.resetFields();
            }}
            style={{ width: 580 }}
            okText="Commit"
            cancelText="Cancel"
        >
            {field && (
                <Form
                    onSubmit={save}
                    form={form}
                    labelAlign="left"
                    requiredSymbol={false}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onValuesChange={(changedValues, allValues) => {
                        if (!formChange) onFormChange(true);
                    }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Space className="table-form-item">
                            <Form.Item
                                label="Name"
                                field="name"
                                initialValue={field.name}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter field name',
                                    },
                                    {
                                        validator: (value, cb) => {
                                            return table.fields
                                                .filter(item => item.id !== field.id)
                                                .find(item => item.name === value)
                                                ? cb('have same name field')
                                                : cb();
                                        },
                                    },
                                ]}
                            >
                                <Input allowClear />
                            </Form.Item>
                            <Form.Item
                                label="Type"
                                field="type"
                                initialValue={field.type}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please choose field type',
                                    },
                                ]}
                            >
                                <AutoComplete data={fieldTypes}></AutoComplete>
                            </Form.Item>
                        </Space>
                        <Space className="table-form-item">
                            <Form.Item label="Comment" field="note" initialValue={field.note || ''}>
                                <Input allowClear placeholder="note" />
                            </Form.Item>
                            <Form.Item
                                label="Default"
                                field="dbdefault"
                                initialValue={field.dbdefault || ''}
                            >
                                <Input allowClear placeholder="default" />
                            </Form.Item>
                        </Space>
                        <Space className="table-form-item">
                            <Form.Item noStyle field="pk" initialValue={field.pk}>
                                <Checkbox defaultChecked={field.pk}>Primary</Checkbox>
                            </Form.Item>
                            <Form.Item noStyle field="unique" initialValue={field.unique}>
                                <Checkbox defaultChecked={field.unique}>Unique</Checkbox>
                            </Form.Item>
                            <Form.Item noStyle field="not_null" initialValue={field.not_null}>
                                <Checkbox defaultChecked={field.not_null}>Not Null</Checkbox>
                            </Form.Item>
                            <Form.Item noStyle field="increment" initialValue={field.increment}>
                                <Checkbox defaultChecked={field.increment}>Increment</Checkbox>
                            </Form.Item>
                        </Space>
                    </Space>
                </Form>
            )}
        </Modal>
    ) : null;
}
