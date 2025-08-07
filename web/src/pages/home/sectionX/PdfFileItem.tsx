import { CiCalendar, CiHardDrive } from 'react-icons/ci';
import Pdf from '../../../../public/images/pdf.png'
import Tiff from '../../../../public/images/tiff.png'
import Image from '../../../../public/images/image.png'

const PdfFileItem = ({ file, isSelected, onClick }: any) => {
    // const navigate = useNavigate();

    // const getFileTypeColor = (type: any) =>
    //     type === 'pdf' ? 'text-red-400' : 'text-blue-400';

    // const handleNavigate = () => {
    // if (file.type === 'pdf')
    //     navigate('/app/pdfViewer')
    // else
    //     navigate('/app/tiffViewer')
    // }

    const getFileTypeColor = (type: any) => {
        return <>{type === 'pdf' ? <img src={Pdf} className='w-7 h-7' /> : type === 'tiff' ? <img src={Tiff} className='w-8 h-8' />
            : <img src={Image} className='w-7 h-7' />}</>
    }

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl transition-all duration-400 ease-in border-l-[10px] 
                  ${isSelected
                    ? 'bg-slate-100 shadow-lg border-yellow-400'
                    : 'bg-white/92 hover:border-white/20 hover:bg-white/80 border-transparent'
                }
                  `}>
            <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-white/10`}>
                    {getFileTypeColor(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className='flex items-center justify-between'>
                        <h3 className="font-semibold text-black truncate">{file.name}</h3>
                        {/* <div className='text-gray-500' onClick={handleNavigate}>
                            <Tooltip label="Open With New Window">
                                <CiMenuKebab className="w-3 h-3" />
                            </Tooltip></div> */}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{file.fileName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
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