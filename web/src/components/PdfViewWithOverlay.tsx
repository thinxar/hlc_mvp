import { Loader } from '@mantine/core';
import { PDFDocument } from 'pdf-lib';
import { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa6';

interface Props {
  pdfUrlFromApi: string;
  imageUrlFromApi: string;
  pageIndex: number;
  position: { x: number; y: number };
  scale?: number;
}

const PdfViewWithOverlay = ({
  pdfUrlFromApi,
  imageUrlFromApi,
  pageIndex,
  position,
  scale = 0.5,
}: Props) => {
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

        if (pageIndex < 0 || pageIndex >= pages.length) {
          throw new Error(`Invalid page index. PDF has ${pages.length} pages.`);
        }

        const targetPage = pages[pageIndex];

        const imageBytes = await fetch(imageUrlFromApi).then(res => {
          if (!res.ok) throw new Error("Failed to fetch image");
          return res.arrayBuffer();
        });

        const imageExtension = imageUrlFromApi.split('.').pop()?.toLowerCase();
        let embeddedImage;

        if (imageExtension === 'jpg' || imageExtension === 'jpeg') {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else if (imageExtension === 'png') {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          throw new Error(`Unsupported image format: ${imageExtension}`);
        }

        const imgDims = embeddedImage.scale(scale);

        targetPage.drawImage(embeddedImage, {
          x: position.x,
          y: position.y,
          width: imgDims.width,
          height: imgDims.height,
        });

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
      <div className="flex justify-end p-4">
        {pdfBlob && (
          <a
            href={URL.createObjectURL(pdfBlob)}
            download="overlayed-document.pdf"
          >
            <button
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200">
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
              className="w-full min-h-[calc(100vh-100px)] border-0"
            // style={{ minHeight: '600px' }}
            />
          </div>
        </div>
      ) : <div>
        <div className="flex flex-col items-center justify-center min-h-100 text-black">
          <Loader type="bars" color="violet" />
          <div className="mt-2 font-semibold text-lg">Loading...</div>
        </div>

      </div>}

    </div>
  );
};

export { PdfViewWithOverlay };
