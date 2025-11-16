import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from './contexts/settings-context.tsx'
import { ExampleProvider } from './contexts/examples-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ExampleProvider>
        <App />
      </ExampleProvider>
    </SettingsProvider>
  </StrictMode>,
)
