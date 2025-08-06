import { IoChevronBackOutline } from "react-icons/io5";
import { TIFFViewer } from "../components/TiffViewWithOverlay";
import { FaRegFileLines } from "react-icons/fa6";

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
            <div className="max-w-4xl mx-auto p-5 min-h-screen">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <FaRegFileLines size={16} className='text-white h-6 w-6' />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-100">TIFF Endorsement</h1>
                        </div>
                        <p className="text-slate-200">Add endorsements and signatures to your TIFF documents</p>
                    </div>
                    <div className='flex items-center gap-1 text-slate-200 cursor-pointer'
                        onClick={() => window.history.back()}>
                        <IoChevronBackOutline size={16} />
                        Back
                    </div>
                </div>
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
        </div>
    )
}

export default TiffViewerPage