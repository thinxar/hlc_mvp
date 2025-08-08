import { useState } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { EmptyList } from './sectionX/EmptyList';
import { MemoizedPdfViewer } from './sectionX/MemoizedPdfViewer';
import { PdfFileItem } from './sectionX/PdfFileItem';
import { SearchBar } from './sectionX/SearchBar';
import { useFormstore } from '../../wire/StoreFactory';
import { StringFormat } from '@palmyralabs/ts-utils';
import { ServiceEndpoint } from '../../config/ServiceEndpoint';

const PolicySearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [data, setData] = useState<any>([]);

    const searchPolicyEndpoint = StringFormat(ServiceEndpoint.policy.searchPolicyApi, { policyNumber: searchTerm });

    const handleSearch = () => {
        setHasSearched(true);
        setSelectedFile(null);
        useFormstore(searchPolicyEndpoint).get({}).then((d) => {
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
        });
        if(!searchTerm){
             setData([]);
        }
    };

    return (
        <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br bColor relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            <div className="relative z-10 p-4">
                {hasSearched && data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[30%_70%] lg:grid-cols-[20%_80%] xl:grid-cols-[20%_80%] 2xl:grid-cols-[20%_80%] transition-all duration-300 ease-in-out gap-4 px-5 mx-auto w-full h-[calc(98vh-30px)]">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 flex flex-col overflow-auto">
                            <div className="flex items-center gap-1.5 mb-4">
                                <IoChevronBackOutline onClick={() => { setHasSearched(false) }}
                                    className='text-slate-300 cursor-pointer' />
                                <div className='text-lg font-bold text-slate-300'>
                                    Policy Number:</div>
                                <div className='text-xl text-slate-100 font-semibold'>{data[0].id}</div></div>
                            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} compact={true} />
                            <div className="space-y-3 overflow-y-auto">
                                {data.map((file: any, idx:number) => (
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
                                Search and manage insurance policies
                            </p>
                        </div>
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} setHasSearched={setHasSearched} />
                        <EmptyList hasSearched={hasSearched} searchQuery={searchTerm} />
                    </>
                )}
            </div>
        </div>
    );
};

export { PolicySearchPage };