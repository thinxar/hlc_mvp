import { toast } from "react-toastify";
import { handleError } from "wire/ErrorHandler";
// import { useFormstore } from "wire/StoreFactory";

export const saveOverlay = async ({
  canvasRef,
  page,
  overlayType = "stamp",
  file,
  uploadEndPoint,
  setSelectedFile,
  setSelectedOverlay,
  setStampDataArr,
  handleFetch,
}: any) => {
  try {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newObjects = canvas
      .getObjects()
      .filter((o: any) => o.metadata?.isNew);

    if (!newObjects.length) {
      toast.info("No new stamp to save");
      return;
    }

    const formatted = newObjects.map((o: any) => ({
      type: overlayType,
      code: o.metadata?.code ?? null,
      pageNumber: page + 1,
      left: o.left,
      top: o.top,
      scaleX: o.scaleX,
      scaleY: o.scaleY,
      rotation: o.angle,
      text: o.text ?? null,
    }));

    const res = await uploadEndPoint.post({
      policyFileId: file?.pdfFiles?.id || file?.id,
      [overlayType]: formatted
    });

    setSelectedFile((prev: any) => ({
      ...prev,
      stamps: res?.stamps ?? prev?.stamps,
      texts: res?.texts ?? prev?.texts,
      images: res?.images ?? prev?.images,
    }));

    handleFetch();
    // useFormstore(fileDetailPoint, {}).query({}).then((res) => {
    //   res.result?.map((e) => {
    //     return setSelectedFile((prev: any) => ({
    //       ...prev,
    //       stamps: e?.stamps ?? prev?.stamps,
    //       texts: e?.result ?? prev?.texts,
    //       images: e?.result ?? prev?.images,
    //     }));
    //   })
    // })
    toast.success("Stamp added successfully");
    setSelectedOverlay(null);
    setStampDataArr(null)
  } catch (err) {
    handleError(err);
  }
};
