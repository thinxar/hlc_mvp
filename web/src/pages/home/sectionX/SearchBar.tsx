import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';
import { PiWarningCircleFill } from "react-icons/pi";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, setHasSearched }: any) => {
    const [showError, setShowError] = useState(false)
    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') onSearch();
    };

    const handleClear = () => {
        if (setHasSearched) {
            setHasSearched(false);
        }
        setSearchTerm('');
        setShowError(false);
    }

    const handleChange = (e: any) => {
        setSearchTerm(e.target.value)
    }

    const handleSearch = () => {
        onSearch()
        setShowError(true);
    }


    return (
        <div className="w-full max-w-2xl mx-auto mb-8 animate-slide-up">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-800 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter policy number (e.g., 123456789)"
                                value={searchTerm}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                className="w-full bg-transparent text-white placeholder-white/50 pl-12 pr-4 py-4 text-lg focus:outline-none"
                            />
                        </div>
                        {searchTerm && (
                            <IoClose className='text-gray-400 cursor-pointer' fontSize={30} onClick={handleClear} />
                        )}
                        <button onClick={handleSearch} className="cursor-pointer bg-yellow-400 text-sky-800 px-8 py-4 rounded-xl
                            font-semibold transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className='min-h-15'>
                {searchTerm == '' && showError &&
                    <div className='text-yellow-400 text-sm flex items-center gap-1'><PiWarningCircleFill /> Please enter a valid policy number.</div>}
            </div>
        </div>
    );
};

export { SearchBar };