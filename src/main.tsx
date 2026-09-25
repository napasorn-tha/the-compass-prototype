import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { BackboneProvider } from './data/BackboneProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BackboneProvider>
      <App />
    </BackboneProvider>
  </React.StrictMode>,
)
