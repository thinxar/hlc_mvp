import { Loader } from '@mantine/core';
import { PDFDocument } from 'pdf-lib';
import { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa6';

interface Props {
  pdfUrlFromApi: string;
  imageUrlFromApi: any[] | any;
  pageIndex: any[] | any;
  position: { x: number; y: number };
  scale?: number;
  file?: any
}

const PdfViewWithOverlay = ({ pdfUrlFromApi, imageUrlFromApi, pageIndex, position, scale = 0.5, file }: Props) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      setPdfUrl(null);
      setPdfBlob(null);

      try {
        const existingPdfBytes = await fetch(pdfUrlFromApi).then(res => {
          if (!res.ok) throw new Error("Failed to fetch PDF");
          return res.arrayBuffer();
        });

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();

        if (imageUrlFromApi.length !== pageIndex.length) {
          throw new Error("imageUrlFromApi and pageIndex must have the same length");
        }

        for (let i = 0; i < imageUrlFromApi.length; i++) {
          const url = imageUrlFromApi[i];
          const index = pageIndex[i];

          if (index < 0 || index >= pages.length) {
            throw new Error(`Invalid page index ${index}. PDF has ${pages.length} pages.`);
          }

          const imageBytes = await fetch(url).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch image from ${url}`);
            return res.arrayBuffer();
          });

          const imageExtension = url.split('.').pop()?.toLowerCase();
          let embeddedImage;

          if (imageExtension === 'jpg' || imageExtension === 'jpeg') {
            embeddedImage = await pdfDoc.embedJpg(imageBytes);
          } else if (imageExtension === 'png') {
            embeddedImage = await pdfDoc.embedPng(imageBytes);
          } else {
            throw new Error(`Unsupported image format: ${imageExtension}`);
          }

          const imgDims = embeddedImage.scale(scale);
          const targetPage = pages[index];

          targetPage.drawImage(embeddedImage, {
            x: position.x,
            y: position.y,
            width: imgDims.width,
            height: imgDims.height,
          });
        }
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        setPdfUrl(blobUrl);
        setPdfBlob(blob);
      } catch (err) {
        console.error("Error in generatePdf():", err);
      }
    };

    generatePdf();
  }, [pdfUrlFromApi, imageUrlFromApi, pageIndex, position, scale]);

  return (
    <div className="mx-auto p-5 w-full h-full">
      <div className="flex justify-between p-4">
        <div className="text-lg font-semibold">{file?.pdfFiles?.fileName}</div>
        {pdfBlob && (
          <a href={URL.createObjectURL(pdfBlob)} download={file?.pdfFiles?.fileName}>
            <button className="cursor-pointer text-white bg-sky-800 px-4 py-2 rounded-lg flex items-center
              space-x-2 transition duration-200">
              <FaDownload className="w-4 h-4" />
              <span>Download</span>
            </button>
          </a>
        )}
      </div>
      {pdfUrl != null ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="relative">
            <iframe id='pdf_frame'
              src={pdfUrl}
              title="Enhanced PDF Document"
              className="w-full min-h-[calc(100vh-100px)] border-0 pb-22"
            />
          </div>
        </div>
      ) : <div>
        <div className="flex flex-col items-center justify-center min-h-100 text-black">
          <Loader type="bars" color="blue" />
          <div className="mt-2 font-semibold text-lg">Loading...</div>
        </div>

      </div>}

    </div>
  );
};

export { PdfViewWithOverlay };