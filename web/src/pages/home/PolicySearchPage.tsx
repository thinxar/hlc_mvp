import { useState } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { EmptyList } from './sectionX/EmptyList';
import { MemoizedPdfViewer } from './sectionX/MemoizedPdfViewer';
import { PdfFileItem } from './sectionX/PdfFileItem';
import { SearchBar } from './sectionX/SearchBar';

const samplePolicies = [
    {
        id: '123456789',
        pdfFiles: [
            { name: 'Policy Document', fileName: '123456789_Policy_Document.pdf', size: '2.3 MB', date: '15-01-2025', type: "pdf" },
            { name: 'Premium Receipt', fileName: '123456789_Premium_Receipt.tiff', size: '456 KB', date: '12-01-2025', type: "tiff" },
            { name: 'Coverage Details', fileName: '123456789_Coverage_Details.pdf', size: '1.8 MB', date: '29-02-2025', type: "pdf" },
            { name: 'Policy Document', fileName: '123456789_Policy_Document.JPEG', size: '2.3 MB', date: '15-01-2025', type: "JPEG", path: 'images/horse.JPEG' }
        ]
    },
    {
        id: '987654321',
        pdfFiles: [
            { name: 'Policy Document', fileName: '987654321_Policy_Document.pdf', size: '3.1 MB', date: '22-02-2025', type: "pdf" },
            { name: 'Property Valuation', fileName: '987654321_Property_Valuation.tiff', size: '2.7 MB', date: '18-02-2025', type: "tiff" },
            { name: 'Premium Schedule', fileName: '987654321_Premium_Schedule.tiff', size: '612 KB', date: '12-02-2025', type: "tiff" },
            { name: 'Claim History', fileName: '987654321_Claim_History.pdf', size: '890 KB', date: '24-04-2025', type: "pdf" }
        ]
    },
    {
        id: '555554444',
        pdfFiles: [
            { name: 'Policy Application', fileName: '555554444_Policy_Application.tiff', size: '1.9 MB', date: '03-03-2025', type: "tiff" },
            { name: 'Medical Report', fileName: '555554444_Medical_Report.pdf', size: '4.2 MB', date: '20-05-2025', type: "pdf" },
            { name: 'Beneficiary Details', fileName: '555554444_Beneficiary_Details.pdf', size: '723 KB', date: '14-03-2025', type: "pdf" }
        ]
    }
];

const PolicySearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const handleSearch = () => {
        setSearchQuery(searchTerm);
        setHasSearched(true);
        setSelectedFile(null);
    };

    const filteredPolicies = searchQuery
        ? samplePolicies.filter((policy) => policy.id === searchQuery)
        : [];

    const allFiles = filteredPolicies.flatMap((policy) =>
        policy.pdfFiles.map((file) => ({ ...file, policyId: policy.id }))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br bColor relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            <div className="relative z-10 p-4">
                {hasSearched && filteredPolicies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[30%_70%] lg:grid-cols-[20%_80%] xl:grid-cols-[20%_80%] 2xl:grid-cols-[20%_80%] transition-all duration-300 ease-in-out gap-4 px-5 mx-auto w-full h-[calc(98vh-30px)]">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 flex flex-col overflow-auto">
                            <div className="flex items-center gap-1.5 mb-4">
                                <IoChevronBackOutline onClick={() => { setHasSearched(false) }}
                                    className='text-slate-300 cursor-pointer' />
                                <div className='text-lg font-bold text-slate-300'>
                                    Policy Number:</div>
                                <div className='text-xl text-slate-100 font-semibold'>{searchQuery}</div></div>
                            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} compact={true} />
                            <div className="space-y-3 overflow-y-auto">
                                {allFiles.map((file, idx) => (
                                    <PdfFileItem
                                        key={idx}
                                        file={file}
                                        isSelected={selectedFile?.fileName === file?.fileName}
                                        onClick={() => setSelectedFile(file)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-auto">
                            <MemoizedPdfViewer file={selectedFile} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8 animate-fade-in">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white bg-clip-text">
                                PolicyFinder
                            </h1>
                            <p className="text-lg text-white/70 max-w-2xl mx-auto">
                                Search and manage your insurance policies with ease
                            </p>
                        </div>
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} setHasSearched={setHasSearched} />
                        <EmptyList hasSearched={hasSearched} searchQuery={searchQuery} />
                    </>
                )}
            </div>
        </div>
    );
};

export { PolicySearchPage };

