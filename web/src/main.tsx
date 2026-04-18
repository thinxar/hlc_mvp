import { createRoot } from 'react-dom/client'
import './index.css'
import "tailwindcss"
import { StoreFactoryContext } from '@palmyralabs/rt-forms'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core';
import AppStoreFactory from './wire/StoreFactory.ts'
import { ToastContainer, Zoom } from 'react-toastify'
import { ChartStoreFactoryContext } from '@palmyralabs/rt-apexchart'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <MantineProvider>
    <StoreFactoryContext.Provider value={AppStoreFactory}>
      <ChartStoreFactoryContext.Provider value={AppStoreFactory} >
        <App />
        <ToastContainer
          limit={3} pauseOnFocusLoss={false} autoClose={2000} position="bottom-right" hideProgressBar={false} newestOnTop
          closeOnClick rtl={false} transition={Zoom} pauseOnHover draggable
          style={{ marginTop: '2.1em', zIndex: 99999999 }}
          toastClassName="!bg-white/80 !backdrop-blur-md !text-gray-800 !rounded-2xl !shadow-xl !border !border-white/20 !overflow-hidden"
          className="text-sm! font-semibold! p-4!"
          progressClassName="!bg-linear-to-r !from-pink-500 !to-violet-500 !rounded-full"
        />
      </ChartStoreFactoryContext.Provider>
    </StoreFactoryContext.Provider>
  </MantineProvider>
  // </StrictMode>,
)
