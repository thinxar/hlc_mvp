import { Loader } from "@mantine/core";
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

export const ImageViewer = ({
    endPoint,
    file,
    selectedStamp,
    overlays,
    setSelectedStamp,
    setSelectedFile,
    handleFetch,
    stampDataArr,
    setStampDataArr
}: any) => {

    const params = useParams();
    const [loading, setLoading] = useState(true);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const uploadStampEndPoint = StringFormat(
        ServiceEndpoint.policy.stamp.stampUploadApi,
        {
            policyId: params?.policyId,
            docketTypeId: file?.docketType?.id,
        }
    );

    useEffect(() => {
        setLoading(false);
        initCanvas();
    }, []);

    const initCanvas = () => {
        const imgEl: any = document.getElementById("mainImage");
        const canvasEl: any = document.getElementById("stampCanvas");

        if (!imgEl || !canvasEl) return;

        const setup = () => {
            const rect = imgEl.getBoundingClientRect();

            canvasEl.width = rect.width;
            canvasEl.height = rect.height;

            const fabricCanvas = new fabric.Canvas(canvasEl, {
                selection: true,
                preserveObjectStacking: true,
            });

            fabricCanvasRef.current = fabricCanvas;

            setupTooltip(containerRef.current!);
            loadExistingStamps();

            fabricCanvas.on("mouse:over", showTooltip);
            fabricCanvas.on("mouse:out", hideTooltip);
        };

        if (imgEl.complete) setup();
        else imgEl.onload = setup;
    };



    const setupTooltip = (container: HTMLElement) => {
        const tooltip = document.createElement("div");
        tooltip.style.position = "absolute";
        tooltip.style.padding = "4px 8px";
        tooltip.style.background = "#000";
        tooltip.style.color = "#fff";
        tooltip.style.borderRadius = "4px";
        tooltip.style.fontSize = "12px";
        tooltip.style.display = "none";
        tooltipRef.current = tooltip;
        container.appendChild(tooltip);
    };

    const loadExistingStamps = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        overlays?.stamps?.forEach((ov: any) => {
            const url = stampImages[ov.stamp.code];

            fabric.Image.fromURL(url, (img) => {
                img.set({
                    left: parseFloat(ov.position.left),
                    top: parseFloat(ov.position.top),
                    scaleX: ov.position.scaleX,
                    scaleY: ov.position.scaleY,
                    selectable: false,
                    hoverCursor: "pointer",
                });

                (img as any).metadata = {
                    isNew: false,
                    code: ov.stamp.code,
                    name: ov.stamp.name,
                    addedOn: ov.createdOn,
                };

                canvas.add(img);
            });
        });

        canvas.renderAll();
    };

    const showTooltip = (e: any) => {
        const target = e.target;
        if (!target || !tooltipRef.current || target.type !== "image") return;

        const canvas = fabricCanvasRef.current!;
        const p = canvas.getPointer(e.e);
        const t = target.metadata;

        tooltipRef.current.style.left = p.x + 20 + "px";
        tooltipRef.current.style.top = p.y + 10 + "px";
        tooltipRef.current.innerHTML = `
      <strong>${t.name}</strong><br/>
       ${formatDateTime(t.addedOn, 'DD-MM-YYYY HH:MM:SS A')}
    `;
        tooltipRef.current.style.display = "block";
    };

    const hideTooltip = () => {
        if (tooltipRef.current) tooltipRef.current.style.display = "none";
    };

    useEffect(() => {
        selectStampFunc(selectedStamp, '1', setSelectedStamp, fabricCanvasRef, setStampDataArr);
    }, [selectedStamp]);

    const saveStamps = async () => {
        try {
            const canvas = fabricCanvasRef.current;
            if (!canvas) return;

            const newStamps = canvas.getObjects()
                .filter((o: any) => o.metadata?.isNew)
                .map((o: any) => ({
                    code: o.metadata.code,
                    pageNumber: 1,
                    left: o.left,
                    top: o.top,
                    scaleX: o.scaleX,
                    scaleY: o.scaleY,
                }));

            if (!newStamps.length) return toast.info("No new stamp placed!");

            const res = await useFormstore(uploadStampEndPoint, { isFormData: true })
                .post({ policyFileId: file.id, stamp: newStamps });

            setSelectedFile({ ...file, stamps: res });
            handleFetch();
            setSelectedStamp(null);
            setStampDataArr(null);
            toast.success("Stamp added successfully!");
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="p-5 w-full h-full">
            <div className="flex justify-between mb-3 items-center">
                <strong>{file.fileName}</strong>

                {stampDataArr?.length > 0 && (
                    <button
                        onClick={saveStamps}
                        className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                        Save Stamp
                    </button>
                )}
            </div>
            <div
                ref={containerRef}
                className="relative w-full h-[80vh] bg-white border rounded-xl overflow-hidden" >
                <img
                    id="mainImage"
                    src={endPoint}
                    alt="document"
                    className="absolute top-0 left-0 w-full h-full object-contain z-0"
                />
                <canvas id="stampCanvas" className="absolute top-0 left-0 "></canvas>
            </div>
            {loading && (
                <div className="flex justify-center items-center p-10">
                    <Loader size="lg" />
                </div>
            )}
        </div>
    );
};
