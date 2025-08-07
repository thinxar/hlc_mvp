import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import './Layout.css'
import { PdfViewerPage } from './pages/PdfViewerPage'
import { HomePage } from './pages/home/HomePage'
import TiffViewerPage from './pages/TiffViewerPage'
import '@mantine/core/styles.css';
import { useEffect } from 'react'
import axios from 'axios'

function App() {

  useEffect(() => {
    axios.get('/api/hello').then()
  })

  return (
    <div className='min-h-screen bg-gradient-to-br bColor relative overflow-hidden' >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/app/pdfViewer' element={<PdfViewerPage />} />
          <Route path='/app/tiffViewer' element={<TiffViewerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App