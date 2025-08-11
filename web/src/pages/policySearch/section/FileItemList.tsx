import { Tooltip } from '@mantine/core';
import { StringFormat } from '@palmyralabs/ts-utils';
import { BiLinkExternal } from 'react-icons/bi';
import { CiCalendar, CiHardDrive } from 'react-icons/ci';
import Image from '../../../../public/images/image.png';
import Pdf from '../../../../public/images/pdf.png';
import Tiff from '../../../../public/images/tiff.png';
import { ServiceEndpoint } from '../../../config/ServiceEndpoint';

const FileItemList = ({ file, isSelected, onClick, policyId }: any) => {
    const BASE_URL = `${window.location.origin}/api/palmyra`;
    const endPoint = StringFormat(ServiceEndpoint.policy.getFileApi, { policyId: policyId, fileId: file?.pdfFiles?.id });
    const fileUrl = BASE_URL + endPoint;

    const handleNavigate = () => {
        window.open(fileUrl, '_blank');
    }

    const getFileType = (type: any) => {
        return <>{type === 'application/pdf' ? <img src={Pdf} className='w-7 h-7' /> : type === 'image/tiff' ? <img src={Tiff} className='w-8 h-8' />
            : <img src={Image} className='w-7 h-7' />}</>
    }

    return (
        <div onClick={onClick} className={`cursor-pointer p-2 rounded-xl transition-all duration-400 ease-in border-l-[10px] 
                min-h-[65px] ${isSelected
                ? 'bg-slate-100 shadow-lg border-yellow-400'
                : 'bg-white/92 hover:border-white/20 hover:bg-white/80 border-transparent'
            }`}>
            <div className="flex items-start space-x-1">
                <div className={`p-1 rounded-lg bg-white/10`}>
                    {getFileType(file.pdfFiles?.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className='flex items-center justify-between'>
                        <h3 className="font-semibold text-black truncate">{file?.pdfFiles?.fileName}</h3>
                        <div className="text-gray-500 cursor-pointer"
                            onClick={handleNavigate}>
                            <Tooltip label="Open in new window">
                                <BiLinkExternal className="w-4 h-4" />
                            </Tooltip>
                        </div>
                    </div>
                    {/* <p className="text-sm text-gray-600 truncate">{file?.pdfFiles?.fileName}</p> */}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {file.pdfFiles?.size && <span className="flex items-center space-x-1">
                            <CiHardDrive className="w-3 h-3" />
                            {file.pdfFiles?.size < 1024 * 1024
                                ? `${(file.pdfFiles?.size / 1024).toFixed(2)} KB`
                                : `${(file.pdfFiles?.size / 1024 / 1024).toFixed(2)} MB`}
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

export { FileItemList };