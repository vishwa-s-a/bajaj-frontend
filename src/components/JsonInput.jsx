import { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
];

function JsonInput() {
    const [jsonInput, setJsonInput] = useState('');
    const [isValidJson, setIsValidJson] = useState(true);
    const [apiResponse, setApiResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleInputChange = (event) => {
        setJsonInput(event.target.value);
    };

    const validateJson = (input) => {
        try {
            JSON.parse(input);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateJson(jsonInput)) {
            setIsValidJson(false);
            return;
        }
        setIsValidJson(true);

        try {
            const response = await axios.post('https://bajaj-backend-rusd.onrender.com/bfhl', JSON.parse(jsonInput));
            setApiResponse(response.data);
        } catch (error) {
            console.error('Error while calling API:', error);
        }
    };

    const handleSelectChange = (selected) => {
        setSelectedOptions(selected);
    };

    const renderResponse = () => {
        if (!apiResponse || selectedOptions.length === 0) return null;

        const renderedData = selectedOptions.map(option => {
            if (option.value in apiResponse) {
                return (
                    <div key={option.value}>
                        <h3>{option.label}</h3>
                        <pre>{JSON.stringify(apiResponse[option.value], null, 2)}</pre>
                    </div>
                );
            }
            return null;
        });

        return renderedData;
    };

    return (
        <div className='flex flex-1 justify-center flex-col items-center mt-4 p-4'>
            <form onSubmit={handleSubmit}>
                <p className=' font-medium font-montserrat'>API Input</p>
                <textarea
                    rows="4"
                    cols="50"
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder='API input here'
                    className='border-solid border-2 border-sky-100 rounded-sm w-full'
                />
                <br />
                <button type="submit" className="flex justify-center items-center gap-2 px-7 py-4 border rounded-lg font-montserrat
                    text-lg leading-none bg-blue-700 w-full">Submit</button>
                {!isValidJson && <p style={{ color: 'red' }}>Invalid JSON format</p>}
            </form>
            {apiResponse && (
                <div className="">
                    <h2>Select what to display:</h2>
                    <Select
                        isMulti
                        options={options}
                        onChange={handleSelectChange}
                    />
                    <div className="response-data">
                        {renderResponse()}
                    </div>
                </div>
            )}
        </div>
    );
}

export default JsonInput;
