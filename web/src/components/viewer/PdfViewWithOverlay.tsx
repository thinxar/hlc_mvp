import {
  useEffect,
  useState,
  useMemo,
  useRef,
  forwardRef,
} from "react";
import { fabric } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Loader } from "@mantine/core";
import axios from "axios";
import { GoDash, GoPlus } from "react-icons/go";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { stampImages } from "./StampImages";
import { useParams } from "react-router-dom";
import { useFormstore } from "wire/StoreFactory";
import { StringFormat } from "@palmyralabs/ts-utils";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { formatDateTime } from "utils/FormateDate";
import { toast } from "react-toastify";
import { handleError } from "wire/ErrorHandler";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerSrc;

export const PDFViewerWithOverlay = forwardRef(function PdfViewer(
  { pdfUrlFromApi, selectedStamp, overlays, file }: any
) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(0.9);
  const pdfRef = useRef<any>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const endpoint = StringFormat(ServiceEndpoint.policy.searchPolicyByIdApi + "?_limit=-1", { policyId: params?.policyId });

  const uploadStampEndPoint = StringFormat(
    ServiceEndpoint.policy.stamp.stampUploadApi,
    {
      policyId: params?.policyId,
      docketTypeId: file?.docketType?.id,
    }
  );

  const a = () => {
    useFormstore(endpoint).query({ filter: {} }).then((d: any) => {
      console.log(d);
    })
  }

  const overlayMap = useMemo(() => {
    const map: Record<number, any[]> = {};
    overlays?.forEach((o: any) => {
      const pg = Number(o?.position?.pageNumber ?? 1);
      if (!map[pg]) map[pg] = [];
      map[pg].push(o);
    });
    return map;
  }, [overlays]);

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

  // Initialize Fabric canvas with PDF page and overlays
  useEffect(() => {
    if (!pages.length) return;
    const pageData = pages[page];

    if (fabricCanvasRef.current) fabricCanvasRef.current.dispose();

    const canvas = new fabric.Canvas("fabric-pdf-canvas", {
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    // Set PDF page as background
    fabric.Image.fromURL(pageData.png, (img) => {
      canvas.setWidth(pageData.width * zoom);
      canvas.setHeight(pageData.height * zoom);

      canvas.setBackgroundImage(
        img,
        () => {
          canvas.renderAll();

          // Add existing overlays/stamps
          const existing = overlayMap[page + 1] || [];
          existing.forEach((stamp) => {
            const url = stampImages[stamp?.stamp?.code];
            fabric.Image.fromURL(url, (img) => {
              img.set({
                left: Number(stamp?.position?.left) * zoom,
                top: Number(stamp?.position?.top) * zoom,
                scaleX: Number(stamp?.position?.scaleX),
                scaleY: Number(stamp?.position?.scaleY),
                selectable: false,
                hoverCursor: "pointer",
              });

              (img as any).metadata = {
                code: stamp?.stamp?.code,
                name: stamp?.stamp?.name,
                addedOn: stamp?.createdOn,
              };

              canvas.add(img);
              canvas.renderAll();
            });
          });
        },
        { scaleX: zoom, scaleY: zoom }
      );
    });

    const tooltip = tooltipRef.current;

    // Tooltip events
    canvas.on("mouse:over", (e) => {
      const target = e.target as any;
      const timestamp = target?.metadata?.addedOn;
      const FormateDate = formatDateTime(timestamp, 'DD-MM-YYYY HH:MM:SS A');
      if (tooltip && target?.metadata) {
        tooltip.style.display = "block";
        tooltip.innerHTML = `
          <strong>${target?.metadata?.name ?? "Stamp"}</strong><br/>
          Code: ${target?.metadata?.code ?? "-"}<br/>
          Date: ${FormateDate}
        `;
      }
    });
    canvas.on("mouse:move", (e) => {
      if (tooltip && tooltip.style.display === "block") {
        tooltip.style.left = e.e.pageX - 500 + "px";
        tooltip.style.top = e.e.pageY - 270 + "px";
      }
    });
    canvas.on("mouse:out", () => {
      if (tooltip) tooltip.style.display = "none";
    });

    // Delete icon for selected stamp
    canvas.on("selection:created", (e) => {
      const activeObject = e.target;
      if (!activeObject) return;

      const deleteIcon = new fabric.Text("✖", {
        left: (activeObject.left ?? 0) + (activeObject.width ?? 0) * (activeObject.scaleX ?? 1) - 10,
        top: (activeObject.top ?? 0) - 10,
        fontSize: 20,
        fill: "red",
        selectable: false,
        hoverCursor: "pointer",
        originX: "center",
        originY: "center",
      });

      (activeObject as any).deleteIcon = deleteIcon;
      canvas.add(deleteIcon);
      canvas.bringToFront(deleteIcon);

      deleteIcon.on("mousedown", () => {
        canvas.remove(activeObject);
        canvas.remove(deleteIcon);
        canvas.renderAll();
      });

      canvas.renderAll();
    });

    canvas.on("selection:cleared", () => {
      canvas.getObjects().forEach((obj: any) => {
        if (obj?.deleteIcon) {
          canvas.remove(obj.deleteIcon);
          delete obj.deleteIcon;
        }
      });
      canvas.renderAll();
    });

  }, [pages, page, zoom, overlayMap]);

  useEffect(() => {
    if (!selectedStamp || !fabricCanvasRef.current) return;

    const url = stampImages[selectedStamp.code];
    if (!url) return;

    fabric.Image.fromURL(url, (img) => {
      img.set({
        left: 120,
        top: 120,
        scaleX: 0.5,
        scaleY: 0.5,
        selectable: true,
        hoverCursor: "pointer",
      });

      (img as any).metadata = {
        code: selectedStamp?.code,
        pageNumber: page + 1,
        isNew: true,
      };

      fabricCanvasRef.current?.add(img);
      fabricCanvasRef.current?.setActiveObject(img);
      fabricCanvasRef.current?.renderAll();
    });
  }, [selectedStamp]);

  // Save new stamps
  const saveStampData = async () => {
    try {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const newStamps = canvas
        .getObjects()
        .filter((o: any) => o.metadata?.isNew)
        .map((o: any) => ({
          code: o.metadata.code,
          pageNumber: page + 1,
          left: o.left,
          top: o.top,
          scaleX: o.scaleX,
          scaleY: o.scaleY,
        }));

      await useFormstore(uploadStampEndPoint, { isFormData: true })
        .post({ policyFileId: file.id, stamp: [...newStamps] })
        .then((_res) => {
          toast.success("Stamp added successfully");
          a();
        })
        .catch((err) => handleError(err));

    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader type="bars" />
        <p className="mt-2">Loading PDF...</p>
      </div>
    );

  if (!pages.length)
    return <div>No PDF Pages Found</div>;

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
          <button onClick={() => setZoom(1.2)}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            Reset
          </button>
          {selectedStamp && <button onClick={saveStampData}
            className='cursor-pointer px-2 py-1.5 flex items-center gap-2 bg-gradient-to-r pr-bgcolor text-white
             font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-101 transition-all duration-200 ease-out'>
            Save Stamp
          </button>}
        </div>
      </div>

      <div className="flex-1 overflow-auto border rounded relative  p-2 flex justify-center bg-black">
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
