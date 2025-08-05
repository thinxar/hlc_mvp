import { FaRegFileLines } from 'react-icons/fa6';
import { PdfViewWithOverlay } from '../components/PdfViewWithOverlay'
import { IoChevronBackOutline } from 'react-icons/io5';

function PdfViewerPage() {
    return (
        <>
            <div className="flex items-center justify-between max-w-4xl mx-auto p-5">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <FaRegFileLines size={16} className='text-white h-6 w-6' />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100">PDF Endorsement</h1>
                    </div>
                    <p className="text-slate-200">Add endorsements and signatures to your PDF documents</p>
                </div>
                <div className='flex items-center gap-1 text-slate-200 cursor-pointer'
                    onClick={() => window.history.back()}>
                    <IoChevronBackOutline size={16} />
                    Back
                </div>
            </div>
            <PdfViewWithOverlay
                pdfUrlFromApi={"https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"}
                // pdfUrlFromApi="https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf"
                imageUrlFromApi="https://picsum.photos/200/300.jpg"
                pageIndex={0}
                position={{ x: 250, y: 200 }}
                scale={0.7} />
        </>
    )
}

export { PdfViewerPage };