import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import './Layout.css'
import { PdfViewerPage } from './pages/PdfViewerPage'
import { HomePage } from './pages/home/HomePage'

function App() {

  return (
    <div 
    className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'
    >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/app/pdfViewer' element={<PdfViewerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App