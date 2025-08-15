import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceEndpoint } from 'config/ServiceEndpoint';
import { handleError } from 'wire/ErrorHandler';
import { useFormstore } from 'wire/StoreFactory';
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
    const [data, setData] = useState<PolicyFile[] | null>(null);

    const handleSearch = (searchTerm: string) => {
        const endpoint = ServiceEndpoint.policy.searchPolicyApi;

        useFormstore(endpoint).query({ filter: { "policyNumber": searchTerm } }).then((d) => {
            if (d.result.length == 1) {
                navigate(`/app/policy/${d?.result[0]?.id}`, { state: { policyData: d?.result[0] } })
            } else
                setData(d.result);
        }).catch(handleError);
    };


    const handleClear = () => {
        setData(null);
    }

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
                <SearchBar onSearch={handleSearch}
                    onClear={handleClear} compact={false} />
                {data && data?.length > 1 ?
                    <PolicyList data={data} /> :
                    <EmptyList data={data} />}

            </div>
        </div>
    );
};

export { PolicySearchPage };