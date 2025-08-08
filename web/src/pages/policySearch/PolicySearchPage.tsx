import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceEndpoint } from '../../config/ServiceEndpoint';
import { handleError } from '../../wire/ErrorHandler';
import { useFormstore } from '../../wire/StoreFactory';
import { PolicyList } from './section/PolicyList';
import { SearchBar } from './section/SearchBar';
import { EmptyList } from './section/EmptyList';

interface PolicyFile {
    id: string;
    pdfFiles: {
        name: string;
        fileName: string;
        size: number;
        date: string;
        type: string;
        path: string;
    };
}

const PolicySearchPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<PolicyFile[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [_showError, setShowError] = useState(false);

    const handleSearch = () => {
        setShowError(false)
        setHasSearched(true);
        if (!searchTerm.trim()) {
            setData([]);
            return;
        }
        const endpoint = ServiceEndpoint.policy.searchPolicyApi;

        useFormstore(endpoint).query({ filter: { "policyNumber": searchTerm } }).then((d) => {
            if (d.result.length == 1) {
                navigate(`/app/policy/${d?.result[0]?.id}`)
            }
            setData(d.result);
        }).catch(() => {
            handleError
            setShowError(true);
        });
    };    

    return (
        <div className="min-h-[calc(100vh-41px)] bg-gradient-to-br bColor relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            <div className="relative z-10 p-4">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white bg-clip-text">
                        PolicyFinder
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Search and manage insurance policies
                    </p>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch}
                    setHasSearched={setSearchTerm} setData={setData} setNotFound={setShowError} />
                {searchTerm && data.length != 1 && data.length != 0 && <PolicyList data={data} />}
                {data.length == 0 && <EmptyList hasSearched={hasSearched} searchQuery={searchTerm} />}
            </div>
        </div>
    );
};

export { PolicySearchPage };