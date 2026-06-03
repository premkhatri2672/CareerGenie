import React from 'react'
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Footer from './components/Footer'

import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import Analyze from "./pages/Analyze";
import History from "./pages/History";
import Roadmap from "./pages/Roadmap";
import Courses from "./pages/Courses";
import Bookmarks from "./pages/Bookmarks";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSidebar } from './contexts/SidebarContext.js';

const App = () => {
  const { isSidebarOpen, sidebarWidth, toggleSidebar } = useSidebar();

  const location = useLocation();

  
  const hideNavbarRoutes = ["/dashboard", "/analyze", "/history", "/roadmap", "/courses", "/resumeanalyzer", "/bookmarks"];
  const hideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div>

      {}
      {!hideNavbar && <Navbar />}

      <Routes>

        {}
        <Route path="/" element={
          <>
            <Hero />
            <About />
            <Footer />
          </>
        } />

        {}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {}

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="app">
              <Sidebar />
              <div className="main-content" style={{marginLeft: `${sidebarWidth}px`, transition: 'margin-left 0.3s ease'}}>
                <div className="toggle-header">
                  <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                    {isSidebarOpen ? '✕' : '☰'}
                  </button>
                </div>
                <Dashboard />
              </div>
            </div>
          </ProtectedRoute>
        } />


        <Route path="/analyze" element={
          <ProtectedRoute>
            <div className="app">
              <Sidebar />
<div className="main-content" style={{marginLeft: `${sidebarWidth}px`, transition: 'margin-left 0.3s ease'}}>
                <div className="toggle-header">
                  <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                    {isSidebarOpen ? '✕' : '☰'}
                  </button>
                </div>
                <Analyze />
              </div>
            </div>
          </ProtectedRoute>
        } />



        <Route path="/history" element={
          <ProtectedRoute>
            <div className="app">
              <Sidebar />
<div className="main-content" style={{marginLeft: `${sidebarWidth}px`, transition: 'margin-left 0.3s ease'}}>
                <div className="toggle-header">
                  <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                    {isSidebarOpen ? '✕' : '☰'}
                  </button>
                </div>
                <History />
              </div>
            </div>
          </ProtectedRoute>
        } />



        <Route path="/roadmap" element={
          <ProtectedRoute>
            <div className="app">
              <Sidebar />
              <div className="main-content" style={{marginLeft: `${sidebarWidth}px`, transition: 'margin-left 0.3s ease'}}>
                <div className="toggle-header">
                  <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                    {isSidebarOpen ? '✕' : '☰'}
                  </button>
                </div>
                <Roadmap />
              </div>
            </div>
          </ProtectedRoute>
        } />
</xai:function_call >

<xai:function_call name="edit_file">
<parameter name="path">src/App.jsx

        <Route path="/courses" element={
          <ProtectedRoute>
            <div className="app">
              <Sidebar />
              <div className="main-content" style={{marginLeft: `${sidebarWidth}px`, transition: 'margin-left 0.3s ease'}}>
                <div className="toggle-header">
                  <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                    {isSidebarOpen ? '✕' : '☰'}
                  </button>
                </div>
                <Courses />
              </div>
            </div>
          </ProtectedRoute>
        } />

      <Route path="/resumeanalyzer" element={
          <ProtectedRoute>
            <div className="app">
              <Sidebar />
              <div className="main-content">
                <ResumeAnalyzer/>
              </div>
            </div>
          </ProtectedRoute>
        } />
      <Route path="/bookmarks" element={
          <ProtectedRoute>
            <div className="app">
              <Sidebar />
              <div className="main-content">
                <Bookmarks/>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>

    </div>
  )
}

export default App