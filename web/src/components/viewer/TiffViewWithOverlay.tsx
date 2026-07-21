import { Loader } from "@mantine/core";
import axios from "axios";
import { fabric } from "fabric";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp, MdRotateRight } from "react-icons/md";
import UTIF from "utif2";
import { formatDateTime } from "utils/FormateDate";
import { useFormstore } from "wire/StoreFactory";
import { saveOverlay } from "./overlay/saveOverlay";
import { stampImages } from "./StampImages";
import { selectStampFunc } from "./widgets/widget";

export const TIFFViewer = ({
  tiff,
  file,
  overlays,
  selectedStamp,
  setSelectedStamp,
  uploadStampEndPoint,
  handleFetch,
  setSelectedFile,
  stampDataArr,
  setStampDataArr
}: any) => {

  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(0.85);
  const [rotation, setRotation] = useState(0);

  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const wheelLock = useRef(false);

  const overlayMap = useMemo(() => {
    const map: Record<number, any[]> = {};
    overlays?.stamps?.forEach((o: any) => {
      const index = o?.position?.pageNumber - 1;
      if (!map[index]) map[index] = [];
      map[index].push(o);
    });
    return map;
  }, [overlays?.stamps]);

  // useEffect(() => {
  //   const loadTiff = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(tiff, { responseType: "arraybuffer" });
  //       const buffer = res.data;
  //       const ifds = UTIF.decode(buffer);

  //       const canvases: any[] = [];

  //       for (let i = 0; i < ifds.length; i++) {
  //         const ifd = ifds[i];
  //         UTIF.decodeImage(buffer, ifd);

  //         const rgba = UTIF.toRGBA8(ifd);
  //         const width = ifd.width || 1;
  //         const height = ifd.height || 1;

  //         const canvas = document.createElement("canvas");
  //         canvas.width = width;
  //         canvas.height = height;

  //         const ctx = canvas.getContext("2d");
  //         if (!ctx) continue;

  //         const imgData = new ImageData(new Uint8ClampedArray(rgba), width, height);
  //         ctx.putImageData(imgData, 0, 0);

  //         canvases.push({ index: i, canvas });
  //       }

  //       setPages(canvases);
  //     } catch (err: any) {
  //       console.error("TIFF rendering failed:", err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadTiff();
  // }, [tiff]);

  useEffect(() => {
  const loadTiff = async () => {
    try {
      setLoading(true);
      const res = await axios.get(tiff, { responseType: "arraybuffer" });
      const buffer = res.data;
      const ifds = UTIF.decode(buffer);
      const canvases: any[] = [];
      
      for (let i = 0; i < ifds.length; i++) {
        try {
          const ifd = ifds[i];
          UTIF.decodeImage(buffer, ifd);
          const rgba = UTIF.toRGBA8(ifd);
          const width = ifd.width || 1;
          const height = ifd.height || 1;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          const imgData = new ImageData(new Uint8ClampedArray(rgba), width, height);
          ctx.putImageData(imgData, 0, 0);
          canvases.push({ index: i, canvas });
        } catch (pageErr: any) {
          console.warn(`Failed to decode page ${i}:`, pageErr.message);
          // Create a placeholder canvas for failed pages
          const canvas = document.createElement("canvas");
          canvas.width = 800;
          canvas.height = 600;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#f0f0f0";
            ctx.fillRect(0, 0, 800, 600);
            ctx.fillStyle = "#333";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`Page ${i + 1} - Failed to load`, 400, 300);
          }
          canvases.push({ index: i, canvas });
        }
      }
      
      setPages(canvases);
    } catch (err: any) {
      console.error("TIFF rendering failed:", err.message);
    } finally {
      setLoading(false);
    }
  };
  loadTiff();
}, [tiff]);

  useEffect(() => {
    if (!pages.length) return;

    const currentPage = pages[page];
    if (!currentPage?.canvas) return;

    if (fabricCanvasRef.current) fabricCanvasRef.current.dispose();

    const fabricCanvas = new fabric.Canvas("fabric-tiff-canvas", {
      selection: true,
      preserveObjectStacking: true,
    });
    fabricCanvasRef.current = fabricCanvas;

    const bgData = currentPage.canvas.toDataURL("image/png");

    fabric.Image.fromURL(bgData, (img) => {
      const scaledWidth = currentPage.canvas.width * zoom;
      const scaledHeight = currentPage.canvas.height * zoom;

      fabricCanvas.setWidth(scaledWidth);
      fabricCanvas.setHeight(scaledHeight);

      fabricCanvas.setBackgroundImage(
        img,
        fabricCanvas.renderAll.bind(fabricCanvas),
        {
          scaleX: zoom,
          scaleY: zoom,
          originX: "left",
          originY: "top",
        }
      );
    });

    const currentOverlays = overlayMap[page] || [];

    currentOverlays.forEach((overlay: any) => {
      const imageUrl = stampImages[overlay?.position?.code];
      if (!imageUrl) return;

      fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
          left: Number(overlay?.position?.left ?? overlay?.position?.x ?? 0),
          top: Number(overlay?.position?.top ?? overlay?.position?.y ?? 0),
          scaleX: Number(overlay?.position?.scaleX ?? 1),
          scaleY: Number(overlay?.position?.scaleY ?? 1),
          selectable: false,
          hoverCursor: "pointer",
        });

        (img as any).metadata = {
          code: overlay?.position?.code,
          name: overlay?.stamp?.name,
          pageNumber: overlay?.position?.pageNumber,
          isNew: false,
          addedOn: overlay?.createdOn
        };

        fabricCanvas.add(img);
      });
    });

    const tooltip = tooltipRef.current;
    const container = document.getElementById("tiff-container");

    fabricCanvas.on("mouse:over", (e) => {
      const target = e.target as any;
      const timestamp = target?.metadata?.addedOn;
      const FormateDate = formatDateTime(timestamp, "DD-MM-YYYY HH:MM:SS A");

      if (tooltip && target?.metadata) {
        tooltip.style.display = "block";
        tooltip.innerHTML = `
          <strong>${target.metadata.name ?? "Stamp"}</strong><br/>
          ${FormateDate}
        `;
      }
    });

    fabricCanvas.on("mouse:move", (e) => {
      if (!tooltip || tooltip.style.display !== "block") return;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      const x = e.e.clientX - rect.left + container.scrollLeft;
      const y = e.e.clientY - rect.top + container.scrollTop;

      tooltip.style.left = x + 15 + "px";
      tooltip.style.top = y + 15 + "px";
    });

    fabricCanvas.on("mouse:out", () => {
      if (tooltip) tooltip.style.display = "none";
    });

  }, [pages, page, zoom, overlayMap]);

  useEffect(() => {
    selectStampFunc(selectedStamp, page, setSelectedStamp, fabricCanvasRef, setStampDataArr);
  }, [selectedStamp]);

  // Reset scroll to top whenever the page changes.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [page]);

  // Scroll wheel flips pages, but only once the current page is scrolled to its
  // top/bottom edge (so a zoomed/tall page can still be scrolled internally first).
  const handleWheel = (e: any) => {
    const el = scrollRef.current;
    if (!el || wheelLock.current) return;

    const atTop = el.scrollTop <= 0;
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

    if (e.deltaY > 0 && atBottom) {
      // last page -> wrap to first
      setPage((p) => (p + 1) % pages.length);
      wheelLock.current = true;
      setTimeout(() => { wheelLock.current = false; }, 400);
    } else if (e.deltaY < 0 && atTop) {
      // first page -> wrap to last
      setPage((p) => (p - 1 + pages.length) % pages.length);
      wheelLock.current = true;
      setTimeout(() => { wheelLock.current = false; }, 400);
    }
  };

  const saveStampData = async () => {
    saveOverlay({
      canvasRef: fabricCanvasRef,
      overlayType: "stamp",
      page,
      file,
      uploadEndPoint: useFormstore(uploadStampEndPoint, { isFormData: true }),
      setSelectedFile,
      setSelectedOverlay: setSelectedStamp,
      setStampDataArr,
      handleFetch,
    });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        <Loader type="bars" color="blue" />
        <div className="mt-2 font-semibold text-lg">Loading TIFF...</div>
      </div>
    );

  if (pages.length === 0)
    return <div className="text-center text-red-600 p-4">No TIFF pages found.</div>;

  return (
    <div className="w-full h-[calc(100vh-115px)] overflow-hidden p-4 flex flex-col gap-4">

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap items-center gap-2 p-2">
          <button
            onClick={() => setPage((p) => (p - 1 + pages.length) % pages.length)}
            title="Previous page"
            className="py-1 rounded hover:bg-gray-300"
          >
            <MdOutlineKeyboardArrowUp fontSize={20} />
          </button>
          <span className="text-xl">|</span>
          <button
            onClick={() => setPage((p) => (p + 1) % pages.length)}
            title="Next page"
            className="py-1 rounded hover:bg-gray-300"
          >
            <MdOutlineKeyboardArrowDown fontSize={20} />
          </button>

          <div className="text-sm text-gray-600">
            Page {page + 1} of {pages.length}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}
            title="Zoom out"
            className="py-1 rounded hover:bg-gray-300 cursor-pointer"
          >
            <AiOutlineZoomOut fontSize={20} />
          </div>

          <span className="text-xl">|</span>

          <div
            onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
            title="Zoom in"
            className="py-1 rounded hover:bg-gray-300 cursor-pointer"
          >
            <AiOutlineZoomIn fontSize={20} />
          </div>

          <span className="text-xl">|</span>

          <div
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="Rotate"
            className="py-1 rounded hover:bg-gray-300 cursor-pointer"
          >
            <MdRotateRight fontSize={20} />
          </div>

          <div
            onClick={() => { setZoom(0.85); setRotation(0); }}
            title="Reset"
            className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
          >
            Reset
          </div>

          {stampDataArr?.length > 0 && (
            <button
              onClick={saveStampData}
              className="cursor-pointer px-2 py-1.5 flex items-center gap-2 bg-linear-to-r pr-bgcolor text-white font-semibold rounded-lg shadow-md hover:shadow-lg"
            >
              Save Stamp
            </button>
          )}
        </div>
      </div>

      <div
        id="tiff-container"
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex-1 flex justify-center overflow-auto border border-gray-400 rounded-lg bg-white p-2 relative"
      >
        <div style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "center center", transition: "transform 0.2s ease" }}>
          <canvas id="fabric-tiff-canvas" />
        </div>

        <div
          ref={tooltipRef}
          className="absolute hidden bg-black text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{ display: "none", zIndex: 9999 }}
        />
      </div>
    </div>
  );
};
