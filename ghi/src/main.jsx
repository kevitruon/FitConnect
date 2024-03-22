import React from 'react'
import { AuthProvider } from '@galvanize-inc/jwtdown-for-react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


const baseUrl = import.meta.env.VITE_API_HOST

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider baseUrl={baseUrl}>
            <App />
        </AuthProvider>
    </React.StrictMode>
)
