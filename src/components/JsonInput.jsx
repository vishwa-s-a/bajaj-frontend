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

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            boxShadow: 'none',        // Remove the default outline (box shadow)
            borderColor: state.isFocused ? 'white' : 'white', // Optional: Customize border color on focus
            '&:hover': {
                borderColor: state.isFocused ? 'white' : 'white', // Customize hover effect
            },
        }),
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
                // console.log(apiResponse[option.value]['2'])
                // console.log(apiResponse[option.value].length)
                let ans=' '
                for(let i in apiResponse[option.value]){
                    ans+=apiResponse[option.value][i]
                    if(i != (apiResponse[option.value].length)-1){
                        ans+=","
                    }
                }
                
                return (
                    <div key={option.value}>
                        <p className='font-sm text-lg'>{option.label} : 
                            {ans}
                        </p>
                        {/* <pre>{JSON.stringify(apiResponse[option.value], null, 2)}</pre> */}
                    </div>
                );
            }
            return null;
        });

        return renderedData;
    };

    return (
        <div className='flex flex-1 flex-col items-center gap-8 w-[60vw] p-0 mt-40'>
            <form onSubmit={handleSubmit} className='w-full p-0 m-0 box-border'>

                <div className='border-solid border-2 border-sky-100 rounded-md w-full h-[60px] p-3 '>
                    <p className='relative top-[-25px] font-medium font-montserrat text-slate-500 bg-white w-max'>API Input</p>
                    <input type='text'
                        value={jsonInput}
                        onChange={handleInputChange}
                        className=' relative top-[-15px] text-xl outline-none focus:border-blue-500'>

                    </input>
                </div>

                {/* <textarea
                    rows="4"
                    cols="50"
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder='API input here'
                    className='border-solid border-2 border-sky-100 rounded-sm w-full'
                /> */}
                <br />
                <button type="submit" className="gap-2 px-7 py-4 border rounded-lg font-montserrat
                    text-lg leading-none bg-blue-700 w-full text-white font-bold ">Submit</button>
                {!isValidJson && <p style={{ color: 'red' }}>Invalid JSON format</p>}
            </form>
            {apiResponse && (
                <div className="w-full top-20">
                    <div className='border-solid border-2 border-sky-100 rounded-md w-full h-[60px] p-3 '>
                        <p className='relative top-[-25px] font-medium font-montserrat text-slate-500 bg-white w-max'>Multi filter</p>
                        <Select
                            isMulti
                            options={options}
                            onChange={handleSelectChange}
                            styles={customStyles}
                            className='top-[-25px] ml-0'
                        />
                        <div className="response-data">
                            <p className='font-md text-lg '>Filtered Response</p>
                            {renderResponse()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JsonInput;
