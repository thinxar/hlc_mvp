import { Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";

const ImageViewer = ({ endPoint, file }: any) => {
    const [blob, setBlob] = useState<Blob | null>(null);
    const [fileUrl, setFileUrl] = useState<string>("");

    useEffect(() => {
        fetch(endPoint, { method: "GET" })
            .then((res) => res.blob())
            .then((blobData) => {
                const url = URL.createObjectURL(blobData);
                setBlob(blobData);
                setFileUrl(url);
            })
            .catch((err) => {
                console.error("Failed to fetch file", err);
            });
        return () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        };
    }, []);

    if (!blob || !fileUrl) {
        return <>
            <div className="mx-auto p-5 w-full h-full">
                <div className="flex justify-between p-4">
                    <div className="text-base font-semibold">{file?.pdfFiles?.fileName}</div>
                    <div></div>
                </div>
                <div className="flex flex-col items-center justify-center min-h-100 text-black">
                    <Loader type="bars" color="blue" />
                    <div className="mt-2 font-semibold text-lg">Loading...</div>
                </div>
            </div>
        </>
    }

    return (
        <div className="mx-auto p-5 w-full h-full">
            <div className="flex justify-between p-4">
                <div className="text-base font-semibold">{file?.pdfFiles?.fileName}</div>
                <a href={URL.createObjectURL(blob)}
                    download={file?.pdfFiles?.fileName}>
                    <button className="cursor-pointer text-white bg-sky-800 px-4 py-2 rounded-lg
                    flex items-center space-x-2 transition duration-200">
                        <FaDownload className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </a>
            </div>

            <div className="flex justify-center">
                <img src={endPoint} className="max-h-[80vh] object-contain" alt="image" />
            </div>
        </div>
    );
};

export { ImageViewer };