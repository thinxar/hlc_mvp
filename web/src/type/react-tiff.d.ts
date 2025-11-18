declare module 'react-tiff' {
  import React from 'react';

  export interface TIFFViewerProps {
    tiff: string | File | ArrayBuffer;
    url?: string;
    lang?: string;
    paginate?: 'ltr' | 'rtl';
    buttonColor?: string;
    zoomable?: boolean;
    printable?: boolean;
  }

  export const TIFFViewer: React.FC<TIFFViewerProps>;
}
declare module "tiff.js" {
  const Tiff: any;
  export default Tiff;
}
