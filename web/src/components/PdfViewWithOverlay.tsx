import { Loader } from '@mantine/core';
import { PDFDocument } from 'pdf-lib';
import { useEffect, useState } from 'react';
import { FaDownLong } from 'react-icons/fa6';

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

  useEffect(() => {
    const generatePdf = async () => {
      setPdfUrl(null);

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
      } catch (err) {
        console.error("Error in generatePdf():", err);
      }
    };

    generatePdf();
  }, [pdfUrlFromApi, imageUrlFromApi, pageIndex, position, scale]);

  return (
    <div className="max-w-4xl mx-auto p-5 min-h-screen">
      {pdfUrl ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-800">Enhanced PDF Document</span>
            </div>
            <a href={pdfUrl} download="endorsed-document.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <div className="w-4 h-4" />
              <FaDownLong /> Download PDF
            </a>
          </div>

          <div className="relative">
            <iframe id='pdf_frame'
              src={pdfUrl}
              title="Enhanced PDF Document"
              className="w-full h-[700px] border-0"
              style={{ minHeight: '600px' }}
            />
          </div>
        </div>
      ) : <div>
        <div className='grid place-items-center h-100 text-white'>
          <div className='flex-row'><Loader color="white" type="bars" />
          <div className='mt-2'>Loading...</div></div>
        </div>
      </div>}
    </div>
  );
};

export { PdfViewWithOverlay };