import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { MainLayout } from './common/layout/MainLayout';
import PageNotFoundX from './common/pages/PageNotFoundX';
import './Layout.css';
import { CustomViewerPage } from './pages/customViewer/CustomViewerPage';
import { CustomViewerViewPage } from './pages/customViewer/view/CustomViewerViewPage';
import LandingPage from './pages/landingPage/LandingPage';
import LoginPage from './pages/login/LoginPage';
import { routes } from './routes';
import './style/FieldGroupContainer.css';
import './style/ResponsiveLayout.css';
import './themes/blue/Colors.css';
import './themes/colorDef.css';

function App() {

  return (
    <div className='min-h-screen bg-linear-to-br bColor relative overflow-hidden' >
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/login" replace={true} />} /> */}
          <Route path="/" element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />

          <Route path='app/CustomViewer/NG' element={<CustomViewerPage pageName="customViewer" />} />
          <Route path='app/CustomViewer/operation' element={<CustomViewerViewPage pageName="customViewer" />} />

          {/* <Route path='/app/' element={<MainLayout />} >
            <Route path='home' element={<HomePage />} />
            <Route path='policy/:policyId' element={<PolicyResultPage />} />
            <Route path='submission' element={<SubmissionPage />} />
          </Route> */}

          <Route path="/app" element={<MainLayout />}>
            {routes}
            <Route path="*" element={<PageNotFoundX />} />
          </Route>


          <Route path='*' element={<PageNotFoundX />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App