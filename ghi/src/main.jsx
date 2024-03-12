import React from 'react'
import { AuthProvider } from '@galvanize-inc/jwtdown-for-react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

//const baseUrl = import.meta.env.VITE_API_HOST
const baseUrl = 'http://localhost:8000'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider baseUrl={baseUrl}>
            <App />
        </AuthProvider>
    </React.StrictMode>
)
