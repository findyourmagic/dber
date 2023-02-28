import { useState } from 'react';
import { Select } from '@arco-design/web-react';
const Option = Select.Option;

/**
 * It renders a hidden input with the value of the selected option, and a Select component from antd
 * that allows the user to select an option from a list of options, or create a new option
 * @returns A SelectInput component that takes in a name, options, defaultValue, and width.
 */
export default function SelectInput({ name, options, defaultValue, width }) {
    const [value, setValue] = useState(defaultValue);

    const handleChange = value => {
        setValue(value);
    };

    return (
        <>
            <input type="hidden" name={name} value={value} />
            <Select value={value} onChange={handleChange} style={{ width }} allowCreate>
                {options.map(item => (
                    <Option key={item} value={item}>
                        {item}
                    </Option>
                ))}
            </Select>
        </>
    );
}
