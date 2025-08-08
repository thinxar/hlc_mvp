import '@mantine/core/styles.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import './Layout.css'
import { HomePage } from './pages/home/HomePage'
import { PdfViewerPage } from './pages/viewer/PdfViewerPage'
import TiffViewerPage from './pages/viewer/TiffViewerPage'
import LoginPage from './pages/login/LoginPage'
import { PolicyResultPage } from './pages/policySearch/PolicyResultPage'

function App() {

  return (
    <div className='min-h-screen bg-gradient-to-br bColor relative overflow-hidden' >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace={true} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/app/home' element={<HomePage />} />
          <Route path='/app/policy/:policyId' element={<PolicyResultPage />} />
          <Route path='/app/pdfViewer' element={<PdfViewerPage />} />
          <Route path='/app/tiffViewer' element={<TiffViewerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App