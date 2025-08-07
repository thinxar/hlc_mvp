import '@mantine/core/styles.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import './Layout.css'
import { HomePage } from './pages/home/HomePage'
import { PdfViewerPage } from './pages/PdfViewerPage'
import TiffViewerPage from './pages/TiffViewerPage'
import LoginPage from './pages/login/LoginPage'

function App() {

  return (
    <div className='min-h-screen bg-gradient-to-br bColor relative overflow-hidden' >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace={true} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/app/home' element={<HomePage />} />
          <Route path='/app/pdfViewer' element={<PdfViewerPage />} />
          <Route path='/app/tiffViewer' element={<TiffViewerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App