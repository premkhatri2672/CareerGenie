import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom"
import logo from '../assets/logo.png'
import profileImg from '../assets/profile.png'
import './Navbar.css'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
)

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const navLinks = useMemo(() => {
    if (user) {
      return [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/analyze", label: "Analyze" },
        { to: "/history", label: "History" },
        { to: "/roadmap", label: "Roadmap" },
      ]
    }
    return [
      { to: "/", label: "Home" },
      { to: "/login", label: "Dashboard", locked: true },
      { to: "/login", label: "Analyze", locked: true },
      { to: "/login", label: "History", locked: true },
      { to: "/login", label: "Roadmap", locked: true },
    ]
  }, [user])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    navigate('/')
  }

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || ''

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="CareerGenie" />
        </Link>

        {}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${link.locked ? 'nav-link--locked' : ''} ${isActive && !link.locked ? 'nav-link--active' : ''}`
              }
            >
              <span>{link.label}</span>
              {link.locked && <LockIcon />}
              <span className="nav-link-underline" />
            </NavLink>
          ))}
        </div>

        {}
        <div className="navbar-actions">
          {}
          <div className="navbar-profile" ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="profile-avatar-btn">
              <img src={profileImg} alt="profile" />
              {user && <span className="profile-status-dot" />}
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="navbar-dropdown"
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {user && (
                    <div className="dropdown-header">
                      <img src={profileImg} alt="" className="dropdown-avatar" />
                      <div>
                        <p className="dropdown-name">{userName}</p>
                        <p className="dropdown-email">{user.email}</p>
                      </div>
                    </div>
                  )}
                  <div className="dropdown-divider" />
                  {!user ? (
                    <>
                      <button className="dropdown-item" onClick={() => { navigate('/login'); setDropdownOpen(false) }}>
                        <span>🔑</span> Login
                      </button>
                      <button className="dropdown-item" onClick={() => { navigate('/signup'); setDropdownOpen(false) }}>
                        <span>✨</span> Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false) }}>
                        <span>👤</span> Profile
                      </button>
                      <button className="dropdown-item" onClick={() => { navigate('/dashboard'); setDropdownOpen(false) }}>
                        <span>📊</span> Dashboard
                      </button>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item dropdown-item--danger" onClick={handleLogout}>
                        <span>🚪</span> Logout
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </motion.nav>

      {}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={link.to}
                  className={`mobile-link ${link.locked ? 'mobile-link--locked' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  {link.locked && <LockIcon />}
                </NavLink>
              </motion.div>
            ))}
            <div className="mobile-menu-footer">
              {!user ? (
                <>
                  <button className="btn-ghost" onClick={() => { navigate('/login'); setMobileOpen(false) }}>Login</button>
                  <button className="btn-primary" onClick={() => { navigate('/signup'); setMobileOpen(false) }}>Get Started</button>
                </>
              ) : (
                <button className="btn-ghost" onClick={handleLogout}>Logout</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
