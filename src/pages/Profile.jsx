import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { logout } from '../utils/auth'
import { useAuth } from '../contexts/AuthContext'
import profileImg from '../assets/profile.png'
import "./Dashboard.css"
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [userName, setUserName] = useState('User')
  const [email, setEmail] = useState('user@example.com')
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (user) {
      const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
      setUserName(displayName)
      setNewName(displayName)
      setEmail(user.email || 'user@example.com')
    }
    setTimeout(() => setAnimateIn(true), 100)
  }, [user])

  const handleNameSave = () => {
    localStorage.setItem('userName', newName)
    setUserName(newName)
    setIsEditingName(false)
    toast.success('Name updated!')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const provider = user?.app_metadata?.provider || 'email'
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A'

  return (
    <div className="dashboard">
      {}
      <div className="dash-header">
        <div className="dash-header-left">
          <div className="greeting-text">
            <div>
              <h1>User <span className="gradient-text">Profile</span></h1>
              <p className="header-subtitle">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-content">
        {}
        <div className="glass-card profile-main-card">
          <p className="profile-section-title">Account Info</p>
          <div className="profile-header-wrap">
            <img src={profileImg} alt="Profile" className="profile-avatar" />
            <div className="profile-details-wrap">
              {isEditingName ? (
                <div className="edit-name-group">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="premium-input name-input"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  />
                  <div className="edit-actions">
                    <button onClick={handleNameSave} className="action-btn-primary save-btn">Save</button>
                    <button onClick={() => setIsEditingName(false)} className="action-btn-secondary cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="name-display-group">
                  <h2>{userName}</h2>
                  <p className="email-text">{email}</p>
                  <button onClick={() => setIsEditingName(true)} className="edit-profile-btn">
                    ✏️ Edit Name
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{email}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">{memberSince}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Sign-In Method</span>
              <span className="profile-info-value" style={{ textTransform: 'capitalize' }}>
                <span className="provider-badge">
                  {provider === 'google' ? '🔵' : '📧'} {provider}
                </span>
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Account Status</span>
              <span className="profile-info-value" style={{ color: '#34d399' }}>✅ Active</span>
            </div>
          </div>
        </div>

        {}
        <div className="stats-grid-4">
          {[
            { icon: '📊', value: '12', label: 'Analyses', color: 'rgba(139, 92, 246, 0.15)', textColor: '#a78bfa' },
            { icon: '🗺️', value: '3', label: 'Roadmaps', color: 'rgba(16, 185, 129, 0.15)', textColor: '#34d399' },
            { icon: '⏱️', value: '127h', label: 'Learning', color: 'rgba(245, 158, 11, 0.15)', textColor: '#fbbf24' },
          ].map((m, i) => (
            <div
              key={i}
              className={`metric-card ${animateIn ? 'animate-in' : ''}`}
              style={{ '--delay': `${i * 0.08}s` }}
            >
              <div className="metric-icon-wrap" style={{ background: m.color, color: m.textColor }}>
                {m.icon}
              </div>
              <div className="metric-info">
                <span className="metric-value">{m.value}</span>
                <span className="metric-label">{m.label}</span>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="glass-card">
          <p className="profile-section-title">⚠️ Danger Zone</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Once you log out, you'll need to sign in again to access your dashboard.
          </p>
          <div className="logout-wrap">
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout from CareerGenie
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
