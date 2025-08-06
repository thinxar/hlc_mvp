import { useState } from 'react';
import { CiCalendar, CiHardDrive, CiSearch } from 'react-icons/ci';
import { FaDownload, FaFile } from 'react-icons/fa6';
import { PdfViewWithOverlay } from '../components/PdfViewWithOverlay';
import { TIFFViewer } from '../components/TiffViewWithOverlay';

const samplePolicies = [
    {
        id: '123456789',
        pdfFiles: [
            { name: 'Policy Document', fileName: 'POL001234_Policy_Document.pdf', size: '2.3 MB', date: '15-01-2025', type: "pdf" },
            { name: 'Premium Receipt', fileName: 'POL001234_Premium_Receipt.tiff', size: '456 KB', date: '12-01-2025', type: "tiff" },
            { name: 'Coverage Details', fileName: 'POL001234_Coverage_Details.pdf', size: '1.8 MB', date: '29-02-2025', type: "pdf" }
        ]
    },
    {
        id: '987654321',
        pdfFiles: [
            { name: 'Policy Document', fileName: 'POL002567_Policy_Document.pdf', size: '3.1 MB', date: '22-02-2025', type: "pdf" },
            { name: 'Property Valuation', fileName: 'POL002567_Property_Valuation.tiff', size: '2.7 MB', date: '18-02-2025', type: "tiff" },
            { name: 'Premium Schedule', fileName: 'POL002567_Premium_Schedule.tiff', size: '612 KB', date: '12-02-2025', type: "tiff" },
            { name: 'Claim History', fileName: 'POL002567_Claim_History.pdf', size: '890 KB', date: '24-04-2025', type: "pdf" }
        ]
    },
    {
        id: '555554444',
        pdfFiles: [
            { name: 'Policy Application', fileName: 'POL003890_Policy_Application.tiff', size: '1.9 MB', date: '03-03-2025', type: "tiff" },
            { name: 'Medical Report', fileName: 'POL003890_Medical_Report.pdf', size: '4.2 MB', date: '20-05-2025', type: "pdf" },
            { name: 'Beneficiary Details', fileName: 'POL003890_Beneficiary_Details.pdf', size: '723 KB', date: '14-03-2025', type: "pdf" }
        ]
    }
];

const image = '/images/multiple.tiff'

const overlays = [
    {
        page: 1,
        imageUrl: '/images/horse.JPEG',
        x: 100,
        y: 150,
        width: 100,
        height: 50
    },
    {
        page: 2,
        imageUrl: '/images/horse.JPEG',
        x: 100,
        y: 100,
        width: 250,
        height: 250
    }
];

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }: any) => {
    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 animate-slide-up">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter policy number (e.g., 123456789)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full bg-transparent text-white placeholder-white/50 pl-12 pr-4 py-4 text-lg focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={onSearch}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PdfFileItem = ({ file, isSelected, onClick }: any) => {
    const getFileIcon = (_type: any) => {
        return <FaFile className="w-5 h-5" />;
    };

    const getFileTypeColor = (type: any) => {
        return type === 'pdf' ? 'text-red-400' : 'text-blue-400';
    };

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${isSelected
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
        >
            <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-white/10 ${getFileTypeColor(file.type)}`}>
                    {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{file.name}</h3>
                    <p className="text-sm text-white/60 truncate">{file.fileName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-white/50">
                        <span className="flex items-center space-x-1">
                            <CiHardDrive className="w-3 h-3" />
                            <span>{file.size}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <CiCalendar className="w-3 h-3" />
                            <span>{file.date}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PdfViewer = ({ file }: any) => {
    if (!file) {
        return (
            <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                    <FaFile className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">Select a document to view</p>
                    <p className="text-sm mt-2">Choose a PDF or TIFF file from the list on the left</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-auto bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-white">{file.name}</h3>
                        <p className="text-sm text-white/60">{file.fileName}</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200">
                        <FaDownload className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
            </div>
            <div className="p-6 h-full">
                <div className="bg-white rounded-lg h-full flex items-center justify-center">
                    {/* <div className="text-center text-gray-600">
                        <FaFile className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold">{file.name}</p>
                        <p className="text-sm mt-2">PDF/TIFF viewer would be integrated here</p>
                        <p className="text-xs mt-1 text-gray-500">File: {file.fileName}</p>
                        <p className="text-xs text-gray-500">Size: {file.size} • Date: {file.date}</p>
                    </div> */}
                    {file.type == 'pdf' ?
                        <PdfViewWithOverlay
                            pdfUrlFromApi={"https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"}
                            // pdfUrlFromApi="https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf"
                            imageUrlFromApi="https://picsum.photos/200/300.jpg"
                            pageIndex={0}
                            position={{ x: 250, y: 200 }}
                            scale={0.7} />
                        : <TIFFViewer
                            overlays={overlays}
                            tiff={image}
                            lang='tr'
                            paginate='ltr'
                            buttonColor='#141414'
                            printable
                            zoomable
                        />}
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ hasSearched, searchQuery }: any) => {
    if (!hasSearched) {
        return (
            <div className="text-center text-white/60 py-20">
                <CiSearch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Search for Policy Documents</h3>
                <p>Enter a policy number and click search to view available documents</p>
            </div>
        );
    }

    return (
        <div className="text-center text-white/60 py-20">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Policy Found</h3>
            <p>No policy documents found for "{searchQuery}".</p>
            <p className="text-sm mt-2 text-white/50">Try entering a different policy number</p>
        </div>
    );
};

const PolicySearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSearch = () => {
        setSearchQuery(searchTerm);
        setHasSearched(true);
        setSelectedFile(null);
    };

    const filteredPolicies = searchQuery
        ? samplePolicies.filter(policy =>
            policy.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const allFiles = filteredPolicies.flatMap(policy =>
        policy.pdfFiles.map(file => ({ ...file, policyId: policy.id }))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 p-6">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        PolicyFinder
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Search and manage your insurance policies with ease
                    </p>
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={handleSearch}
                />

                {hasSearched && (
                    <div className="animate-fade-in-up">
                        {filteredPolicies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 max-w-7xl mx-auto">

                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">
                                        Policy Documents for "{searchQuery}" ({allFiles.length})
                                    </h2>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {allFiles.map((file: any, index) => (
                                            <PdfFileItem
                                                key={index}
                                                file={file}
                                                isSelected={selectedFile === file}
                                                onClick={() => setSelectedFile(file)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 min-h-96">
                                    <PdfViewer file={selectedFile} />
                                </div>
                            </div>
                        ) : (
                            <EmptyState hasSearched={hasSearched} searchQuery={searchQuery} />
                        )}
                    </div>
                )}

                {!hasSearched && <EmptyState hasSearched={false} />}
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in { animation: fade-in 0.8s ease-out; }
                .animate-slide-up { animation: slide-up 0.8s ease-out 0.3s both; }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out both; }
            `}</style>
        </div>
    );
};

export default PolicySearchPage;