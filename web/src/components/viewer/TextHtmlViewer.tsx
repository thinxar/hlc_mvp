import { Loader } from "@mantine/core";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fabric } from "fabric";
import { StringFormat } from "@palmyralabs/ts-utils";
import { ServiceEndpoint } from "config/ServiceEndpoint";
import { stampImages } from "./StampImages";
import { useFormstore } from "wire/StoreFactory";
import { formatDateTime } from "utils/FormateDate";
import { handleError } from "wire/ErrorHandler";
import { selectStampFunc } from "./widgets/widget";

export const TextHtmlViewer = ({ endPoint, file, selectedStamp, overlays, setSelectedStamp, setSelectedFile, handleFetch, stampDataArr, setStampDataArr }: any) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();

  const uploadStampEndPoint = StringFormat(
    ServiceEndpoint.policy.stamp.stampUploadApi,
    {
      policyId: params?.policyId,
      docketTypeId: file?.docketType?.id,
    }
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(endPoint, { responseType: "text" });
        setContent(res.data);
      } catch (e) {
        toast.error("HTML loading failed");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [endPoint]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;

    setTimeout(() => {
      const canvasEl = canvasRef.current!;
      canvasEl.width = container.clientWidth;
      canvasEl.height = container.scrollHeight;

      const fabricCanvas = new fabric.Canvas(canvasEl, {
        selection: true,
        backgroundColor: "transparent",
      });
      fabricCanvasRef.current = fabricCanvas;
      const tooltip = document.createElement("div");
      tooltip.style.position = "absolute";
      tooltip.style.padding = "4px 8px";
      tooltip.style.background = "#000";
      tooltip.style.color = "white";
      tooltip.style.borderRadius = "5px";
      tooltip.style.fontSize = "12px";
      tooltip.style.display = "none";
      tooltipRef.current = tooltip;
      container.appendChild(tooltip);

      overlays?.stamps?.forEach((ov: any) => {
        const url = stampImages[ov.stamp.code];
        fabric.Image.fromURL(
          url,
          (img) => {
            img.set({
              left: parseFloat(ov?.position.left),
              top: parseFloat(ov.position.top),
              scaleX: ov.position.scaleX,
              scaleY: ov.position.scaleY,
              selectable: false,
              hoverCursor: "pointer",
            });

            (img as any).metadata = {
              isNew: false,
              code: ov?.position?.code,
              name: ov?.stamp?.name,
              addedOn: ov?.createdOn
            };
            fabricCanvas.add(img);
          },
          { crossOrigin: "anonymous" }
        );
      });

      fabricCanvas.on("mouse:over", (e) => {
        const target: any = e.target;
        if (target?.type === "image") {
          const p = fabricCanvas.getPointer(e.e);
          const timestamp = target?.metadata?.addedOn;
          const FormateDate = formatDateTime(timestamp, 'DD-MM-YYYY HH:MM:SS A')
          tooltip.style.left = p.x + 10 + "px";
          tooltip.style.top = p.y + 10 + "px";
          tooltip.innerHTML = `
          <strong>${target?.metadata?.name ?? "Stamp"}</strong><br/>
           ${FormateDate}
        `;
          tooltip.style.display = "block";
        }
      });

      fabricCanvas.on("mouse:out", () => {
        tooltip.style.display = "none";
      });
    }, 50);
  }, [content]);

  useEffect(() => {
    selectStampFunc(selectedStamp, 'page', setSelectedStamp, fabricCanvasRef, setStampDataArr)
  }, [selectedStamp])

  const saveOverlays = async () => {
    try {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const newStampObjects = canvas
        .getObjects()
        .filter((o: any) => o.metadata?.isNew);

      const newStamps = newStampObjects.map((o: any) => ({
        code: o.metadata.code,
        pageNumber: 0 + 1,
        left: o.left,
        top: o.top,
        scaleX: o.scaleX,
        scaleY: o.scaleY,
      }));

      await useFormstore(uploadStampEndPoint, { isFormData: true })
        .post({ policyFileId: file.id, stamp: [...newStamps] })
        .then(res => {
          if (!res) return;

          const newStampList = Array.isArray(res) ? res : [res];

          setSelectedFile(() => ({
            ...file,
            pdfFiles: file.pdfFiles,
            stamps: newStampList ?? [],
          }));

          handleFetch()
          toast.success("Stamp added successfully");
        })
        .catch((err) => handleError(err));

      canvas?.renderAll();
      setSelectedStamp(null);
      setStampDataArr(null)
      setLoading(false)

    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <Loader type="bars" color="blue" />
      </div>
    );

  return (
    <div className="p-5 w-full h-full">
      <div className="flex justify-between mb-3 items-center">
        <strong>{file.fileName}</strong>
        {
          stampDataArr?.length > 0 && <div>
            <button onClick={saveOverlays} className='cursor-pointer px-2 py-1.5 flex items-center gap-2 bg-gradient-to-r pr-bgcolor text-white
             font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-101 transition-all duration-200 ease-out'>
              Save Stamp
            </button>
          </div>
        }
      </div>
      <div
        ref={containerRef}
        className="relative border rounded-xl bg-white text-black h-[80vh] overflow-auto"
      >
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="absolute top-0 left-0 w-full pointer-events-none"
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>
    </div>
  );
};
