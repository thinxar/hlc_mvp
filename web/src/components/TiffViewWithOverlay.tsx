import axios from 'axios'
import PropTypes from 'prop-types'
import React, { forwardRef, useEffect } from 'react'
import UTIF from 'utif'
import styles from './styles.module.css'

export const TIFFViewer = forwardRef(function TiffFileViewer(
  { tiff, paginate = 'bottom', currentPage = 0, buttonColor = '#141414', overlays,
    onDocumentLoad = () => { }, printable = false, zoomable = false, ...rest
  }: any,
  ref: any
) {
  // states
  const [_tiff] = React.useState(tiff)
  const [, setTiffs] = React.useState([])
  const [pages, setPages] = React.useState([])
  const [page, setPage] = React.useState(0)

  // refs
  const canvasRef: any = React.useRef(null)
  // const btnPrintRef: any = React.useRef(null)
  // const btnZoomInRef: any = React.useRef(null)
  // const btnZoomOutRef: any = React.useRef(null)
  const paginateLTRRef: any = React.useRef(null)
  // const paginateBottomRef: any = React.useRef(null)

  const overlayMap = React.useMemo(() => {
    const map: any = {};
    overlays.forEach((o: any) => {
      const index = o.page - 1;
      if (!map[index]) map[index] = [];
      map[index].push(o);
    });
    return map;
  }, [overlays]);

  function imgLoaded(e: any) {
    var ifds = UTIF.decode(e.target.response)
    const _tiffs: any = ifds.map(function (ifd, index) {
      UTIF.decodeImage(e.target.response, ifd)
      var rgba = UTIF.toRGBA8(ifd)
      var canvas = document.createElement('canvas')
      canvas.width = ifd.width
      canvas.height = ifd.height
      var ctx: any = canvas.getContext('2d')
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
      if (index === 0) {
        //@ts-ignore
        document.getElementById('tiff-inner-container').appendChild(canvas)
      }
      return canvas
    })
    setPages(_tiffs)
    setTiffs(_tiffs)
    onDocumentLoad(_tiffs)
  }

  async function displayTIFF(tiffUrl: any) {
    const response = await axios.get(tiffUrl, {
      responseType: 'arraybuffer'
    })
    imgLoaded({ target: { response: response.data } })
  }

  React.useEffect(() => {
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

  // const handlePrintClick = () => {
  //   try {
  //     if (printable) {
  //       btnPrintRef.current.style.visibility = 'hidden'
  //       btnZoomInRef.current.style.visibility = 'hidden'
  //       btnZoomOutRef.current.style.visibility = 'hidden'
  //     }

  //     if (paginateLTRRef.current)
  //       paginateLTRRef.current.style.visibility = 'hidden'

  //     if (paginateBottomRef.current)
  //       paginateBottomRef.current.style.visibility = 'hidden'

  //     if (pages.length > 1) {
  //       pages.forEach((page, index) => {
  //         if (index > 0) {
  //           canvasRef.current.style.display = 'block'
  //           canvasRef.current.appendChild(page)
  //         }
  //       })
  //       window.print()

  //       pages.forEach((page, index) => {
  //         if (index > 0) {
  //           canvasRef.current.removeChild(page)
  //         } else {
  //           canvasRef.current.style.display = 'flex'
  //         }
  //       })
  //     } else {
  //       window.print()
  //     }
  //   } catch (error) {
  //     console.error('Error')
  //   } finally {
  //     if (printable) {
  //       btnPrintRef.current.style.visibility = 'visible'
  //       btnZoomInRef.current.style.visibility = 'visible'
  //       btnZoomOutRef.current.style.visibility = 'visible'
  //     }

  //     if (paginateLTRRef.current)
  //       paginateLTRRef.current.style.visibility = 'visible'

  //     if (paginateBottomRef.current) {
  //       paginateBottomRef.current.style.visibility = 'visible'
  //     }
  //   }
  // }

  // const handleZoomInClick = () => {
  //   const canvas = canvasRef.current
  //   const currentWidth = canvas.clientWidth
  //   const currentHeight = canvas.clientHeight
  //   canvas.style.width = currentWidth + 100 + 'px'
  //   canvas.style.height = currentHeight + 100 + 'px'
  // }

  // const handleZoomOutClick = () => {
  //   const canvas = canvasRef.current
  //   const currentWidth = canvas.clientWidth
  //   const currentHeight = canvas.clientHeight
  //   canvas.style.width = currentWidth - 100 + 'px'
  //   canvas.style.height = currentHeight - 100 + 'px'
  // }

  useEffect(() => {
    displayTIFF(_tiff)

  }, [_tiff])

  useEffect(() => {
    if (pages.length > 0) {
      canvasRef.current.innerHTML = ''
      canvasRef.current.appendChild(pages[page])
    }
  }, [page, pages])

  React.useImperativeHandle(ref, () => ({
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

  return (
    <div className="mx-auto p-5">
      <div className={styles.tiffContainer} id='tiff-container' ref={ref} {...rest} >
        {/* <button onClick={downloadMultiPageTIFF} className={styles.tiffBtnPrint}>
          Download (TIFF)
        </button> */}
        {/* {printable || zoomable ? (
          <div className={styles.tiffButtons}>
            {zoomable && (
              <div>
                <button id='btn-zoom-in' className={styles.tiffBtnZoom}
                  type='button' onClick={handleZoomInClick} ref={btnZoomInRef} >
                  <svg
                    xmlns='http://www.w3.org/2000/svg' fill='none'
                    viewBox='0 0 24 24' stroke='currentColor' className='w-6 h-6'>
                    <path d='M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5zm-4.5 8h4v-4h1v4h4v1h-4v4h-1v-4h-4v-1z' />
                  </svg>
                </button>
                <button id='btn-zoom-out' className={styles.tiffBtnZoom} type='button'
                  onClick={handleZoomOutClick} ref={btnZoomOutRef}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg' fill='none'
                    viewBox='0 0 24 24' stroke='currentColor' className='w-6 h-6'>
                    <path d='M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5zm-4.5 8h9v1h-9v-1z' />
                  </svg>
                </button>
              </div>
            )}
            {printable && (
              <button id='btn-print' onClick={handlePrintClick}
                ref={btnPrintRef} className={styles.tiffBtnPrint} type='button'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'
                  strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                  <path strokeLinecap='round' strokeLinejoin='round'
                    d='M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z'
                  />
                </svg>
              </button>
            )}
          </div>
        ) : null} */}

        <div className={styles.tiffArrow}>
          <div id='tiff-inner-container' className={styles.tiffInner} ref={canvasRef} />
          {paginate === 'ltr' && pages.length > 1 && (
            <div className={styles.tiffAbsolute} id='absolute' ref={paginateLTRRef}>
              <button style={{ backgroundColor: buttonColor }} disabled={page === 0}
                onClick={handlePreviousClick} className={styles.tiffButton} type='button'>
                &lt;
              </button>
              <button style={{ backgroundColor: buttonColor }} disabled={page == pages.length - 1}
                onClick={handleNextClick} className={styles.tiffButton} type='button'>
                &gt;
              </button>
            </div>
          )}
        </div>

        {/* {paginate === 'bottom' && pages.length > 1 && (
          <div id='footer' ref={paginateBottomRef}>
            <button style={{ backgroundColor: buttonColor }} disabled={page === 0}
              onClick={handlePreviousClick} className={styles.tiffAbsolute} type='button'>
              Previous
            </button>
            <span className={styles.tiffSpan}>
              'Page of total' {page + 1}  total: {pages.length}</span>
            <button style={{ backgroundColor: buttonColor }} disabled={page === pages.length - 1}
              onClick={handleNextClick} className={styles.tiffAbsolute} type='button'>
              Next
            </button>
          </div>
        )} */}
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