import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { PdfViewerPage } from './pages/PdfViewerPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PdfViewerPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App