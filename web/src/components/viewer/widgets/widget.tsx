import { fabric } from "fabric";
import { stampImages } from "../StampImages";
import { formatDateTime } from "utils/FormateDate";

const addStampWithDeleteIcon = (
    img: fabric.Image,
    stampMeta: any,
    fabricCanvasRef: any,
    setStampDataArr: any,
    _setSelectedStamp: any
) => {
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

    addDeleteOnSelection(img, fabricCanvasRef, setStampDataArr);

    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
};

const addDeleteOnSelection = (
    obj: fabric.Object,
    fabricCanvasRef: any,
    setStampDataArr: any
) => {
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
                fontSize: 30,
                fill: "red",
                selectable: true,
                hoverCursor: "pointer",
                originX: "center",
                originY: "center",
                evented: true,
            });

            const bounds = img.getBoundingRect();
            deleteIcon.set({
                left: bounds.left + bounds.width + 5,
                top: bounds.top - 5,
            });

            deleteIcon.on("mousedown", () => {
                canvas.remove(img);
                canvas.remove(deleteIcon);
                canvas.renderAll();

                setStampDataArr((prev: any[]) => {
                    if (!prev) return [];
                    return prev.filter(
                        (x) => x?.code !== (img as any).metadata?.code
                    );
                });
            });

            (img as any).deleteIcon = deleteIcon;

            canvas.add(deleteIcon);
            canvas.bringToFront(deleteIcon);
            canvas.renderAll();
        }
    });
};

const pdfRender = (
    pages: any,
    page: number,
    zoom: number,
    overlayMap: any,
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>,
    tooltipRef: any,
    containerRef: any
) => {
    if (!pages?.length) return;

    const pageData = pages[page];
    if (!pageData) return;

    if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
    }

    const canvas = new fabric.Canvas("fabric-pdf-canvas", {
        selection: true,
        preserveObjectStacking: true,
    });

    canvas.skipTargetFind = false;
    canvas.perPixelTargetFind = true;
    canvas.targetFindTolerance = 20;
    canvas.backgroundVpt = true;

    fabricCanvasRef.current = canvas;

    fabric.Image.fromURL(pageData.png, (bgImg) => {
        const width = pageData.width * zoom;
        const height = pageData.height * zoom;

        canvas.setWidth(width);
        canvas.setHeight(height);

        canvas.setBackgroundImage(
            bgImg,
            () => {
                canvas.renderAll();

                const existing = overlayMap[page + 1] || [];

                existing.forEach((stamp: any) => {
                    const url = stampImages[stamp?.stamp?.code];
                    if (!url) return;

                    fabric.Image.fromURL(
                        url,
                        (img) => {
                            img.set({
                                left: Number(stamp?.position?.left) || 0,
                                top: Number(stamp?.position?.top) || 0,
                                scaleX: Number(stamp?.position?.scaleX) || 1,
                                scaleY: Number(stamp?.position?.scaleY) || 1,
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
                        },
                        { crossOrigin: "anonymous" }
                    );
                });
            },
            { scaleX: zoom, scaleY: zoom }
        );
    });

    const tooltipEl = tooltipRef?.current ?? null;
    const containerEl = containerRef?.current ?? null;
    const canvasEl = (canvas as any).lowerCanvasEl as HTMLCanvasElement;

    if (!canvasEl) return;

    if (tooltipEl && containerEl && tooltipEl.parentElement !== containerEl) {
        containerEl.appendChild(tooltipEl);
        tooltipEl.style.position = "absolute";
        tooltipEl.style.pointerEvents = "none";
    }

    const positionTooltip = (e: any) => {
        if (!tooltipEl || !containerEl || !canvasEl || !canvas) return;

        const pointer = canvas.getPointer(e.e);
        if (!pointer) return;

        const z = canvas.getZoom() || 1;

        const scrollLeft = containerEl.scrollLeft || 0;
        const scrollTop = containerEl.scrollTop || 0;

        const x =
            pointer.x * z -
            scrollLeft +
            (canvasEl.offsetLeft || 0);

        const y =
            pointer.y * z -
            scrollTop +
            (canvasEl.offsetTop || 0);

        const gap = 4;

        tooltipEl.style.left = `${Math.round(x + gap)}px`;
        tooltipEl.style.top = `${Math.round(
            y - tooltipEl.offsetHeight / 2
        )}px`;

        const maxLeft =
            containerEl.clientWidth - tooltipEl.offsetWidth - 4;
        const maxTop =
            containerEl.clientHeight - tooltipEl.offsetHeight - 4;

        if (tooltipEl.offsetLeft > maxLeft)
            tooltipEl.style.left = `${maxLeft}px`;
        if (tooltipEl.offsetTop < 0) tooltipEl.style.top = `4px`;
        if (tooltipEl.offsetTop > maxTop)
            tooltipEl.style.top = `${maxTop}px`;
    };

    canvas.on("mouse:over", (e) => {
        const t = e.target as any;
        if (!t?.metadata || !tooltipEl) return;

        const date = formatDateTime(
            t.metadata.addedOn,
            "DD-MM-YYYY HH:MM:SS A"
        );

        tooltipEl.innerHTML = `<strong>${t.metadata.name}</strong><br/>${date}`;
        tooltipEl.style.display = "block";
        positionTooltip(e);
    });

    canvas.on("mouse:move", (e) => {
        if (!tooltipEl || tooltipEl.style.display !== "block") return;
        positionTooltip(e);
    });

    canvas.on("mouse:out", () => {
        if (tooltipEl) tooltipEl.style.display = "none";
    });

    canvas.on("selection:created", (e) => {
        const obj = e.target as any;
        if (!obj) return;

        canvas.getObjects().forEach((o: any) => {
            if (o?.isDeleteIcon) canvas.remove(o);
        });

        const bounds = obj.getBoundingRect(true);

        const deleteIcon = new fabric.Text("✖", {
            left: bounds.left + bounds.width - 15,
            top: bounds.top + 15,
            fontSize: 20,
            fill: "red",
            originX: "center",
            originY: "center",
            selectable: false,
            evented: true,
        }) as any;

        deleteIcon.isDeleteIcon = true;

        deleteIcon.on("mousedown", (ev: any) => {
            ev.e.stopPropagation();
            canvas.remove(obj);
            canvas.remove(deleteIcon);
            canvas.renderAll();
        });

        canvas.add(deleteIcon);
        canvas.bringToFront(deleteIcon);
        canvas.renderAll();
    });

    canvas.on("selection:cleared", () => {
        canvas.getObjects().forEach((o: any) => {
            if (o?.isDeleteIcon) {
                canvas.remove(o);
            }
        });
        canvas.renderAll();
    });
};

const selectStampFunc = (
    selectedStamp: any,
    page: any,
    setSelectedStamp: any,
    fabricCanvasRef: any,
    setStampDataArr: any,
) => {
    if (!selectedStamp || !fabricCanvasRef.current) return;

    const url = stampImages[selectedStamp?.code];
    if (!url) return;

    fabric.Image.fromURL(url, (img) => {
        img.set({
            left: 100,
            top: 100,
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: true,
            hasControls: true,
            hasBorders: false,
            hoverCursor: "move",
        });

        (img as any).metadata = {
            code: selectedStamp.code,
            pageNumber: page,
            addedOn: Date.now(),
            isNew: true,
        };

        addStampWithDeleteIcon(
            img,
            {
                code: selectedStamp?.code,
                name: selectedStamp?.name,
                pageNumber: page + 1,
                isNew: true,
            },
            fabricCanvasRef,
            setStampDataArr,
            setSelectedStamp
        );
    });
};

const overlayFun = (overlays: any) => {
    const map: Record<number, any[]> = {};

    overlays?.stamps?.forEach((o: any) => {
        const pg = Number(o?.position?.pageNumber ?? 1);
        if (!map[pg]) map[pg] = [];
        map[pg].push(o);
    });

    return map;
};

export { addStampWithDeleteIcon, pdfRender, selectStampFunc, overlayFun };
