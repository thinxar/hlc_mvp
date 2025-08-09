import { FaFile } from 'react-icons/fa6';
import { PdfViewWithOverlay } from '../../../components/PdfViewWithOverlay';
import { TIFFViewer } from '../../../components/TiffViewWithOverlay';
import { ImageViewer } from '../../../components/ImageViewer';

const FileViewer = ({ file, fileUrl }: any) => {

    if (!file) {
        return (
            <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                    <FaFile className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">Select a document to view</p>
                    <p className="text-sm mt-2">Choose a PDF or TIFF file from the list on the left</p>
                </div>
            </div>
        );
    }

    const overlays = [
        { page: 1, imageUrl: '/images/licseal.jpg', x: 100, y: 150, width: 100, height: 100 },
        { page: 2, imageUrl: '/images/licseal.jpg', x: 100, y: 100, width: 250, height: 250 }
    ];

    return (
        <div className="h-auto overflow-hidden">
            <div className="p-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-white">{file.name}</h3>
                        <p className="text-sm text-white/60">{file.fileName}</p>
                    </div>
                </div>
            </div>
            <div className="p-3">
                <div className="h-[calc(100vh-90px)] bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                    {file?.pdfFiles?.type === 'pdf' ? (
                        <PdfViewWithOverlay
                            pdfUrlFromApi={fileUrl}
                            imageUrlFromApi={[]}
                            pageIndex={[]}
                            position={{ x: 0, y: 0 }}
                            scale={0.7}
                            file={file}
                        />
                    ) : file.pdfFiles?.type === 'tiff' ? (
                        <TIFFViewer
                            overlays={overlays}
                            tiff={fileUrl}
                            lang="tr"
                            paginate="ltr"
                            buttonColor="#141414"
                            file={file}
                        />
                    ) : (
                        <ImageViewer endPoint={fileUrl} file={file} />
                    )}
                </div>
            </div>
        </div>
    );
};

export { FileViewer };