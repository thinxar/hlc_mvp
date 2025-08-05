import { TIFFViewer } from "../components/TiffViewWithOverlay";

const TiffViewerPage = () => {

    const image = '/images/multiple.tiff'

    return (
        <div className="text-white">
            <TIFFViewer
                tiff={image}
                lang='tr'
                paginate='ltr'
                buttonColor='#141414'
                printable
                zoomable
            />
        </div>
    )
}

export default TiffViewerPage