import { CiSearch } from "react-icons/ci";
import { MdClear } from "react-icons/md";

const SearchBar = ({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: (val: string) => void }) => (
    <div className="w-full max-w-2xl mb-16 animate-slide-up">
        <div className="relative">
            <CiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/40 w-6 h-6 z-20" />
            <input
                type="text"
                placeholder="Search by policy number (e.g., POLXXXXXX)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-6 text-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
            />
            {searchTerm &&
                <MdClear className="absolute right-6 cursor-pointer top-1/2 transform -translate-y-1/2 text-white/40 w-6 h-6 z-20"
                    onClick={() => setSearchTerm('')} />}
        </div>
    </div>
);

export { SearchBar };