import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getUserAnalyses } from '../utils/ai.js'
import profile from "../assets/profile.png"
import analyzeIcon from "../assets/analyze.png"
import roadmapIcon from "../assets/roadmap.png"

import "./Dashboard.css"


const ROLE_SKILLS = {
  frontend: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Redux", "Webpack", "Jest", "TailwindCSS", "Next.js", "Vue", "Angular", "Sass"],
  backend: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB", "Redis", "Docker", "REST APIs", "GraphQL", "SQL", "Java", "Spring Boot"],
  datascience: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "SQL", "R", "Tableau"],
  devops: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux", "Jenkins", "Ansible", "Git", "Bash"],
  mobile: ["React Native", "Swift", "Kotlin", "Flutter", "iOS", "Android", "Dart", "Objective-C"],
  qa: ["Selenium", "Cypress", "QA Testing", "Jest", "Manual Testing", "Automation", "Postman"]
}


const getRequiredSkills = (role) => {
  const r = role?.toLowerCase() || ''
  if (r.includes('front') || r.includes('react') || r.includes('web') || r.includes('ui')) return ROLE_SKILLS.frontend
  if (r.includes('back') || r.includes('node') || r.includes('server') || r.includes('api') || r.includes('django')) return ROLE_SKILLS.backend
  if (r.includes('data') || r.includes('ml') || r.includes('python') || r.includes('science') || r.includes('ai')) return ROLE_SKILLS.datascience
  if (r.includes('devops') || r.includes('cloud') || r.includes('aws') || r.includes('infra')) return ROLE_SKILLS.devops
  if (r.includes('mobil') || r.includes('ios') || r.includes('android')) return ROLE_SKILLS.mobile
  if (r.includes('qa') || r.includes('test') || r.includes('automation')) return ROLE_SKILLS.qa
  return ROLE_SKILLS.frontend 
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [userName, setUserName] = useState('User')
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [animateIn, setAnimateIn] = useState(false)
  const [showAllSkills, setShowAllSkills] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
      setUserName(displayName)

      try {
        const data = await getUserAnalyses()
        setAnalyses(data || [])
      } catch (err) {
        console.error('Failed to load analyses:', err)
      } finally {
        setLoading(false)
        setTimeout(() => setAnimateIn(true), 100)
      }
    }
    loadData()
  }, [user])

  const totalAnalyses = analyses.length
  const latestAnalysis = analyses[0] || null
  const latestScore = latestAnalysis?.score || 0
  const rolesAnalyzed = [...new Set(analyses.map(a => a.role_transition).filter(Boolean))]

  
  let missingSkills = []
  if (latestAnalysis) {
    try {
      const skills = latestAnalysis.missing_skills
      missingSkills = typeof skills === 'string'
        ? JSON.parse(skills || '[]')
        : (skills || [])
    } catch (e) {
      missingSkills = []
    }
  }

  
  
  const requiredSkills = missingSkills
  const yourStrengths = []


  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loader">
          <div className="loader-spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const hasData = totalAnalyses > 0

  return (
    <div className="dashboard">
      {}
      <div className="dash-header">
        <div className="dash-header-left">
          <div className="greeting-text">
            <span className="greeting-wave">👋</span>
            <div>
              <h1>Welcome, <span className="gradient-text">{userName}</span></h1>
              <p className="header-subtitle">
                {hasData
                  ? `You have ${totalAnalyses} ${totalAnalyses === 1 ? 'analysis' : 'analyses'}`
                  : 'Start by analyzing your skills'
                }
              </p>
            </div>
          </div>
        </div>
        <div className="dash-header-right">
          <div className="header-profile" onClick={() => navigate('/profile')}>
            <img src={profile} alt="profile" />
            <span>{userName}</span>
          </div>
        </div>
      </div>

      <div className="dash-content">
        {}
        {!hasData && (
          <div className="empty-state-card">
            <div className="empty-icon">🚀</div>
            <h2>Start Your Career Journey</h2>
            <p>Analyze your skills or scan your resume to get personalized insights.</p>
            <div className="empty-actions">
              <button className="action-btn-primary" onClick={() => navigate('/analyze')}>
                <img src={analyzeIcon} alt="" /> Analyze Skills
              </button>
              <button className="action-btn-secondary" onClick={() => navigate('/resumeanalyzer')}>
                📄 Scan Resume
              </button>
            </div>
          </div>
        )}

        {}
        {hasData && (
          <>
            {}
            <div className="stats-row">
              <div className={`metric-card ${animateIn ? 'animate-in' : ''}`}>
                <span className="metric-value">{totalAnalyses}</span>
                <span className="metric-label">Total Analyses</span>
              </div>
              <div className={`metric-card ${animateIn ? 'animate-in' : ''}`}>
                <span className="metric-value">{latestScore}%</span>
                <span className="metric-label">Latest Score</span>
              </div>
              <div className={`metric-card ${animateIn ? 'animate-in' : ''}`}>
                <span className="metric-value">{rolesAnalyzed.length}</span>
                <span className="metric-label">Roles Explored</span>
              </div>
            </div>

            {}
            {latestAnalysis && (
              <div className="glass-card latest-analysis-card">
                <h3>Latest Analysis: {latestAnalysis.role_transition || 'Unknown Role'}</h3>
                <div className="latest-meta">
                  <span className={`score-badge ${latestScore >= 75 ? 'good' : latestScore >= 50 ? 'medium' : 'low'}`}>
                    {latestScore}%
                  </span>
                  <span className="latest-date">
                    {new Date(latestAnalysis.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button className="action-btn-secondary" onClick={() => navigate('/roadmap')}>
                  View Roadmap →
                </button>
              </div>
            )}

            {}
            {latestAnalysis && (
              <div className="skills-insights-row">
                <div className="glass-card skills-card">
                  <h4>🎯 Skills Required ({requiredSkills.length})</h4>
                  <div className="skills-tags">
                    {(showAllSkills ? requiredSkills : requiredSkills.slice(0, 8)).map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                    {requiredSkills.length > 8 && (
                      <span
                        className="skill-tag more expandable"
                        onClick={() => setShowAllSkills(!showAllSkills)}
                      >
                        {showAllSkills ? 'Show Less' : `+${requiredSkills.length - 8} more`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="glass-card skills-card">
                  <h4>💪 Key Strengths ({yourStrengths.length})</h4>
                  <div className="skills-tags">
                    {yourStrengths.length > 0 ? (
                      yourStrengths.slice(0, 8).map((skill, i) => (
                        <span key={i} className="skill-tag strength">{skill}</span>
                      ))
                    ) : (
                      <span className="no-strengths">Complete the roadmap to build your strengths!</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {}
            <div className="quick-actions-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <button className="quick-action-btn" onClick={() => navigate('/analyze')}>
                  <span className="qa-icon">📊</span>
                  <span>New Analysis</span>
                </button>
                <button className="quick-action-btn" onClick={() => navigate('/resumeanalyzer')}>
                  <span className="qa-icon">📄</span>
                  <span>Scan Resume</span>
                </button>
                <button className="quick-action-btn" onClick={() => navigate('/roadmap')}>
                  <span className="qa-icon">🗺️</span>
                  <span>Roadmap</span>
                </button>
                <button className="quick-action-btn" onClick={() => navigate('/history')}>
                  <span className="qa-icon">📜</span>
                  <span>History</span>
                </button>
              </div>
            </div>

            {}
            <div className="glass-card">
              <div className="card-header">
                <h3>Recent Analyses</h3>
                <button className="see-all-btn" onClick={() => navigate('/history')}>View All →</button>
              </div>
              <div className="recent-list">
                {analyses.slice(0, 5).map((a, i) => (
                  <div key={a.id || i} className="recent-item">
                    <div className="recent-info">
                      <span className="recent-role">{a.role_transition || 'Skill Analysis'}</span>
                      <span className="recent-date">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="recent-score" style={{
                      color: a.score >= 75 ? '#34d399' : a.score >= 50 ? '#fbbf24' : '#f87171'
                    }}>
                      {a.score || 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
