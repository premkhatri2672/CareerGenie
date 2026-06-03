import React, { useState, useEffect } from 'react'
import { getUserAnalyses } from '../utils/ai.js'
import historyIcon from "../assets/history.png"
import "./Dashboard.css" // Base premium styling
import "./History.css" // Specific overrides

const History = () => {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [animateIn, setAnimateIn] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getUserAnalyses()
        if (data && data.length > 0) {
          setAnalyses(data)
        } else {
          // Fallback mock data if no real data exists yet
          setAnalyses([
            { id: 1, role_transition: "Frontend Developer", score: 85, created_at: new Date(Date.now() - 3*86400000).toISOString(), status: "completed" },
            { id: 2, role_transition: "Fullstack Developer", score: 72, created_at: new Date(Date.now() - 7*86400000).toISOString(), status: "completed" },
            { id: 3, role_transition: "React Developer", score: 92, created_at: new Date(Date.now() - 14*86400000).toISOString(), status: "completed" },
          ])
        }
      } catch (err) {
        console.error('Failed to load analyses:', err)
      } finally {
        setLoading(false)
        setTimeout(() => setAnimateIn(true), 100)
      }
    }
    loadData()
  }, [])

  const avgScore = analyses.length > 0 ? Math.round(analyses.reduce((sum, a) => sum + (a.score || 0), 0) / analyses.length) : 0
  const bestScore = analyses.length > 0 ? Math.max(...analyses.map(a => a.score || 0)) : 0

  let selectedMissingSkills = []
  let selectedRoadmap = []
  let selectedCourses = []

  if (selectedAnalysis) {
    try {
      selectedMissingSkills = typeof selectedAnalysis.missing_skills === 'string'
        ? JSON.parse(selectedAnalysis.missing_skills || '[]')
        : (selectedAnalysis.missing_skills || [])
    } catch (e) {
      console.error(e)
    }
    try {
      selectedRoadmap = typeof selectedAnalysis.roadmap === 'string'
        ? JSON.parse(selectedAnalysis.roadmap || '[]')
        : (selectedAnalysis.roadmap || [])
    } catch (e) {
      console.error(e)
    }
    try {
      selectedCourses = typeof selectedAnalysis.courses === 'string'
        ? JSON.parse(selectedAnalysis.courses || '[]')
        : (selectedAnalysis.courses || [])
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loader">
          <div className="loader-spinner" />
          <p>Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='dashboard'>
      {/* ─── HEADER ─── */}
      <div className="dash-header">
        <div className="dash-header-left">
          <div className="greeting-text">
            <div>
              <h1><span className="gradient-text">Analysis History</span> 📊</h1>
              <p className="header-subtitle">Track all your career skill assessments and growth</p>
            </div>
          </div>
        </div>
        <div className="dash-header-right">
          <div className="header-profile" style={{ cursor: 'default' }}>
            <img src={historyIcon} alt="history" style={{filter: 'brightness(0) invert(1)'}} />
            <span>History Log</span>
          </div>
        </div>
      </div>

      <div className="dash-content">
        {/* ─── STATS ─── */}
        <div className="stats-grid-4">
          <div className={`metric-card ${animateIn ? 'animate-in' : ''}`} style={{ '--delay': '0s' }}>
            <div className="metric-icon-wrap" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>📊</div>
            <div className="metric-info">
              <span className="metric-value">{analyses.length}</span>
              <span className="metric-label">Total Analyses</span>
            </div>
          </div>
          <div className={`metric-card ${animateIn ? 'animate-in' : ''}`} style={{ '--delay': '0.1s' }}>
            <div className="metric-icon-wrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>🏆</div>
            <div className="metric-info">
              <span className="metric-value">{bestScore}%</span>
              <span className="metric-label">Best Score</span>
            </div>
          </div>
          <div className={`metric-card ${animateIn ? 'animate-in' : ''}`} style={{ '--delay': '0.2s' }}>
            <div className="metric-icon-wrap" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>📈</div>
            <div className="metric-info">
              <span className="metric-value">{avgScore}%</span>
              <span className="metric-label">Average Score</span>
            </div>
          </div>
        </div>

        {/* ─── HISTORY LIST ─── */}
        <div className='glass-card' style={{ marginTop: '1.5rem', animation: 'slideInUp 0.5s ease both', animationDelay: '0.3s' }}>
          <div className="card-header">
            <h3>📋 Complete History</h3>
          </div>
          <div className="table-wrap">
            <table className="dash-table history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Target Role</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((a, i) => (
                  <tr key={a.id || i}>
                    <td>{new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td><span className="table-role">{a.role_transition || a.role || 'General'}</span></td>
                    <td>
                      <div className="score-cell">
                        <div className="score-ring-mini" style={{
                           background: `conic-gradient(${a.score >= 75 ? '#10b981' : a.score >= 50 ? '#f59e0b' : '#ef4444'} ${a.score || 0}%, transparent 0)`
                        }}>
                           <div className="score-ring-inner"></div>
                        </div>
                        <span className={`table-score ${a.score >= 75 ? 'high' : a.score >= 50 ? 'mid' : 'low'}`}>
                          {a.score || 0}%
                        </span>
                      </div>
                    </td>
                    <td><span className={`status-pill ${(a.status || 'completed').toLowerCase()}`}>{a.status || 'Completed'}</span></td>
                    <td><button className="action-btn-secondary view-btn" onClick={() => setSelectedAnalysis(a)}>View Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── RESULT DETAIL MODAL ─── */}
      {selectedAnalysis && (
        <div className="result-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 10, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div className="result-modal-content glass-card slide-up" style={{
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--card-bg)',
            border: 'var(--card-border)',
            borderRadius: '24px',
            padding: '2rem',
            position: 'relative',
            boxShadow: 'var(--shadow-premium)'
          }}>
            <button className="close-modal-btn" onClick={() => setSelectedAnalysis(null)} style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}>✕</button>
            
            <div className="result-header" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div className="score-ring">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="modal-history-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#modal-history-grad)" strokeWidth="8"
                    strokeDasharray="282.74" strokeDashoffset={282.74 - (selectedAnalysis.score / 100) * 282.74}
                    strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                  <text x="50" y="58" textAnchor="middle" fill="white" fontSize="22" fontWeight="800">{selectedAnalysis.score}%</text>
                </svg>
              </div>
              <div className="result-title">
                <span className="card-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'inline-block', marginBottom: '0.4rem' }}>
                  Historical Analysis Record
                </span>
                <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#fff' }}>{selectedAnalysis.role_transition || 'General Analysis'}</h2>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  Analyzed on {new Date(selectedAnalysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="dash-grid-3" style={{ marginBottom: '2rem', gap: '1.25rem' }}>
              {/* Missing Skills */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <h4 style={{ color: '#fbbf24', fontSize: '0.95rem', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ⚠️ Skill Gaps (Focus Areas)
                </h4>
                {selectedMissingSkills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedMissingSkills.map((skill, index) => (
                      <span key={index} style={{
                        padding: '0.4rem 0.7rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        color: '#fbbd23',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    No missing skills recorded. Outstanding fit!
                  </p>
                )}
              </div>

              {/* Steps */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <h4 style={{ color: '#818cf8', fontSize: '0.95rem', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🗺️ Timeline Roadmap
                </h4>
                {selectedRoadmap.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedRoadmap.slice(0, 4).map((step, index) => (
                      <li key={index} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4' }}>
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '18px',
                          height: '18px',
                          background: '#818cf8',
                          color: '#fff',
                          borderRadius: '50%',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    No timeline roadmap available.
                  </p>
                )}
              </div>

              {/* Courses */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <h4 style={{ color: '#ef4444', fontSize: '0.95rem', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🎥 Free YouTube Courses
                </h4>
                {selectedCourses.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedCourses.map((course, index) => {
                      // Handle new format: "YouTube: Title (url)" or old format: "YouTube: Title by Channel"
                      let displayTitle = course;
                      let youtubeUrl = '';

                      // Check for new format with URL in parentheses
                      const urlMatch = course.match(/YouTube: (.+?) \((https?:\/\/[^\)]+)\)/);
                      if (urlMatch) {
                        displayTitle = urlMatch[1].trim();
                        youtubeUrl = urlMatch[2];
                      } else if (course.includes('YouTube:')) {
                        // Old format - extract skill and do search
                        const skillMatch = course.match(/YouTube: (.+?) by/);
                        const skillName = skillMatch ? skillMatch[1] : course.replace('YouTube: ', '');
                        displayTitle = `YouTube: ${skillName}`;
                        youtubeUrl = `https://www.youtube.com/search?q=${encodeURIComponent(skillName)}+tutorial`;
                      } else if (course.includes('watch?v=') || course.includes('youtu.be')) {
                        // Direct YouTube URL
                        youtubeUrl = course.startsWith('http') ? course : `https://www.youtube.com/${course}`;
                        displayTitle = 'YouTube Video';
                      } else {
                        // Fallback - use search
                        youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(course)}+tutorial`;
                      }
                      return (
                        <a key={index} href={youtubeUrl} target="_blank" rel="noopener noreferrer" style={{
                          padding: '0.5rem 0.7rem',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                        >
                          <span>▶️</span>
                          <span style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px'
                          }} title={displayTitle}>{displayTitle}</span>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    No specific courses recommended.
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <button className="action-btn-primary" onClick={() => setSelectedAnalysis(null)} style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}>
                Close Log Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History
