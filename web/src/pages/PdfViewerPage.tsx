import { PdfViewWithOverlay } from '../components/PdfViewWithOverlay'

function PdfViewerPage() {
    return (
        <>
            <PdfViewWithOverlay 
            // pdfUrlFromApi={"https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"}
            pdfUrlFromApi="https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf"
                imageUrlFromApi="https://picsum.photos/200/300.jpg"
                pageIndex={0}
                position={{ x: 250, y: 200 }}
                scale={0.7} />
        </>
    )
}

export { PdfViewerPage };