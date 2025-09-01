import { Loader } from '@mantine/core'
import axios from 'axios'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import UTIF from 'utif'
import { GoDash, GoPlus } from "react-icons/go";
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";


export const TIFFViewer = forwardRef(function TiffFileViewer(
  {
    tiff,
    currentPage = 0,
    overlays = [],
    onDocumentLoad = () => { },
    file
  }: any,
  ref: any
) {
  const [pages, setPages] = useState<HTMLCanvasElement[]>([])
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const canvasRef: any = useRef<HTMLCanvasElement>(null);

  const overlayMap = useMemo(() => {
    const map: Record<number, any[]> = {};
    overlays.forEach((o: any) => {
      const index = o.page - 1;
      if (!map[index]) map[index] = [];
      map[index].push(o);
    });
    return map;
  }, [overlays]);

  const imgLoaded = async () => {
    var response = await axios.get(tiff, { responseType: 'arraybuffer' })
    var ifds = UTIF.decode(response.data)
    const _tiffs = ifds.map((ifd, index) => {
      UTIF.decodeImage(response.data, ifd)
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

  useEffect(() => {
    imgLoaded()
  }, [tiff])

  useEffect(() => {
    if (currentPage >= 0 && currentPage < pages.length) {
      setPage(currentPage)
    }
  }, [currentPage, pages])

  useEffect(() => {
    const originalCanvas = pages[page]
    const displayCanvas = canvasRef.current
    if (!originalCanvas || !displayCanvas) return

    const ctx = displayCanvas.getContext('2d')
    if (!ctx) return

    const scaledWidth = originalCanvas.width * zoom
    const scaledHeight = originalCanvas.height * zoom

    displayCanvas.width = scaledWidth
    displayCanvas.height = scaledHeight

    ctx.setTransform(zoom, 0, 0, zoom, 0, 0)
    ctx.clearRect(0, 0, scaledWidth, scaledHeight)
    ctx.drawImage(originalCanvas, 0, 0)
  }, [pages, page, zoom])

  useImperativeHandle(ref, () => ({
    context: canvasRef.current
  }))

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
    <div className="w-full h-[calc(100vh-115px)] overflow-hidden p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="text-base font-semibold">{file?.pdfFiles?.fileName}</div>
        <div></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap items-center gap-2 p-7">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="py-1 rounded disabled:opacity-50 hover:bg-gray-300">
            <MdOutlineKeyboardArrowUp fontSize={20} />
          </button>
          <span className="text-xl">|</span>
          <button onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
            disabled={page === pages.length - 1}
            className="py-1 rounded disabled:opacity-50 hover:bg-gray-300">
            <MdOutlineKeyboardArrowDown fontSize={20} />
          </button>
          <div className="text-sm text-gray-600">
            Page {page + 1} of {pages.length}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}
            className="py-1 rounded hover:bg-gray-300">
            <GoDash fontSize={20} />
          </div>
          <span className="text-xl">|</span>
          <div onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
            className="py-1 rounded hover:bg-gray-300">
            <GoPlus fontSize={20} />
          </div>
          <div onClick={() => setZoom(1)} className="px-3 py-1 bg-gray-200 rounded">
            Reset
          </div>
        </div>
      </div>

      <div className="w-full flex-1 overflow-auto border border-gray-400 shadow-2xl rounded-2xl bg-white p-2">
        <div className="w-fit h-fit min-w-full min-h-full">
          <div className='grid place-content-center'>
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  )
})

TIFFViewer.propTypes = {
  tiff: PropTypes.string.isRequired,
  currentPage: PropTypes.number,
  overlays: PropTypes.array,
  onDocumentLoad: PropTypes.func,
  file: PropTypes.object
}