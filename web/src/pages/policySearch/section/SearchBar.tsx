import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';
import { PiWarningCircleFill } from "react-icons/pi";

interface SearchBarProps {
    onSearch: (string: any) => void,
    onClear: () => void,
    compact: boolean
}

const SearchBar = ({ onSearch, onClear, compact }: SearchBarProps) => {
    const [showError, setShowError] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') onSearch(searchTerm);
    };

    const handleClear = () => {
        onClear();
        setSearchTerm('');
        setShowError(false);
    }

    const handleChange = (e: any) => {
        const value = e.target.value;
        const onlyNumbers = value.replace(/\D/g, '');

        if (value !== onlyNumbers && value !== '') {
            setShowError(true);
        } else {
            setShowError(false);
        }
        setSearchTerm(value);
    };

    const handleSearch = () => {
        if (searchTerm == '')
            setShowError(true);
        else
            onSearch(searchTerm)
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 animate-slide-up mt-3">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-200 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-gray/10 backdrop-blur-xl rounded-2xl border-1 border-gray-300 p-1">
                    <div className={`flex items-center ${compact ? 'space-x-2' : 'space-x-4'}`}>
                        <div className="flex-1 relative">
                            <CiSearch className={`absolute ${compact ? 'left-1' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray/60 w-5 h-5`} />
                            <input
                                type="text"
                                placeholder="Enter policy number"
                                value={searchTerm}
                                onChange={handleChange}
                                onKeyUp={handleKeyPress}
                                className={`w-full bg-transparent text-gray placeholder-gray/50 
                                ${compact ? 'pl-8 placeholder:text-sm' : 'pl-12 pr-4 py-4'}
                                text-lg focus:outline-none`}
                            />
                        </div>
                        {searchTerm && (
                            <IoClose className='text-gray-400 cursor-pointer' fontSize={30} onClick={handleClear} />
                        )}
                        <button onClick={handleSearch} className={`cursor-pointer filled-button
                        ${compact ? 'px-4 py-2' : 'px-8 py-4'} 
                        rounded-xl font-semibold transition duration-300 transform  shadow-lg hover:shadow-xl`}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
            {!compact &&
                <div className='min-h-15'>
                    {showError &&
                        <div className='text-yellow-600 text-sm flex items-center gap-1'><PiWarningCircleFill /> Please enter a valid policy number.</div>}
                </div>}
        </div>
    );
};

export { SearchBar };