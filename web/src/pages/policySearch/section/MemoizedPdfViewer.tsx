import React from "react";
import { PdfViewer } from "./PdfViewer";

export const MemoizedPdfViewer = React.memo(PdfViewer, (prevProps, nextProps) => {
    return prevProps.file?.fileName === nextProps.file?.fileName;
});