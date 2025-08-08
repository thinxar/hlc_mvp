import { StringFormat } from '@palmyralabs/ts-utils';
import { useState } from 'react';
import { ServiceEndpoint } from '../../config/ServiceEndpoint';
import { useFormstore } from '../../wire/StoreFactory';
import { PolicyResultView } from './PolicyResultView';
import { EmptyList } from './section/EmptyList';
import { SearchBar } from './section/SearchBar';
import { handleError } from '../../wire/ErrorHandler';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFile, setSelectedFile] = useState<PolicyFile | null>(null);
    const [data, setData] = useState<PolicyFile[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {

        setHasSearched(true);
        if (!searchTerm.trim()) {
            setData([]);
            return;
        }

        const endpoint = StringFormat(ServiceEndpoint.policy.searchPolicyApi, {
            policyNumber: searchTerm
        });

        useFormstore(endpoint).get({}).then((d) => {
            const mappedPolicies: any = d.map((item: any) => ({
                id: item.policyId?.policyNumber,
                pdfFiles: {
                    name: item.name,
                    fileName: item.fileName,
                    size: item.fileSize,
                    date: item.date,
                    type: item.fileType,
                    path: item.path || ''
                }
            }));
            setData(mappedPolicies);
            setSelectedFile(null);
        }).catch(handleError);
    };

    return (
        <div className="min-h-[calc(100vh-45px)] bg-gradient-to-br bColor relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            <div className="relative z-10 p-4">
                {data.length > 0 ? (
                    <PolicyResultView
                        data={data}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        onSearch={handleSearch}
                        onBack={() => setData([])}
                    />
                ) : (
                    <>
                        <div className="text-center mb-8 animate-fade-in">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white bg-clip-text">
                                PolicyFinder
                            </h1>
                            <p className="text-lg text-white/70 max-w-2xl mx-auto">
                                Search and manage insurance policies
                            </p>
                        </div>
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} setHasSearched={setSearchTerm} />
                        <EmptyList hasSearched={hasSearched} searchQuery={searchTerm} />
                    </>
                )}
            </div>
        </div>
    );
};

export { PolicySearchPage };