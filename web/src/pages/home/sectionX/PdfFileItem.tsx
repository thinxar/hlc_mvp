import { CiCalendar, CiHardDrive } from 'react-icons/ci';
import { FaFile } from 'react-icons/fa6';

const PdfFileItem = ({ file, isSelected, onClick }: any) => {
    const getFileTypeColor = (type: any) =>
        type === 'pdf' ? 'text-red-400' : 'text-blue-400';

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${isSelected
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
        >
            <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-white/10 ${getFileTypeColor(file.type)}`}>
                    <FaFile className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{file.name}</h3>
                    <p className="text-sm text-white/60 truncate">{file.fileName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-white/50">
                        <span className="flex items-center space-x-1">
                            <CiHardDrive className="w-3 h-3" />
                            <span>{file.size}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <CiCalendar className="w-3 h-3" />
                            <span>{file.date}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { PdfFileItem };