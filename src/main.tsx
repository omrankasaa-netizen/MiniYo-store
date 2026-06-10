import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TRPCProvider } from '@/providers/trpc'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </ErrorBoundary>
  </StrictMode>,
)
