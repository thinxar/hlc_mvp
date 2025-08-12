import '@mantine/core/styles.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import './Layout.css'
import { HomePage } from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage'
import { PolicyResultPage } from './pages/policySearch/PolicyResultPage'
import { UserGridPage, UserNewPage, UserViewPage } from './pages'

function App() {

  return (
    <div className='min-h-screen bg-gradient-to-br bColor relative overflow-hidden' >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace={true} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/app/home' element={<HomePage />} />
          <Route path='/app/policy/:policyId' element={<PolicyResultPage />} />


          <Route path='/app/admin/userManagement' element={<UserGridPage />} />
          <Route path='/app/admin/userManagement/view/:id' element={<UserViewPage />} />
          <Route path='/app/admin/userManagement/new' element={<UserNewPage />} />
          <Route path='/app/home' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App