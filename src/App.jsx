import React from 'react'
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from 'framer-motion'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Footer from './components/Footer'
import HomeVideoLayout from './components/HomeVideoLayout'
import './components/HomeVideoLayout.css'

import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import Analyze from "./pages/Analyze"
import History from "./pages/History"
import Roadmap from "./pages/Roadmap"
import ResumeAnalyzer from "./pages/ResumeAnalyzer"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ProtectedRoute from "./components/ProtectedRoute"
import { useSidebar } from './contexts/SidebarContext.js'


const DashboardLayout = ({ children }) => {
  const { isSidebarOpen, sidebarWidth, toggleSidebar } = useSidebar()

  return (
    <div className="app-shell">
      <Sidebar />
      <div
        className="app-main"
        style={{ marginLeft: `${isSidebarOpen ? sidebarWidth || 260 : 0}px`, transition: 'margin-left 0.32s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {}
        <div className="app-topbar">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: 'easeInOut' }
}

const App = () => {
  const location = useLocation()

  const hideNavbarRoutes = ["/dashboard", "/analyze", "/history", "/roadmap", "/resumeanalyzer", "/profile"]
  const hideNavbar = hideNavbarRoutes.some(route => location.pathname.startsWith(route))

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {}
          <Route path="/" element={
            <motion.div {...pageTransition}>
              <HomeVideoLayout>
                <Hero />
                <About />
                <Footer />
              </HomeVideoLayout>
            </motion.div>
          } />

          {}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout><Dashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/analyze" element={
            <ProtectedRoute>
              <DashboardLayout><Analyze /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <DashboardLayout><History /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/roadmap" element={
            <ProtectedRoute>
              <DashboardLayout><Roadmap /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/resumeanalyzer" element={
            <ProtectedRoute>
              <DashboardLayout><ResumeAnalyzer /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout><Profile /></DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
