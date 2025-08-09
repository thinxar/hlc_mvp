import axios from 'axios'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import UTIF from 'utif'
import styles from './styles.module.css'
import { FaDownload } from 'react-icons/fa6'
import { Loader } from '@mantine/core'

export const TIFFViewer = forwardRef(function TiffFileViewer(
  { tiff, paginate = 'bottom', currentPage = 0, buttonColor = '#141414', overlays = [], onDocumentLoad = () => { },
    printable = false, zoomable = false, file, ...rest }: any, ref: any
) {
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [page, setPage] = useState(0);

  const canvasRef: any = useRef(null);
  const paginateLTRRef: any = useRef(null);

  const overlayMap = useMemo(() => {
    const map: Record<number, any[]> = {};
    overlays.forEach((o: any) => {
      const index = o.page - 1;
      if (!map[index]) map[index] = [];
      map[index].push(o);
    });
    return map;
  }, [overlays]);

  function imgLoaded(e: any) {
    var ifds = UTIF.decode(e.target.response)
    const _tiffs: HTMLCanvasElement[] = ifds.map(function (ifd, index) {
      UTIF.decodeImage(e.target.response, ifd)
      var rgba = UTIF.toRGBA8(ifd)
      var canvas = document.createElement('canvas')
      canvas.width = ifd.width
      canvas.height = ifd.height
      var ctx: any = canvas.getContext('2d')
      if (!ctx) return canvas;
      var img = ctx.createImageData(ifd.width, ifd.height)
      img.data.set(rgba)
      ctx.putImageData(img, 0, 0)
      const currentOverlays = overlayMap[index] || [];
      currentOverlays.forEach((overlay: any) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = overlay.imageUrl;
        image.onload = () => {
          ctx.drawImage(image, overlay.x, overlay.y, overlay.width, overlay.height);
        }
      })
      return canvas
    })
    setPages(_tiffs)
    onDocumentLoad(_tiffs)
  }

  async function displayTIFF(tiffUrl: string) {
    const response = await axios.get(tiffUrl, {
      responseType: 'arraybuffer'
    })
    imgLoaded({ target: { response: response.data } })
  }

  useEffect(() => {
    if (currentPage >= 0 && currentPage < pages.length) {
      setPage(currentPage)
    }
  }, [currentPage])

  const handlePreviousClick = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const handleNextClick = () => {
    if (page < pages.length - 1) {
      setPage(page + 1)
    }
  }

  useEffect(() => {
    displayTIFF(tiff)
  }, [tiff])

  useEffect(() => {
    if (pages.length > 0) {
      canvasRef.current.innerHTML = ''
      canvasRef.current.appendChild(pages[page])
    }
  }, [page, pages])

  useImperativeHandle(ref, () => ({
    context: () => {
      pages.forEach((page, index) => {
        if (index > 0) {
          canvasRef.current.style.display = 'block'
          canvasRef.current.appendChild(page)
        }
      })
      return canvasRef.current
    }
  }))

  const handleDownload = async () => {
    try {
      const response = await fetch(tiff);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file?.pdfFiles?.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download TIFF:', error);
    }
  }

  if (pages.length == 0) {
    return <div className="mx-auto p-5 w-full h-full">
      <div className="flex justify-between p-4">
        <div className="text-base font-semibold">{file?.pdfFiles?.fileName}</div>
        <div></div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-100 text-black">
        <Loader type="bars" color="blue" />
        <div className="mt-2 font-semibold text-lg">Loading...</div>
      </div>
    </div>
  }

  return (
    <div className="mx-auto p-5 w-full h-full">
      <div className="flex justify-between p-4">
        <div className="text-lg font-semibold">{file?.pdfFiles?.fileName}</div>
        <button onClick={handleDownload}
          className="cursor-pointer text-white bg-sky-800 px-4 py-2 rounded-lg flex items-center gap-2 space-x-2 transition duration-200">
          <FaDownload className="w-4 h-4" />
          Download
        </button>
      </div>

      <div className={styles.tiffContainer} id="tiff-container" ref={ref} {...rest}>
        <div>
          <div id='tiff-inner-container' className={styles.tiffInner} ref={canvasRef} />
          {paginate === 'ltr' && pages.length > 1 && (
            <div className={styles.tiffAbsolute} ref={paginateLTRRef}>
              <button disabled={page === 0} onClick={handlePreviousClick}
                className="mx-2 px-4 py-2 rounded bg-amber-300">
                &lt;
              </button>
              <button disabled={page == pages.length - 1} onClick={handleNextClick}
                className="mx-2 px-4 py-2 rounded bg-amber-300">
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

TIFFViewer.propTypes = {
  tiff: PropTypes.string.isRequired,
  paginate: PropTypes.string,
  buttonColor: PropTypes.string,
  onDocumentLoad: PropTypes.func,
  currentPage: PropTypes.number,
  printable: PropTypes.bool,
  zoomable: PropTypes.bool
}