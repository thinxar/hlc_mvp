import { TIFFViewer } from "../components/TiffViewWithOverlay";

const TiffViewerPage = () => {

    const image = '/images/multiple.tiff'

    const overlays = [
        {
            page: 1,
            imageUrl: '/images/horse.JPEG',
            x: 100,
            y: 150,
            width: 100,
            height: 50
        },
        {
            page: 2,
            imageUrl: '/images/horse.JPEG',
            x: 100,
            y: 100,
            width: 250,
            height: 250
        }
    ];

    return (
        <div className="text-white">
            <TIFFViewer
                overlays={overlays}
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