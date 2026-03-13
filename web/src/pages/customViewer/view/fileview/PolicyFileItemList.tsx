import { Badge } from '@mantine/core';
import { FiCheckCircle, FiChevronRight } from 'react-icons/fi';

interface FileProps {
    file: any
    isSelected: boolean,
    onClick: () => void,
    policyId: any
    handleFileSelect: () => void
    selectedFile: any
    type: "REV" | "AND" | "PBV"
}

const PolicyFileItemList = ({ file, type, isSelected, onClick, handleFileSelect, selectedFile }: FileProps) => {

    return (
        <div className="space-y-2">
            <div
                key={file.id}
                onClick={onClick}
                className={`
                      p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group
                      ${selectedFile?.pdfFiles?.id == file?.pdfFiles?.id ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-gray-300 bg-white'}
                    `}
            >
                {type === 'REV' &&
                    <Checkbox
                        checked={isSelected}
                        onChange={(e: any) => {
                            e.stopPropagation();
                            handleFileSelect();
                        }}
                    />}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{file?.pdfFiles?.fileName}</p>
                    <div className='flex items-center gap-3'>
                        <p className="text-[10px] text-gray-500 uppercase">{file?.pdfFiles?.fileType} •
                            {file.pdfFiles?.size < 1024 * 1024
                                ? `${(file.pdfFiles?.size / 1024).toFixed(2)} KB`
                                : `${(file.pdfFiles?.size / 1024 / 1024).toFixed(2)} MB`}</p>
                        <Badge
                            className={
                                file?.pdfFiles?.status === 'approved'
                                    ? "bg-green-50! border border-green-500! text-green-700!"
                                    : file?.pdfFiles?.status === 'rejected'
                                        ? "bg-red-50! border border-red-500! text-red-700!"
                                        : "bg-yellow-50! border border-yellow-500! text-yellow-700!"

                            } size='xs'
                        >
                            {file?.pdfFiles?.status}
                        </Badge></div>
                </div>
                <FiChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${isSelected ? 'translate-x-1 text-blue-500' : ''}`} />
            </div>
        </div>
    );
};

export { PolicyFileItemList };



function Checkbox({ checked, onChange }: { checked: boolean, onChange: (e: any) => void }) {
    return (
        <button
            type="button"
            onClick={(e: any) => onChange(e)}
            className={`
        w-5 h-5 rounded border transition-all flex items-center justify-center
        ${checked
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 hover:border-blue-400'}
      `}
        >
            {checked && <FiCheckCircle className="w-3.5 h-3.5" />}
        </button>
    );
}