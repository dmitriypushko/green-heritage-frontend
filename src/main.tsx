import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './app/styles/global.scss'
import './app/styles/variables.scss'
import './shared/config/i18n.ts'
import App from './App.tsx'
import { ScrollUpFunction } from './features/scroll_to_top/ui/ScrollUpFunc.tsx'


createRoot(document.getElementById('root')!).render(
<BrowserRouter>
  <StrictMode>
    <ScrollUpFunction />
    <App />
  </StrictMode>
</BrowserRouter>,
)
