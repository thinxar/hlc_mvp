import { ImageViewer } from 'components/viewer/ImageViewer';
import { useState } from 'react';
import { FaFile } from 'react-icons/fa6';
import { PDFViewerWithOverlay } from 'components/viewer/PdfViewWithOverlay';
import { TIFFViewer } from 'components/viewer/TiffViewWithOverlay';
import { TextHtmlViewer } from 'components/viewer/TextHtmlViewer';

interface FileProps {
    file: any
    fileUrl: string
    key: number,
    selectedStamp?: any,
    stampData: any,
    setSelectedFile: any
    setSelectedStamp?: any
}

const FileViewer = ({ fileUrl, key, file, selectedStamp, stampData, setSelectedFile, setSelectedStamp }: FileProps) => {
    const [fileData, _setFileData] = useState(file);

    // const overlays = [
    //     { page: 1, imageUrl: img, x: 40, y: 700, width: 100, height: 100, id: file?.id }
    // ]

    return (<>
        {fileData ? <div className="h-auto overflow-hidden" key={key}>
            <div className="p-">
                <div className="h-[calc(100vh-115px)] bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                    {fileData?.fileType === 'application/pdf' ? (
                        // <PdfViewWithOverlay
                        //     pdfUrlFromApi={fileUrl}
                        //     imageUrlFromApi={selectedStamp ? overlays : []}
                        //     pageIndex={selectedStamp ? overlays : []}
                        //     position={{ x: 100, y: 400    }}
                        //     scale={0.1}
                        //     file={fileData}
                        // // selectedStamp={selectedStamp} // You already pass this prop!
                        // />
                        <PDFViewerWithOverlay selectedStamp={selectedStamp} pdfUrlFromApi={fileUrl} file={fileData} overlays={stampData}
                            setSelectedFile={setSelectedFile} setSelectedStamp={setSelectedStamp} />
                    ) : fileData?.fileType === 'image/tiff' ? (
                        <TIFFViewer
                            overlays={stampData}
                            tiff={fileUrl}
                            // lang="tr"
                            // paginate="ltr"
                            // buttonColor="#141414"
                            file={fileData}
                            selectedStamp={selectedStamp}
                            stampData={stampData}
                        />
                    ) : fileData?.fileType === 'text/plain' || fileData?.fileType === 'text/html' ? (
                        <TextHtmlViewer endPoint={fileUrl} file={fileData} selectedStamp={selectedStamp} overlays={stampData} />
                    ) : <> <ImageViewer endPoint={fileUrl} file={fileData} /></>}
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

