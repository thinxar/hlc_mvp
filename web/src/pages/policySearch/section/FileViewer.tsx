import { FaFile } from 'react-icons/fa6';
import { ImageViewer } from '../../../components/viewer/ImageViewer';
import { PdfViewWithOverlay } from '../../../components/viewer/PdfViewWithOverlay';
import { TIFFViewer } from '../../../components/viewer/TiffViewWithOverlay';
import { IoClose } from 'react-icons/io5';
import { useState } from 'react';

interface FileProps {
    file: any
    fileUrl: string
    key: number
}

const FileViewer = ({ fileUrl, key, file }: FileProps) => {
    const [fileData, setFileData] = useState(file);

    // const overlays = [
    //     { page: 1, imageUrl: '/images/licseal.jpg', x: 100, y: 150, width: 100, height: 100 },
    //     { page: 2, imageUrl: '/images/licseal.jpg', x: 100, y: 100, width: 250, height: 250 }
    // ];

    return (<>
        {fileData ? <div className="h-auto overflow-hidden" key={key}>
            <div className="p-2 flex justify-between">
                <div></div>
                <IoClose fontSize={20} className='text-white cursor-pointer hover:bg-white/20' onClick={() => { setFileData(null) }} />
            </div>
            <div className="p-3">
                <div className="h-[calc(100vh-115px)] bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                    {fileData?.pdfFiles?.type === 'application/pdf' ? (
                        <PdfViewWithOverlay
                            pdfUrlFromApi={fileUrl}
                            imageUrlFromApi={[]}
                            pageIndex={[]}
                            position={{ x: 0, y: 0 }}
                            scale={0.7}
                            file={fileData}
                        />
                    ) : fileData.pdfFiles?.type === 'image/tiff' ? (
                        <TIFFViewer
                            // overlays={overlays}
                            tiff={fileUrl}
                            lang="tr"
                            paginate="ltr"
                            buttonColor="#141414"
                            file={fileData}
                        />
                    ) : (
                        <ImageViewer endPoint={fileUrl} file={fileData} />
                    )}
                </div>
            </div>
        </div>
            : <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                    <FaFile className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">Select a document to view</p>
                    <p className="text-sm mt-2">Choose a PDF or TIFF file from the list on the left</p>
                </div>
            </div>
        }
    </>
    );
};

export { FileViewer };