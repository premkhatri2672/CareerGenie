import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './App.css'
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from './contexts/SidebarContext.js';
import { AuthProvider } from './contexts/AuthContext.jsx';
import HotToaster from './components/Toaster.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <SidebarProvider>
        <App />
        <HotToaster />
      </SidebarProvider>
    </AuthProvider>
  </BrowserRouter>
)
