import { Button, Loader } from '@mantine/core';
import { PDFDocument } from 'pdf-lib';
import { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa6';
import { toast } from 'react-toastify';

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
  const [loading, setLoading] = useState(false);
  // const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      setPdfUrl(null);
      // setPdfBlob(null);

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
        // setPdfBlob(blob);
      } catch (err) {
        console.error("Error in generatePdf():", err);
      }
    };

    generatePdf();
  }, [pdfUrlFromApi, imageUrlFromApi, pageIndex, position, scale]);

  const handleDownload = async () => {
    setLoading(true);

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
          throw new Error(`Invalid page index ${index}`);
        }

        const imageBytes = await fetch(url).then(res => {
          if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
          return res.arrayBuffer();
        });

        const ext = url.split('.').pop()?.toLowerCase();
        let embeddedImage;

        if (ext === 'jpg' || ext === 'jpeg') {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else if (ext === 'png') {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          throw new Error(`Unsupported image format: ${ext}`);
        }

        const dims = embeddedImage.scale(scale);
        const page = pages[index];

        page.drawImage(embeddedImage, {
          x: position.x,
          y: position.y,
          width: dims.width,
          height: dims.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = file?.pdfFiles?.fileName || 'enhanced.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Download failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mx-auto p-5 w-full h-full">
      <div className="flex justify-between p-4">
        <div className="text-lg font-semibold">{file?.pdfFiles?.fileName}</div>
        <Button onClick={handleDownload} loaderProps={{ type: 'dots' }}
          loading={loading} className="filled-button"
          leftSection={<FaDownload className="w-4 h-4" />}>
          Download
        </Button>
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