
import { TIFFViewer } from 'react-tiff'
import 'react-tiff/dist/index.css'

const Tiff = () => {
  const tiffFile = '/images/multiple.tiff';
  return (
    <div
    >
      <TIFFViewer
        tiff={tiffFile}
        lang='en'
        paginate='ltr'
        buttonColor='#141414'
        printable
        zoomable
        url="https://picsum.photos/200/300.jpg"
      />

    </div>
  )
}

export default Tiff