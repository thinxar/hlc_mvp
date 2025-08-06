import { CiSearch } from 'react-icons/ci';

const EmptyList = ({ hasSearched, searchQuery }: any) => {
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

export { EmptyList };