import { FiFileText } from 'react-icons/fi'

interface IOptions {
    fileName: string
}
const PolicyViewHeader = (props: IOptions) => {
    const { fileName } = props;
    return (
        <div>
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <FiFileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">
                            {fileName ? fileName : 'Select a document'}</h3>
                        <p className="text-[11px] text-gray-500">Document Preview Mode</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PolicyViewHeader }

