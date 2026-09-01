import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { SiteDataProvider } from './context/SiteDataContext'

const basename = typeof window !== 'undefined' && window.location.pathname.startsWith('/summit') ? '/summit' : '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <SiteDataProvider>
        <App />
      </SiteDataProvider>
    </BrowserRouter>
  </StrictMode>,
)
