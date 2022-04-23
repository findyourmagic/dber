import { useState } from 'react';
import { Select } from '@arco-design/web-react';
const Option = Select.Option;

export default function SelectInput({ name, options, defaultValue }) {
    const [value, setValue] = useState(defaultValue);

    const handleChange = value => {
        setValue(value);
    };

    return (
        <>
            <input type="hidden" name={name} value={value} />
            <Select
                value={value}
                onChange={handleChange}
                style={{ width: 138 }}
                allowCreate
            >
                {options.map(item => (
                    <Option key={item} value={item}>
                        {item}
                    </Option>
                ))}
            </Select>
        </>
    );
}
