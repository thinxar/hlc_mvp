import { useEffect, useState, useRef, forwardRef, useMemo } from "react";
import axios from "axios";
import UTIF from "utif2";
import { Loader } from "@mantine/core";
import { GoDash, GoPlus } from "react-icons/go";
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

export const TIFFViewer = forwardRef(function TiffFileViewer({ tiff, file, overlays }: any) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(0.85);

  const canvasRef: any = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const overlayMap = useMemo(() => {
    const map: Record<number, any[]> = {};
    overlays.forEach((o: any) => {
      const index = o.page - 1;
      if (!map[index]) map[index] = [];
      map[index].push(o);
    });
    return map;
  }, [overlays]);

  const imgLoaded = async () => {
    try {
      setLoading(true);

      const res = await axios.get(tiff, { responseType: "arraybuffer" });
      const buffer = res.data;

      const ifds = UTIF.decode(buffer);
      const canvases: any[] = [];

      for (let i = 0; i < ifds.length; i++) {
        const ifd = ifds[i];
        try {
          if (ifd["PhotometricInterpretation"] === 6) {
            console.error("Unsupported format: JPEG-compressed (PhotometricInterpretation 6)");
          }

          try {
            UTIF.decodeImage(buffer, ifd);
          } catch {
            console.warn(`Page ${i + 1}: decodeImage failed, trying toRGBA8 directly`);
          }

          if (!ifd.width || !ifd.height) {
            console.error("Invalid page: missing width or height");
          }

          var rgba = UTIF.toRGBA8(ifd)
          if (!rgba || rgba.length === 0) {
            console.error("No image data (rgba)");
          }

          var canvas = document.createElement('canvas')
          canvas.width = ifd.width
          canvas.height = ifd.height
          var ctx: any = canvas.getContext('2d')
          var img = ctx!.createImageData(ifd.width, ifd.height)
          img.data.set(rgba)
          ctx!.putImageData(img, 0, 0)

          canvases.push({ index: i, canvas })

          const currentPage = i;
          const currentOverlays = overlayMap[currentPage] || [];

          await Promise.all(
            currentOverlays.map((overlay: any) =>
              new Promise<void>((resolve) => {
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.src = overlay.imageUrl;
                image.onload = () => {
                  ctx.drawImage(image, overlay.x, overlay.y, overlay.width, overlay.height);
                  resolve();
                };
              })
            )
          );
        } catch (err: any) {
          console.warn(`Page ${i + 1} skipped:`, err.message);
          canvases.push({ index: i, error: err.message });
        }
      }
      setPages(canvases);
    } catch (err: any) {
      console.error("TIFF rendering failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    imgLoaded()
  }, [tiff])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  useEffect(() => {
    if (!canvasRef.current || pages.length === 0) return;

    const displayCanvas = canvasRef.current;
    const ctx = displayCanvas.getContext("2d");
    if (!ctx) return;

    const currentPage = pages[page];
    if (!currentPage || !currentPage.canvas) return;

    const originalCanvas = currentPage.canvas;

    const scaledWidth = originalCanvas.width * zoom
    const scaledHeight = originalCanvas.height * zoom

    displayCanvas.width = scaledWidth
    displayCanvas.height = scaledHeight

    ctx.setTransform(zoom, 0, 0, zoom, 0, 0)
    ctx.clearRect(0, 0, scaledWidth, scaledHeight)
    ctx.drawImage(originalCanvas, 0, 0)
  }, [pages, page, zoom])

  if (loading) {
    return (
      <div className="mx-auto p-5 w-full h-full">
        <div className="flex justify-between p-4">
          <div className="text-base font-semibold">{file?.fileName}</div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-100 text-black">
          <Loader type="bars" color="blue" />
          <div className="mt-2 font-semibold text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return <div className="p-5 text-red-600">No pages could be rendered.</div>;
  }

  if (pages)
    return (
      <div className="w-full h-[calc(100vh-115px)] overflow-hidden p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="text-base font-semibold pr-text">{file?.fileName}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap items-center gap-2 p-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="py-1 rounded disabled:opacity-50 hover:bg-gray-300">
              <MdOutlineKeyboardArrowUp fontSize={20} />
            </button>
            <span className="text-xl">|</span>
            <button onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
              disabled={page === pages.length - 1}
              className="py-1 rounded disabled:opacity-50 hover:bg-gray-300">
              <MdOutlineKeyboardArrowDown fontSize={20} />
            </button>
            <div className="text-sm text-gray-600">
              Page {page + 1} of {pages.length}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}
              className="py-1 rounded hover:bg-gray-300 cursor-pointer">
              <GoDash fontSize={20} />
            </div>
            <span className="text-xl">|</span>
            <div onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
              className="py-1 rounded hover:bg-gray-300 cursor-pointer">
              <GoPlus fontSize={20} />
            </div>
            <div onClick={() => setZoom(0.85)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">
              Reset
            </div>
          </div>
        </div>
        <div className="w-full flex-1 overflow-auto border border-gray-400 shadow-2xl rounded-2xl bg-white p-2">
          <div className="w-fit h-fit min-w-full min-h-full grid place-content-center">
            {pages[page].canvas ? (
              <div
                ref={containerRef}
                className="overflow-auto h-screen bg-gray-50"
              >
                <canvas ref={canvasRef} />
              </div>
            ) : (
              <div className="p-4 font-semibold">
                Page {pages[page].index + 1}: Not able to render
              </div>
            )}
          </div>
        </div>
      </div>
    )
})