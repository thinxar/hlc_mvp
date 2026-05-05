// import { useState } from 'react';
// import { CiSearch } from 'react-icons/ci';
// import { IoClose } from 'react-icons/io5';
// import { PiWarningCircleFill } from "react-icons/pi";

// interface SearchBarProps {
//     onSearch: (string: any) => void,
//     onClear: () => void,
//     compact: boolean
// }

// const NeftSearchBar = ({ onSearch, onClear, compact }: SearchBarProps) => {
//     const [showError, setShowError] = useState(false);
//     const [searchTerm, setSearchTerm] = useState<string>("");
//     const handleKeyPress = (e: any) => {
//         if (e.key === 'Enter') onSearch(searchTerm);
//     };

//     const handleClear = () => {
//         onClear();
//         setSearchTerm('');
//         setShowError(false);
//     }

//     const handleChange = (e: any) => {
//         const value = e.target.value;
//         const onlyNumbers = value.replace(/\D/g, '');

//         if (value !== onlyNumbers && value !== '') {
//             setShowError(true);
//         } else {
//             setShowError(false);
//         }
//         setSearchTerm(value);
//     };

//     const handleSearch = () => {
//         if (searchTerm == '')
//             setShowError(true);
//         else
//             onSearch(searchTerm)
//     }

//     return (
//         <div className="w-full max-w-2xl mx-auto animate-slide-up mt-0">
//             <div className="relative group">
//                 <div className="absolute inset-0 bg-linear-to-r from-blue-200 to-blue-200 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
//                 <div className="relative bg-gray/10 backdrop-blur-xl rounded-2xl border border-gray-300 p-1">
//                     <div className={`flex items-center ${compact ? 'space-x-2' : 'space-x-4'}`}>
//                         <div className="flex-1 relative">
//                             <CiSearch className={`absolute ${compact ? 'left-1' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray/60 w-5 h-5`} />
//                             <input
//                                 type="text"
//                                 placeholder="Enter policy number"
//                                 value={searchTerm}
//                                 onChange={handleChange}
//                                 onKeyUp={handleKeyPress}
//                                 className={`w-full bg-transparent text-gray placeholder-gray/50 
//                                 ${compact ? 'pl-8 placeholder:text-sm' : 'pl-12 pr-4 py-4'}
//                                 text-lg focus:outline-none`}
//                             />
//                         </div>
//                         {searchTerm && (
//                             <IoClose className='text-gray-400 cursor-pointer' fontSize={30} onClick={handleClear} />
//                         )}
//                         <button onClick={handleSearch} className={`cursor-pointer filled-button
//                         ${compact ? 'px-4 py-2' : 'px-8 py-4'} 
//                         rounded-xl font-semibold transition duration-300 transform  shadow-lg hover:shadow-xl`}>
//                             Search
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             {true &&
//                 <div className='max-h-15'>
//                     {showError &&
//                         <div className='text-yellow-600 text-sm flex items-center gap-1'><PiWarningCircleFill /> Please enter a valid policy number.</div>}
//                 </div>}
//         </div>
//     );
// };

// export { NeftSearchBar };


import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';

interface SearchBarProps {
    onSearch: (value: string) => void;
    onClear: () => void;
    compact: boolean;
}

const NeftSearchBar = ({ onSearch, onClear, compact }: SearchBarProps) => {
    const [showError, setShowError] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleClear = () => {
        onClear();
        setSearchTerm('');
        setShowError(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (searchTerm === '') {
            setShowError(true);
            return;
        }
        onSearch(searchTerm);
    };

    const errorMessage = searchTerm === '' ? 'Policy number requiyellow' : 'Numbers only, no letters allowed';

    return (
        <div className="w-full max-w-2xl mx-auto animate-slide-up mt-0">
            <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-blue-200 to-blue-200 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />

                <div className={`relative bg-gray/10 backdrop-blur-xl rounded-2xl border p-1 transition-colors duration-200
                    ${showError ? 'border-yellow-400' : 'border-gray-300'}`}
                >
                    <div className={`flex items-center ${compact ? 'space-x-2' : 'space-x-4'}`}>

                        <div className="flex-1 relative">
                            <CiSearch className={`absolute ${compact ? 'left-1' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5
                                ${'text-gray/60'}`}
                            />
                            <input
                                type="text"
                                placeholder="Enter policy number"
                                value={searchTerm}
                                onChange={handleChange}
                                onKeyUp={handleKeyPress}
                                className={`w-full bg-transparent text-gray placeholder-gray/50 focus:outline-none text-lg
                                    ${compact ? 'pl-8 placeholder:text-sm' : 'pl-12 pr-4 py-4'}`}
                            />
                        </div>

                        {showError && (
                            <div className="relative flex items-center shrink-0">
                                <div className="w-5 h-5 rounded-full bg-yellow-100 border border-yellow-400 flex items-center justify-center cursor-default">
                                    <span className="text-yellow-500 font-bold" style={{ fontSize: '11px' }}>!</span>
                                </div>

                                <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 px-3 py-1.5
            bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap
            shadow-lg pointer-events-none z-50 animate-fade-in"
                                >
                                    {errorMessage}
                                    <span className="absolute top-1/2 -left-2 -translate-y-1/2 
                border-4 border-transparent border-r-gray-900" />
                                </div>
                            </div>
                        )}

                        {searchTerm && !showError && (
                            <IoClose
                                className="text-gray-400 cursor-pointer shrink-0"
                                fontSize={30}
                                onClick={handleClear}
                            />
                        )}

                        <button
                            onClick={handleSearch}
                            className={`cursor-pointer filled-button rounded-xl font-semibold transition duration-300 shadow-lg hover:shadow-xl shrink-0
                                ${compact ? 'px-4 py-2' : 'px-8 py-4'}`}
                        >
                            Search
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export { NeftSearchBar };