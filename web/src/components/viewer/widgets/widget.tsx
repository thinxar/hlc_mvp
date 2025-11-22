import { fabric } from "fabric";
import { stampImages } from "../StampImages";
import { formatDateTime } from "utils/FormateDate";


const addStampWithDeleteIcon = (img: fabric.Image, stampMeta: any, setSelectedStamp: any, selectedStamp: any, fabricCanvasRef: any) => {
    img.set({
        selectable: true,
        hoverCursor: "pointer",
    });

    (img as any).metadata = stampMeta;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    function updateDeleteIconPosition(obj: any) {
        if (!obj.deleteIcon) return;
        const bounds = obj.getBoundingRect();
        obj.deleteIcon.set({
            left: bounds.left + bounds.width + 5,
            top: bounds.top - 5,
        });
    }

    canvas.on("object:moving", (e: any) => {
        updateDeleteIconPosition(e.target);
    });

    canvas.on("object:scaling", (e: any) => {
        updateDeleteIconPosition(e.target);
    });

    canvas.on("object:rotating", (e: any) => {
        updateDeleteIconPosition(e.target);
    });

    addDeleteOnSelection(img, setSelectedStamp, selectedStamp, fabricCanvasRef);
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas?.renderAll();
};

const addDeleteOnSelection = (obj: fabric.Object, setSelectedStamp: any, selectedStamp: any, fabricCanvasRef: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const onSelectionCleared = () => {
        canvas.getObjects().forEach((o: any) => {
            if (o?.deleteIcon) {
                canvas.remove(o.deleteIcon);
                delete o.deleteIcon;
            }
        });
        canvas.renderAll();
    };

    canvas.off("selection:cleared", onSelectionCleared);
    canvas.on("selection:cleared", onSelectionCleared);

    obj.on("selected", () => {
        const img = obj as fabric.Image;
        if (!(img as any).deleteIcon) {
            const deleteIcon = new fabric.Text("✖", {
                fontSize: 20,
                fill: "red",
                selectable: false,
                hoverCursor: "pointer",
                originX: "center",
                originY: "center",
            });

            const bounds = img.getBoundingRect();
            deleteIcon.set({
                left: bounds.left + bounds.width + 5,
                top: bounds.top - 5,
            });
            deleteIcon.on("mousedown", () => {
                canvas.remove(img);
                canvas.remove(deleteIcon);
                canvas?.renderAll();
                if (selectedStamp?.code === (img as any).metadata?.code) {
                    setSelectedStamp(null);
                }
            });

            (img as any).deleteIcon = deleteIcon;
            canvas.add(deleteIcon);
            canvas.bringToFront(deleteIcon);
            canvas?.renderAll();
        }
    });
};


const pdfRender = (pages: any, page: any, zoom: any, overlayMap: any, fabricCanvasRef: any, tooltipRef: any) => {
    if (!pages.length) return;
    const pageData = pages[page];

    if (fabricCanvasRef.current) fabricCanvasRef.current.dispose();

    const canvas = new fabric.Canvas("fabric-pdf-canvas", {
        selection: true,
        preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    fabric.Image.fromURL(pageData.png, (img) => {
        canvas.setWidth(pageData.width * zoom);
        canvas.setHeight(pageData.height * zoom);
        canvas.setBackgroundImage(
            img,
            () => {
                canvas.renderAll();
                const existing = overlayMap[page + 1] || [];
                existing.forEach((stamp: any) => {
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
                        canvas?.renderAll();
                    });
                });
            },
            { scaleX: zoom, scaleY: zoom }
        );
    });

    const tooltip = tooltipRef.current;

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

        canvas?.renderAll();
    });

    canvas.on("selection:cleared", () => {
        canvas.getObjects().forEach((obj: any) => {
            if (obj?.deleteIcon) {
                canvas.remove(obj.deleteIcon);
                delete obj.deleteIcon;
            }
        });
        canvas?.renderAll();
    });

}

const selectStampFunc = (selectedStamp: any, page: any, setSelectedStamp: any, fabricCanvasRef: any) => {
    if (!selectedStamp || !fabricCanvasRef.current) return;

    const pngUrl = stampImages[selectedStamp?.code];
    if (!pngUrl) return;

    fabric.Image.fromURL(pngUrl, (img) => {
        img.set({
            left: 100,
            top: 100,
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: true,
            hoverCursor: "pointer",
        });

        (img as any).metadata = {
            code: selectedStamp.code,
            pageNumber: page,
            isNew: true,
        };
        addStampWithDeleteIcon(img, {
            code: selectedStamp?.code,
            name: selectedStamp?.name,
            pageNumber: page + 1,
            isNew: true,
        }, setSelectedStamp, selectedStamp, fabricCanvasRef);
    });
}

const overlayFun = (overlays: any) => {
    const map: Record<number, any[]> = {};
    overlays?.stamps?.forEach((o: any) => {
        const pg = Number(o?.position?.pageNumber ?? 1);
        if (!map[pg]) map[pg] = [];
        map[pg].push(o);
    });
    return map;
}

export { addStampWithDeleteIcon, pdfRender, selectStampFunc, overlayFun }