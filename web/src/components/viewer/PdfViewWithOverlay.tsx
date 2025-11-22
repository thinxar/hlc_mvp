import { useEffect, useState, useMemo, useRef, forwardRef } from "react";
import { fabric } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Loader } from "@mantine/core";
import axios from "axios";
import { GoDash, GoPlus } from "react-icons/go";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { useFormstore } from "wire/StoreFactory";
import { pdfRender, selectStampFunc } from "./widgets/widget";
import { saveOverlay } from "./overlay/saveOverlay";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerSrc;

export const PDFViewerWithOverlay = forwardRef(function PdfViewer(
  { pdfUrlFromApi, selectedStamp, overlays, file, setSelectedStamp, setSelectedFile, uploadStampEndPoint, handleFetch }: any
) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(0.9);
  const pdfRef = useRef<any>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const overlayMap = useMemo(() => {
    const map: Record<number, any[]> = {};
    overlays?.stamps?.forEach((o: any) => {
      const pg = Number(o?.position?.pageNumber ?? 1);
      if (!map[pg]) map[pg] = [];
      map[pg].push(o);
    });
    return map;
  }, [overlays?.stamps]);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        const res = await axios.get(pdfUrlFromApi, {
          responseType: "arraybuffer",
        });
        const pdf = await (pdfjsLib as any).getDocument(res.data).promise;
        pdfRef.current = pdf;
        const total = pdf.numPages;
        const pngPages: any[] = [];

        for (let i = 1; i <= total; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;

          pngPages.push({
            index: i - 1,
            png: canvas.toDataURL("image/png"),
            width: viewport.width,
            height: viewport.height,
          });
        }
        setPages(pngPages);
      } catch (err) {
        console.error("PDF load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfUrlFromApi]);


  const saveStampData = () => {
    saveOverlay({
      canvasRef: fabricCanvasRef,
      overlayType: "stamp",
      page,
      file,
      uploadEndPoint: useFormstore(uploadStampEndPoint, { isFormData: true }),
      setSelectedFile,
      setSelectedOverlay: setSelectedStamp,
      handleFetch
    });
  }

  useEffect(() => {
    pdfRender(pages, page, zoom, overlayMap, fabricCanvasRef, tooltipRef)
  }, [pages, page, zoom, overlayMap])


  useEffect(() => {
    selectStampFunc(selectedStamp, page, setSelectedStamp, fabricCanvasRef)
  }, [selectedStamp])


  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader type="bars" />
        <p className="mt-2">Loading PDF...</p>
      </div>
    );

  if (!pages.length) return <div>No PDF Pages Found</div>;

  return (
    <div className="w-full h-[calc(100vh-115px)] overflow-hidden p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="hover:bg-gray-200 px-2 py-1 rounded"
          >
            <MdOutlineKeyboardArrowUp fontSize={20} />
          </button>
          <span>|</span>
          <button
            onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
            disabled={page === pages.length - 1}
            className="hover:bg-gray-200 px-2 py-1 rounded"
          >
            <MdOutlineKeyboardArrowDown fontSize={20} />
          </button>
          <span>Page {page + 1} / {pages.length}</span>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}>
            <GoDash fontSize={20} />
          </button>
          <button onClick={() => setZoom((z) => z + 0.1)}>
            <GoPlus fontSize={20} />
          </button>
          <button
            onClick={() => setZoom(1.2)}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            Reset
          </button>
          {selectedStamp && (
            <button
              onClick={saveStampData}
              className="cursor-pointer px-2 py-1.5 flex items-center gap-2 bg-gradient-to-r pr-bgcolor text-white 
              font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-101 transition-all duration-200 ease-out">
              Save Stamp
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto border rounded relative p-2 flex justify-center bg-black">
        <canvas id="fabric-pdf-canvas" />
        <div
          ref={tooltipRef}
          className="absolute hidden bg-black text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{ zIndex: 9999 }}
        />
      </div>
    </div>
  );
});