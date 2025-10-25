import { CiSearch } from 'react-icons/ci';

const EmptyList = ({ data }: any) => {
    const hasSearched = null != data;

    if (!hasSearched) {
        return (
            <div className="text-center text-gray/60 py-20">
                <CiSearch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Search for connection documents</h3>
                <p>Enter a connection number and click search to view available documents</p>
            </div>
        );
    }

    return (
        <div className="text-center text-gray/60 py-20">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No connection documents Found</h3>
            <p>No connection documents found.</p>
            <p className="text-sm mt-2 text-white/50">Try entering a different connection number</p>
        </div>
    );
};

export { EmptyList };