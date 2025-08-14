import '@mantine/core/styles.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Topbar } from './components/Topbar'
import './Layout.css'
import { HomePage } from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage'
import { PolicyResultPage } from './pages/policySearch/PolicyResultPage'

function App() {

  return (
    <div className='min-h-screen bg-gradient-to-br bColor relative overflow-hidden' >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace={true} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/app/' element={<Topbar />} >
            <Route path='home' element={<HomePage />} />
            <Route path='policy/:policyId' element={<PolicyResultPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App