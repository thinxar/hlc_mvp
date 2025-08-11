import { Button, Loader } from "@mantine/core";
import { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { toast } from "react-toastify";

const ImageViewer = ({ endPoint, file }: any) => {
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await fetch(endPoint);
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file?.pdfFiles?.fileName || "image";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            toast.error("Download failed")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto p-5 w-full h-full">
            <div className="flex justify-between p-4">
                <div className="text-base font-semibold">
                    {file?.pdfFiles?.fileName}
                </div>
                <div className="text-sky-800">
                    <Button onClick={handleDownload} loaderProps={{ type: 'dots' }}
                        loading={loading} className="filled-button"
                        leftSection={<FaDownload className="w-4 h-4" />}>
                        Download
                    </Button>
                </div>
            </div>

            <div className="flex justify-center">
                <img src={endPoint} className="max-h-[80vh] object-contain" alt="preview"
                    onLoad={() => setImageLoading(false)}
                    onError={() => { setImageLoading(false); toast.error("Failed to load image"); }}
                    style={{ display: imageLoading ? "none" : "block" }} />
            </div>

            {imageLoading && (<div className="flex flex-col items-center justify-center min-h-100 text-black">
                <Loader type="bars" color="blue" />
                <div className="mt-2 font-semibold text-lg">Loading...</div>
            </div>)}
        </div>
    );
};

export { ImageViewer };