import { FaRegFileLines } from "react-icons/fa6";

const EmptyList = () => (
    <div className="text-center py-12">
        <div className="text-white/40 mb-4">
            <FaRegFileLines className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-semibold text-white/80 mb-2">No policy documents found</h3>
        <p className="text-white/60">Try searching with a different policy number.</p>
    </div>
);

export { EmptyList };