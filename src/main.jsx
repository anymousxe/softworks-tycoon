import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'glass-panel text-white border-white/10',
                    style: {
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(12px)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                }}
            />
        </BrowserRouter>
    </React.StrictMode>,
)
