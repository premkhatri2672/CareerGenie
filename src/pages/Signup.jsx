
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { signup, signInWithGoogle } from "../utils/auth"
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

const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '' }
  if (password.length < 6) return { level: 1, label: 'Too short' }
  if (password.length < 8) return { level: 2, label: 'Weak' }
  const hasUpper = /[A-Z]/.test(password)
  const hasNum = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*]/.test(password)
  if (hasUpper && hasNum && hasSpecial) return { level: 4, label: 'Strong' }
  if ((hasUpper && hasNum) || (hasNum && hasSpecial)) return { level: 3, label: 'Good' }
  return { level: 2, label: 'Fair' }
}

const strengthClasses = ['', 'active-weak', 'active-fair', 'active-good', 'active-strong']

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true })
  }, [user, navigate])

  const handleSignup = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      const toast = (await import('react-hot-toast')).default
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signup(email, password, name)
      setEmailSent(true)
    } catch (error) {
      console.error("Signup error:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google signup error:", error.message)
    }
  }

  const strength = getPasswordStrength(password)

  
  if (emailSent) {
    return (
      <div className="auth-page">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-confirm">
            <span className="auth-confirm-icon">📧</span>
            <h2>Check Your Email</h2>
            <p>We sent a confirmation link to <strong style={{ color: 'white' }}>{email}</strong></p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.82rem' }}>
              Click the link in your email to activate your account, then come back and log in.
            </p>
            <motion.button
              className="auth-btn-primary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Login →
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

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
        <div className="auth-header">
          <span className="auth-logo">✨</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Start your AI-powered career journey today</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          {}
          <motion.button
            type="button"
            onClick={handleGoogleSignup}
            className="auth-btn-google"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          <div className="auth-divider"><span>or</span></div>

          {}
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              className="auth-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {}
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {}
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-password-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                className="auth-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                {showPass
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {password && (
              <>
                <div className="password-strength">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`strength-bar ${i <= strength.level ? strengthClasses[strength.level] : ''}`} />
                  ))}
                </div>
                {strength.label && <p className="strength-text">{strength.label}</p>}
              </>
            )}
          </div>

          <motion.button
            type="submit"
            className="auth-btn-primary"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading
              ? <><span className="loader-spinner mini" style={{ borderTopColor: 'white' }} /> Creating account...</>
              : 'Create Account →'
            }
          </motion.button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Signup
