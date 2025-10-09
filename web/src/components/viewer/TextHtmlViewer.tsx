import { Loader } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TextHtmlViewer = ({ endPoint, file }: any) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fileName = file?.pdfFiles?.fileName || 'file';
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  useEffect(() => {
  const fetchFile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(endPoint, { responseType: 'text' });
      setContent(response.data);
    } catch (error:any) {
      toast.error("Failed to load file");
    } finally {
      setLoading(false);
    }
  };

  fetchFile();
}, [endPoint]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-black">
        <Loader type="bars" color="blue" />
        <div className="mt-2 font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-5 w-full h-full">
      <div className="flex justify-between p-4">
        <div className="text-base font-semibold pr-text">{fileName}</div>
      </div>

      <div className="h-[80vh] overflow-auto p-4 border border-gray-200 rounded-2xl bg-white text-black">
        {fileExtension === 'html' || fileExtension === 'htm' ? (
          <iframe
            srcDoc={content}
            title="HTML Preview"
            className="w-full h-[70vh] border-none"
          />
        ) : (
          <pre className="whitespace-pre-wrap break-words">{content}</pre>
        )}
      </div>
    </div>
  );
};

export { TextHtmlViewer };