import { IoChevronBackOutline } from 'react-icons/io5';
import { SearchBar } from './section/SearchBar';
import { PdfFileItem } from './section/PdfFileItem';
import { MemoizedPdfViewer } from './section/MemoizedPdfViewer';

interface IPolicyOptions {
    data: any[];
    searchTerm: string;
    setSearchTerm: any;
    selectedFile: any;
    setSelectedFile: any;
    onSearch: () => void;
    onBack: () => void;
}

const PolicyResultView = (props: IPolicyOptions) => {
    const { data, searchTerm, setSearchTerm, selectedFile, setSelectedFile, onSearch, onBack } = props
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[30%_70%] lg:grid-cols-[20%_80%] xl:grid-cols-[20%_80%] 2xl:grid-cols-[20%_80%] transition-all duration-300 ease-in-out gap-4 px-5 mx-auto w-full h-[calc(98vh-30px)]">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 flex flex-col overflow-auto">
                <div className="flex items-center gap-1.5 mb-4">
                    <IoChevronBackOutline onClick={onBack} className="text-slate-300 cursor-pointer" />
                    <div className="text-lg font-bold text-slate-300">Policy Number:</div>
                    <div className="text-xl text-slate-100 font-semibold">{data[0].id}</div>
                </div>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={onSearch}
                    compact
                />
                <div className="space-y-3 overflow-y-auto">
                    {data.map((file: any, idx: number) => (
                        <PdfFileItem
                            key={idx}
                            file={file}
                            isSelected={selectedFile?.fileName === file?.fileName}
                            onClick={() => setSelectedFile(file)}
                        />
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col overflow-auto">
                <MemoizedPdfViewer file={selectedFile} />
            </div>
        </div>
    );
}
export { PolicyResultView };