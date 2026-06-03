import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import profileImg from "../assets/profile.png"
import "./Sidebar.css"
import { useSidebar } from '../contexts/SidebarContext.js'
import { useAuth } from '../contexts/AuthContext'

// Inline SVG icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const AnalyzeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const RoadmapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l2-6 4 3 3-8 4 5 3-2 2 8" />
    <line x1="3" y1="21" x2="21" y2="21" />
  </svg>
)

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="12 8 12 12 14 14" />
    <path d="M3.05 11a9 9 0 1 0 .5-4.5L1 5v5h5" />
  </svg>
)

const ResumeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const navItems = [
  { to: '/dashboard',      label: 'Dashboard',      Icon: DashboardIcon },
  { to: '/analyze',        label: 'Analyze Skills',  Icon: AnalyzeIcon },
  { to: '/roadmap',        label: 'Roadmap',         Icon: RoadmapIcon },
  { to: '/history',        label: 'History',         Icon: HistoryIcon },
  { to: '/resumeanalyzer', label: 'Resume AI',       Icon: ResumeIcon },
  { to: '/profile',        label: 'Profile',         Icon: ProfileIcon },
]

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar, toggleSidebar } = useSidebar()
  const { user } = useAuth()
  const navigate = useNavigate()

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`sidebar ${isSidebarOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
        {/* ─── HEADER ─────────────────────── */}
        <div className="sidebar-header">
          <button
            className="sidebar-logo-btn"
            onClick={() => navigate('/')}
            title="Go to Home"
          >
            <img src={logo} alt="CareerGenie" className="sidebar-logo" />
          </button>
          <button
            className="sidebar-close-btn"
            onClick={closeSidebar}
            title="Close sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ─── NAV SECTION LABEL ──────────── */}
        <p className="sidebar-section-label">Navigation</p>

        {/* ─── NAV LINKS ──────────────────── */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidelink ${isActive ? 'sidelink--active' : ''}`}
              title={!isSidebarOpen ? label : undefined}
            >
              <span className="sidelink-icon"><Icon /></span>
              <span className="sidelink-label">{label}</span>
              <span className="sidelink-active-indicator" />
            </NavLink>
          ))}
        </nav>

        {/* ─── USER CARD ──────────────────── */}
        <div className="sidebar-user" onClick={() => navigate('/profile')}>
          <div className="sidebar-user-avatar">
            <img src={profileImg} alt="user" />
            <span className="sidebar-user-status" />
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{userName}</p>
            <p className="sidebar-user-email">{userEmail}</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="sidebar-user-arrow">
            <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
