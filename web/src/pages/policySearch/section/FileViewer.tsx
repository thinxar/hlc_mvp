import { ImageViewer } from 'components/viewer/ImageViewer';
import { useState } from 'react';
import { FaFile } from 'react-icons/fa6';
import { PDFViewerWithOverlay } from 'components/viewer/PdfViewWithOverlay';
import { TIFFViewer } from 'components/viewer/TiffViewWithOverlay';
import { TextHtmlViewer } from 'components/viewer/TextHtmlViewer';
import { useParams } from 'react-router-dom';
import { StringFormat } from '@palmyralabs/ts-utils';
import { ServiceEndpoint } from 'config/ServiceEndpoint';

interface FileProps {
    file: any
    fileUrl: string
    key: number,
    selectedStamp?: any,
    stampData: any,
    setSelectedFile: any
    setSelectedStamp?: any
    selectedfile?: any,
    setSelectedStamps?: any
    handleFetch?: () => void
}

const FileViewer = ({ fileUrl, key, file, selectedStamp, stampData, setSelectedFile, setSelectedStamp, setSelectedStamps, handleFetch }: FileProps) => {
    const [fileData, _setFileData] = useState(file);
    const params = useParams();

    const uploadStampEndPoint = StringFormat(
        ServiceEndpoint.policy.stamp.stampUploadApi,
        {
            policyId: params?.policyId,
            docketTypeId: file?.docketType?.id,
        }
    );

    return (<>
        {fileData ? <div className="h-auto overflow-hidden" key={key}>
            <div className="p-">
                <div className="h-[calc(100vh-115px)] bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                    {fileData?.fileType === 'application/pdf' ? (
                        <PDFViewerWithOverlay selectedStamp={selectedStamp} pdfUrlFromApi={fileUrl} file={fileData} overlays={stampData}
                            setSelectedFile={setSelectedFile} setSelectedStamp={setSelectedStamp} setSelectedStamps={setSelectedStamps} handleFetch={handleFetch}
                            uploadStampEndPoint={uploadStampEndPoint} />
                    ) : fileData?.fileType === 'image/tiff' ? (
                        <TIFFViewer
                            overlays={stampData}
                            tiff={fileUrl}
                            file={fileData}
                            selectedStamp={selectedStamp}
                            stampData={stampData}
                            setSelectedStamp={setSelectedStamp}
                            setSelectedFile={setSelectedFile}
                            uploadStampEndPoint={uploadStampEndPoint}
                            handleFetch={handleFetch}
                        />
                    ) : fileData?.fileType === 'text/plain' || fileData?.fileType === 'text/html' ? (
                        <TextHtmlViewer endPoint={fileUrl} file={fileData} selectedStamp={selectedStamp} overlays={stampData}
                            uploadStampEndPoint={uploadStampEndPoint} setSelectedStamp={setSelectedStamp} setSelectedFile={setSelectedFile}
                            handleFetch={handleFetch} />
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