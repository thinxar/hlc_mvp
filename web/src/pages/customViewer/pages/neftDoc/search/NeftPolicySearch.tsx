import { useState } from 'react';
import { NeftSearchBar } from './NeftSearchBar';

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

interface IOptions {
    onChange: (d: any) => void
}

const NeftPolicySearch = (props: IOptions) => {
    const { onChange } = props;
    const [_data, setData] = useState<PolicyFile[] | null>(null);

    const handleSearch = (searchTerm: string) => {
        onChange({ policy: searchTerm })
    };


    const handleClear = () => {
        setData(null);
    }

    return (
        <div className="bg-linear-to-br bColor relative">
            <div className="relative z-10 p-2">
                <NeftSearchBar onSearch={handleSearch}
                    onClear={handleClear} compact={true} />
                {/* {data && data?.length > 1 ?
                    <></> :
                    <EmptyList data={data} />} */}
            </div>
        </div>
    );
};

export { NeftPolicySearch };

