import { useState } from 'react';
import { SearchBar } from './section/SearchBar';
import { PolicyPdfList } from './section/PolicyPdfList';
import { EmptyList } from './section/EmptyList';

const samplePolicies = [
    {
        id: 'POL001234',
        pdfFiles: [
            { name: 'Policy Document', fileName: 'POL001234_Policy_Document.pdf', size: '2.3 MB', date: '15-01-2025', type: "pdf" },
            { name: 'Premium Receipt', fileName: 'POL001234_Premium_Receipt.tiff', size: '456 KB', date: '12-01-2025', type: "tiff" },
            { name: 'Coverage Details', fileName: 'POL001234_Coverage_Details.pdf', size: '1.8 MB', date: '29-02-2025', type: "pdf" }
        ]
    },
    {
        id: 'POL002567',
        pdfFiles: [
            { name: 'Policy Document', fileName: 'POL002567_Policy_Document.pdf', size: '3.1 MB', date: '22-02-2025', type: "pdf" },
            { name: 'Property Valuation', fileName: 'POL002567_Property_Valuation.tiff', size: '2.7 MB', date: '18-02-2025', type: "tiff" },
            { name: 'Premium Schedule', fileName: 'POL002567_Premium_Schedule.tiff', size: '612 KB', date: '12-02-2025', type: "tiff" },
            { name: 'Claim History', fileName: 'POL002567_Claim_History.pdf', size: '890 KB', date: '24-04-2025', type: "pdf" }
        ]
    },
    {
        id: 'POL003890',
        pdfFiles: [
            { name: 'Policy Application', fileName: 'POL003890_Policy_Application.tiff', size: '1.9 MB', date: '03-03-2025', type: "tiff" },
            { name: 'Medical Report', fileName: 'POL003890_Medical_Report.pdf', size: '4.2 MB', date: '20-05-2025', type: "pdf" },
            { name: 'Beneficiary Details', fileName: 'POL003890_Beneficiary_Details.pdf', size: '723 KB', date: '14-03-2025', type: "pdf" }
        ]
    }
];

const PolicySearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPolicies = samplePolicies.filter(policy =>
        policy.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        PolicyFinder
                    </h1>
                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        Search and manage your insurance policies with ease. Enter your policy number or details below.
                    </p>
                </div>

                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {searchTerm && (
                    filteredPolicies.length > 0
                        ? <PolicyPdfList policies={filteredPolicies} searchTerm={searchTerm} />
                        : <EmptyList />
                )}
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

export { PolicySearchPage };