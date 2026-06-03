
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { signInWithGoogle } from "../utils/auth"
import { useAuth } from "../contexts/AuthContext"
import { motion } from 'framer-motion'
import "./Auth.css"

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true })
  }, [user, navigate])

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google login error:", error.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {}
      <Link to="/" className="auth-back-home">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Home
      </Link>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {}
        <div className="auth-header">
          <span className="auth-logo">🧞</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue your career journey</p>
        </div>

        {}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            className="auth-btn-google"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GoogleIcon />
            {loading ? (
              <><span className="loader-spinner mini" style={{ borderTopColor: '#8b5cf6' }} /> Redirecting...</>
            ) : 'Continue with Google'}
          </motion.button>

          <div className="auth-divider"><span>or</span></div>

          <div style={{ 
            textAlign: 'center', 
            padding: '1rem', 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '12px', 
            border: '1px dashed rgba(255,255,255,0.08)',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            📧 Email/password sign-in coming soon
          </div>
        </div>

        <p className="auth-footer-text" style={{ marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/signup">Create one free</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
