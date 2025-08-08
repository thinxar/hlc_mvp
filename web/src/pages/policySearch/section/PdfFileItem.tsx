import { Tooltip } from '@mantine/core';
import { BiLinkExternal } from 'react-icons/bi';
import { CiCalendar, CiHardDrive } from 'react-icons/ci';
import Image from '../../../../public/images/image.png';
import Pdf from '../../../../public/images/pdf.png';
import Tiff from '../../../../public/images/tiff.png';

const PdfFileItem = ({ file, isSelected, onClick, fileUrl }: any) => {

    // const getFileTypeColor = (type: any) =>
    //     type === 'pdf' ? 'text-red-400' : 'text-blue-400';
    console.log(fileUrl, 'file')
    const handleNavigate = () => {
        // if (file?.pdfFiles?.type === 'pdf')
        //     // navigate('/app/pdfViewer')
        //     window.open(fileUrl, '_blank');
        // else if (file?.pdfFiles?.type === 'tiff')
        //     navigate('/app/tiffViewer')
        // else
        //     navigate('/app/imageViewer')

        window.open(fileUrl, '_blank');
    }

    const getFileTypeColor = (type: any) => {
        return <>{type === 'pdf' ? <img src={Pdf} className='w-7 h-7' /> : type === 'tiff' ? <img src={Tiff} className='w-8 h-8' />
            : <img src={Image} className='w-7 h-7' />}</>
    }

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-2 rounded-xl transition-all duration-400 ease-in border-l-[10px] 
                min-h-[65px]
                  ${isSelected
                    ? 'bg-slate-100 shadow-lg border-yellow-400'
                    : 'bg-white/92 hover:border-white/20 hover:bg-white/80 border-transparent'
                }
                  `}>
            <div className="flex items-start space-x-1">
                <div className={`p-1 rounded-lg bg-white/10`}>
                    {getFileTypeColor(file.pdfFiles?.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className='flex items-center justify-between'>
                        <h3 className="font-semibold text-black truncate">{file?.pdfFiles?.fileName}</h3>
                        <div
                            className="text-gray-500 cursor-pointer"
                            onClick={handleNavigate}
                        >
                            <Tooltip label="Open in new window">
                                <BiLinkExternal className="w-4 h-4" />
                            </Tooltip>
                        </div>
                    </div>
                    {/* <p className="text-sm text-gray-600 truncate">{file?.pdfFiles?.fileName}</p> */}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {file.pdfFiles?.size && <span className="flex items-center space-x-1">
                            <CiHardDrive className="w-3 h-3" />
                            <span>{file.pdfFiles?.size} MB</span>
                        </span>}
                        {file.pdfFiles?.date && <span className="flex items-center space-x-1">
                            <CiCalendar className="w-3 h-3" />
                            <span>{file.date}</span>
                        </span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { PdfFileItem };

