import { createRoot } from 'react-dom/client'
import './index.css'
import "tailwindcss"
import { StoreFactoryContext } from '@palmyralabs/rt-forms'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core';
import AppStoreFactory from './wire/StoreFactory.ts'
import { ToastContainer } from 'react-toastify'
import { ChartStoreFactoryContext } from '@palmyralabs/rt-apexchart'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <MantineProvider>
    <StoreFactoryContext.Provider value={AppStoreFactory}>
      <ChartStoreFactoryContext.Provider value={AppStoreFactory} >
        <App />
        <ToastContainer limit={1} pauseOnFocusLoss={false} autoClose={2000} />
      </ChartStoreFactoryContext.Provider>
    </StoreFactoryContext.Provider>
  </MantineProvider>
  // </StrictMode>,
)
