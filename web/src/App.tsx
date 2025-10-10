import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { MainLayout } from './common/layout/MainLayout';
import './Layout.css';
import { HomePage } from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import { PolicyResultPage } from './pages/policyResult/PolicyResultPage';
import './themes/blue/Colors.css';
import './themes/colorDef.css';
import './style/FieldGroupContainer.css';
import './style/ResponsiveLayout.css';

function App() {

  return (
    <div className='min-h-screen bg-gradient-to-br bColor relative overflow-hidden' >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace={true} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/app/' element={<MainLayout />} >
            <Route path='home' element={<HomePage />} />
            <Route path='policy/:policyId' element={<PolicyResultPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App