import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { performAnalysis, generateRichAnalysis, ROLE_KNOWLEDGE_BASE } from '../utils/ai.js'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase.js'
import './Dashboard.css'
import './ResumeAnalyzer.css'

// ─── PLATFORM BADGE COLORS ────────────────────────────────
const PLATFORM_COLORS = {
  YouTube: { bg: 'rgba(255, 0, 0, 0.15)', border: 'rgba(255, 0, 0, 0.3)', text: '#ff4d4d' },
  Udemy: { bg: 'rgba(167, 99, 247, 0.15)', border: 'rgba(167, 99, 247, 0.3)', text: '#a763f7' },
  Coursera: { bg: 'rgba(6, 124, 194, 0.15)', border: 'rgba(6, 124, 194, 0.3)', text: '#5b9ef0' },
  freeCodeCamp: { bg: 'rgba(14, 166, 120, 0.15)', border: 'rgba(14, 166, 120, 0.3)', text: '#0ea678' },
}

// ─── SCAN STEPS ───────────────────────────────────────────
const SCAN_STEPS = [
  { icon: '📂', label: 'Parsing document structure' },
  { icon: '🔍', label: 'Extracting skills & experience' },
  { icon: '🧠', label: 'Running ML role analysis' },
  { icon: '📚', label: 'Mapping real learning resources' },
  { icon: '✅', label: 'Generating your career report' },
]

// ─── SAMPLE PRESETS ───────────────────────────────────────
const SAMPLE_PRESETS = [
  {
    emoji: '⚛️', role: 'Senior React Developer', score: 88, level: 'Mid-level',
    userSkills: ['React', 'JavaScript', 'CSS', 'Redux', 'Git', 'REST APIs'],
    missingSkills: ['TypeScript', 'Jest', 'Next.js', 'TailwindCSS'],
    salary: { inr: '8-18 LPA', usd: '$80k-$120k' },
    insights: { marketDemand: 'Very High', demandTrend: '+32% YoY', jobOpenings: '142,000+', topCompanies: ['Google', 'Meta', 'Shopify', 'Vercel'], avgTimeToHire: '3-5 months', totalLearningWeeks: 14 },
    roadmap: ['Master TypeScript for type-safe React apps (4 weeks)', 'Add Jest + React Testing Library to every project', 'Rebuild portfolio with Next.js for SSR/ISR', 'Learn TailwindCSS for rapid UI prototyping', '🎯 Target Mid→Senior role in 3-4 months'],
  },
  {
    emoji: '🤖', role: 'Data Scientist', score: 64, level: 'Junior',
    userSkills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Tableau'],
    missingSkills: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'Scikit-Learn', 'Spark'],
    salary: { inr: '6-12 LPA', usd: '$70k-$100k' },
    insights: { marketDemand: 'Extremely High', demandTrend: '+45% YoY', jobOpenings: '87,000+', topCompanies: ['Google', 'Netflix', 'Spotify', 'Databricks'], avgTimeToHire: '5-7 months', totalLearningWeeks: 29 },
    roadmap: ['Study supervised/unsupervised ML with Scikit-Learn (5 weeks)', 'Complete Andrew Ng\'s ML Specialization on Coursera', 'Learn deep learning fundamentals with TensorFlow (6 weeks)', 'Deploy a real ML model to production (Docker + AWS)', '🎯 Target Data Scientist at a top 10 tech firm'],
  },
  {
    emoji: '☁️', role: 'DevOps Engineer', score: 55, level: 'Junior',
    userSkills: ['Linux', 'Git', 'Bash', 'Python'],
    missingSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Jenkins'],
    salary: { inr: '5-10 LPA', usd: '$65k-$95k' },
    insights: { marketDemand: 'High', demandTrend: '+25% YoY', jobOpenings: '73,000+', topCompanies: ['AWS', 'HashiCorp', 'RedHat', 'GitLab'], avgTimeToHire: '4-6 months', totalLearningWeeks: 20 },
    roadmap: ['Master Docker containerization (3 weeks)', 'Learn Kubernetes orchestration on KodeKloud (5 weeks)', 'Get AWS Cloud Practitioner certified (8 weeks)', 'Build complete CI/CD pipeline with GitHub Actions', '🎯 Land entry-level DevOps role in 5-6 months'],
  },
]

// ─── SCORE RING SVG ───────────────────────────────────────
const ScoreRing = ({ score, size = 140 }) => {
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: `drop-shadow(0 0 12px ${color}66)` }}>
      <defs>
        <linearGradient id={`ring-grad-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171'} />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={`url(#ring-grad-${score})`} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x={size / 2} y={size / 2 - 6} textAnchor="middle" fill="white" fontSize={size * 0.18} fontWeight="900" fontFamily="'Outfit', sans-serif">{score}%</text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fill={color} fontSize={size * 0.11} fontWeight="700">{grade} Grade</text>
    </svg>
  )
}

// ─── COURSE CARD ──────────────────────────────────────────
const CourseCard = ({ course }) => {
  const colors = PLATFORM_COLORS[course.platform] || PLATFORM_COLORS['Udemy']
  return (
    <a href={course.url} target="_blank" rel="noopener noreferrer" className="course-card">
      <div className="course-thumb">
        {course.videoId ? (
          <img src={`https://img.youtube.com/vi/${course.videoId}/mqdefault.jpg`} alt={course.title} onError={e => e.target.style.display = 'none'} />
        ) : (
          <div className="course-thumb-placeholder">📚</div>
        )}
        <div className="course-play-btn">▶</div>
      </div>
      <div className="course-info">
        <div className="course-skill-badge">{course.forSkill}</div>
        <p className="course-title">{course.title}</p>
        <div className="course-meta">
          <span className="platform-badge" style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}>
            {course.platform}
          </span>
          <span className="course-duration">⏱ {course.duration}</span>
          <span className="course-rating">⭐ {course.rating}</span>
        </div>
        <p className="course-instructor">by {course.instructor}</p>
      </div>
    </a>
  )
}

const ResumeAnalyzer = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const dropRef = useRef(null)

  const [phase, setPhase] = useState('upload') // upload | scanning | results
  const [resumeFile, setResumeFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [scanStep, setScanStep] = useState(-1)
  const [scanProgress, setScanProgress] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // ─── DRAG & DROP ────────────────────────────────────────
  const onDragOver = useCallback(e => { e.preventDefault(); setIsDragging(true) }, [])
  const onDragLeave = useCallback(() => setIsDragging(false), [])
  const onDrop = useCallback(e => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      setResumeFile(file)
    }
  }, [])

  // ─── SCAN ANIMATION ─────────────────────────────────────
  const runScanAnimation = async (analysisPromise) => {
    setPhase('scanning')
    setScanStep(0)
    setScanProgress(0)

    // Run the animation steps
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i)
      const targetProgress = ((i + 1) / SCAN_STEPS.length) * 100
      // Smooth progress fill
      for (let p = (i / SCAN_STEPS.length) * 100; p <= targetProgress; p += 2) {
        await new Promise(r => setTimeout(r, 20))
        setScanProgress(p)
      }
      await new Promise(r => setTimeout(r, i === 2 ? 800 : 500))
    }

    try {
      const result = await analysisPromise
      setAnalysis(result)
      setPhase('results')
      setActiveTab('overview')
    } catch (err) {
      console.error('Analysis failed:', err)
      setPhase('upload')
      setResumeFile(null)
      toast.error('Analysis failed: ' + (err.message || 'Please check your connection.'))
    }
  }

  // ─── ANALYZE UPLOADED RESUME ─────────────────────────────
  const handleAnalyzeResume = async () => {
    if (!resumeFile) return

    const analysisPromise = (async () => {
      const result = await performAnalysis(resumeFile, 'Software Engineer')
      const safeParse = v => Array.isArray(v) ? v : typeof v === 'string' ? (() => { try { return JSON.parse(v) } catch { return [] } })() : []
      const roadmap = safeParse(result?.roadmap)
      const missing = safeParse(result?.missing_skills || result?.missingSkills)
      return {
        score: result?.score ?? 72,
        level: result?.level || 'Mid-level',
        role: 'Software Engineer',
        userSkills: result?.userSkills || [],
        missingSkills: missing,
        missingWithTime: result?.missingWithTime || missing.map(s => ({ skill: s, weeks: 4 })),
        salary: result?.salary || { inr: '8-18 LPA', usd: '$80k-$120k' },
        insights: result?.insights || { marketDemand: 'High', demandTrend: '+28% YoY', jobOpenings: '118,000+', topCompanies: ['Google', 'Meta', 'Amazon'], avgTimeToHire: '4-6 months', totalLearningWeeks: 20 },
        roadmap,
        coursesData: result?.coursesData || [],
      }
    })()

    await runScanAnimation(analysisPromise)
  }

  // ─── USE SAMPLE PRESET ───────────────────────────────────
  const handleSamplePreset = async (preset) => {
    const analysisPromise = (async () => {
      const rich = generateRichAnalysis(preset.role, '', preset.userSkills)
      const finalData = {
        score: preset.score,
        level: preset.level,
        role: preset.role,
        userSkills: preset.userSkills,
        missingSkills: preset.missingSkills,
        missingWithTime: preset.missingSkills.map(s => ({ skill: s, weeks: rich.missingWithTime.find(m => m.skill === s)?.weeks || 4 })),
        salary: preset.salary,
        insights: preset.insights,
        roadmap: preset.roadmap,
        coursesData: rich.coursesData,
      }

      // Save to Supabase
      const userId = user?.id
      if (userId) {
        try {
          await supabase.from('analyses').insert({
            user_id: userId,
            role_transition: preset.role,
            score: preset.score,
            missing_skills: JSON.stringify(preset.missingSkills),
            roadmap: JSON.stringify(preset.roadmap),
            courses: JSON.stringify(rich.recommendedCourses || []),
          }).select().single()
        } catch (e) { console.warn('Supabase save failed:', e) }
      }
      try {
        const local = JSON.parse(localStorage.getItem('careergenie_analyses') || '[]')
        local.unshift({ role_transition: preset.role, score: preset.score, created_at: new Date().toISOString(), missing_skills: JSON.stringify(preset.missingSkills), roadmap: JSON.stringify(preset.roadmap) })
        localStorage.setItem('careergenie_analyses', JSON.stringify(local))
      } catch (e) { }

      return finalData
    })()

    await runScanAnimation(analysisPromise)
  }

  const scoreColor = analysis?.score >= 80 ? '#10b981' : analysis?.score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="dashboard">
      {/* ─── HEADER ─── */}
      <div className="dash-header">
        <div className="dash-header-left">
          <div>
            <h1>Resume <span className="gradient-text">Analyzer</span> 🎯</h1>
            <p className="header-subtitle">AI-powered ATS scoring · Real course recommendations · Career insights</p>
          </div>
        </div>
        {phase === 'results' && (
          <motion.button
            className="action-btn-secondary"
            onClick={() => { setPhase('upload'); setAnalysis(null); setResumeFile(null) }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            ← Analyze Another
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════
             PHASE 1: UPLOAD
        ═══════════════════════════════════════════════════════ */}
        {phase === 'upload' && (
          <motion.div key="upload" className="ra-upload-phase"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>

            {/* Drag & Drop Zone */}
            <div
              ref={dropRef}
              className={`ra-dropzone glass-card ${isDragging ? 'ra-dropzone--drag' : ''} ${resumeFile ? 'ra-dropzone--filled' : ''}`}
              onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
              onClick={() => document.getElementById('resume-input').click()}
            >
              <input id="resume-input" type="file" accept=".pdf,.docx" style={{ display: 'none' }}
                onChange={e => setResumeFile(e.target.files[0])} />

              {!resumeFile ? (
                <>
                  <div className="ra-drop-icon">{isDragging ? '📂' : '📄'}</div>
                  <h3 className="ra-drop-title">{isDragging ? 'Drop it like it\'s hot!' : 'Drop your resume here'}</h3>
                  <p className="ra-drop-sub">or <span className="ra-drop-link">browse files</span> from your device</p>
                  <div className="ra-drop-badges">
                    <span className="ra-badge">PDF</span>
                    <span className="ra-badge">DOCX</span>
                    <span className="ra-badge">Max 5MB</span>
                  </div>
                </>
              ) : (
                <div className="ra-file-selected">
                  <div className="ra-file-icon">📋</div>
                  <div className="ra-file-info">
                    <p className="ra-file-name">{resumeFile.name}</p>
                    <p className="ra-file-size">{(resumeFile.size / 1024).toFixed(1)} KB · Ready to analyze</p>
                  </div>
                  <div className="ra-file-check">✅</div>
                </div>
              )}
            </div>

            {resumeFile && (
              <motion.button
                className="ra-analyze-btn"
                onClick={handleAnalyzeResume}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                <span>🚀</span> Analyze My Resume
              </motion.button>
            )}

            {/* Divider */}
            <div className="ra-divider"><span>or try a sample profile</span></div>

            {/* Preset Cards */}
            <div className="ra-presets-grid">
              {SAMPLE_PRESETS.map((preset, i) => (
                <motion.button
                  key={i}
                  className="ra-preset-card glass-card"
                  onClick={() => handleSamplePreset(preset)}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, borderColor: 'rgba(139,92,246,0.4)' }}
                >
                  <div className="ra-preset-emoji">{preset.emoji}</div>
                  <div className="ra-preset-info">
                    <p className="ra-preset-role">{preset.role}</p>
                    <p className="ra-preset-level">{preset.level} · {preset.insights.marketDemand} demand</p>
                  </div>
                  <div className="ra-preset-score" style={{ color: preset.score >= 80 ? '#10b981' : preset.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                    {preset.score}%
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
             PHASE 2: SCANNING
        ═══════════════════════════════════════════════════════ */}
        {phase === 'scanning' && (
          <motion.div key="scanning" className="ra-scanning-phase glass-card"
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="ra-scanning-header">
              <div className="ra-scan-pulse">
                <div className="ra-scan-ring" />
                <div className="ra-scan-ring ra-scan-ring-2" />
                🧠
              </div>
              <h3>AI Analyzing Your Profile</h3>
              <p>Powered by CareerGenie ML Engine</p>
            </div>

            {/* Progress bar */}
            <div className="ra-progress-track">
              <div className="ra-progress-fill" style={{ width: `${scanProgress}%` }} />
            </div>
            <p className="ra-progress-pct">{Math.round(scanProgress)}% complete</p>

            {/* Steps */}
            <div className="ra-steps-list">
              {SCAN_STEPS.map((step, i) => (
                <div key={i} className={`ra-step ${i < scanStep ? 'ra-step--done' : i === scanStep ? 'ra-step--active' : ''}`}>
                  <div className="ra-step-dot">
                    {i < scanStep ? '✓' : i === scanStep ? step.icon : '○'}
                  </div>
                  <span className="ra-step-label">{step.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
             PHASE 3: RESULTS
        ═══════════════════════════════════════════════════════ */}
        {phase === 'results' && analysis && (
          <motion.div key="results" className="ra-results-phase"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

            {/* ── HERO RESULT BAR ── */}
            <div className="ra-result-hero glass-card">
              <div className="ra-result-hero-left">
                <ScoreRing score={analysis.score} size={140} />
                <div className="ra-result-hero-text">
                  <h2 className="ra-result-role">{analysis.role}</h2>
                  <div className="ra-result-level-badge" style={{ background: scoreColor + '22', border: `1px solid ${scoreColor}55`, color: scoreColor }}>
                    {analysis.level} Level
                  </div>
                  <p className="ra-result-summary">
                    {analysis.score >= 80
                      ? '🎉 Excellent match! You\'re well-positioned for this role.'
                      : analysis.score >= 60
                      ? '🚀 Good foundation! A few targeted skills will unlock senior roles.'
                      : '💡 Great starting point! Follow the roadmap to close key gaps.'}
                  </p>
                </div>
              </div>

              <div className="ra-market-stats">
                {[
                  { icon: '💰', label: 'Salary Range (INR)', value: analysis.salary?.inr || 'N/A' },
                  { icon: '📈', label: 'Market Demand', value: analysis.insights?.marketDemand || 'High' },
                  { icon: '📊', label: 'YoY Growth', value: analysis.insights?.demandTrend || '+25%' },
                  { icon: '🏢', label: 'Open Jobs', value: analysis.insights?.jobOpenings || '50,000+' },
                ].map((stat, i) => (
                  <motion.div key={i} className="ra-market-stat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <span className="ra-market-stat-icon">{stat.icon}</span>
                    <span className="ra-market-stat-value">{stat.value}</span>
                    <span className="ra-market-stat-label">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="ra-tabs">
              {['overview', 'courses', 'roadmap'].map(tab => (
                <button key={tab} className={`ra-tab ${activeTab === tab ? 'ra-tab--active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'overview' ? '📊 Overview' : tab === 'courses' ? '📚 Courses' : '🗺️ Roadmap'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ── TAB: OVERVIEW ── */}
              {activeTab === 'overview' && (
                <motion.div key="overview" className="ra-tab-content"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div className="ra-skills-row">
                    {/* Strengths */}
                    <div className="glass-card ra-skills-card">
                      <h4>✅ Your Strengths ({analysis.userSkills?.length || 0})</h4>
                      <div className="ra-skill-chips">
                        {(analysis.userSkills || []).map((s, i) => (
                          <span key={i} className="ra-chip ra-chip--strength">{s}</span>
                        ))}
                        {(!analysis.userSkills || analysis.userSkills.length === 0) && (
                          <p className="ra-empty-msg">Upload resume to detect skills</p>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills with learning time */}
                    <div className="glass-card ra-skills-card">
                      <h4>⚡ Skills to Learn ({analysis.missingSkills?.length || 0})</h4>
                      <div className="ra-missing-list">
                        {(analysis.missingWithTime || analysis.missingSkills?.map(s => ({ skill: s, weeks: 4 })) || []).map((item, i) => (
                          <div key={i} className="ra-missing-item">
                            <span className="ra-chip ra-chip--missing">{item.skill}</span>
                            <span className="ra-weeks-badge">~{item.weeks}w</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Companies */}
                  <div className="glass-card ra-companies-card">
                    <h4>🏢 Top Companies Hiring</h4>
                    <div className="ra-companies-row">
                      {(analysis.insights?.topCompanies || []).map((c, i) => (
                        <span key={i} className="ra-company-pill">{c}</span>
                      ))}
                    </div>
                    <p className="ra-time-to-hire">⏱ Avg. time to hire: <strong>{analysis.insights?.avgTimeToHire || '4-6 months'}</strong></p>
                  </div>
                </motion.div>
              )}

              {/* ── TAB: COURSES ── */}
              {activeTab === 'courses' && (
                <motion.div key="courses" className="ra-tab-content"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <p className="ra-courses-intro">
                    🎯 Curated courses from <strong>YouTube, Udemy, Coursera & freeCodeCamp</strong> — click any card to open
                  </p>
                  <div className="ra-courses-grid">
                    {(analysis.coursesData || []).map((course, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <CourseCard course={course} />
                      </motion.div>
                    ))}
                    {(!analysis.coursesData || analysis.coursesData.length === 0) && (
                      <p className="ra-empty-msg">No specific courses matched. Try the analyze button again.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── TAB: ROADMAP ── */}
              {activeTab === 'roadmap' && (
                <motion.div key="roadmap" className="ra-tab-content"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div className="glass-card ra-roadmap-card">
                    <div className="ra-roadmap-header">
                      <h4>Your Personalized Career Roadmap</h4>
                      <span className="ra-roadmap-time-badge">
                        ⏱ ~{analysis.insights?.totalLearningWeeks || 16} weeks total
                      </span>
                    </div>
                    <div className="ra-roadmap-steps">
                      {(analysis.roadmap || []).map((step, i) => (
                        <motion.div key={i} className="ra-roadmap-step"
                          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                          <div className="ra-roadmap-node">
                            <div className="ra-roadmap-num">{i + 1}</div>
                            {i < (analysis.roadmap.length - 1) && <div className="ra-roadmap-line" />}
                          </div>
                          <div className="ra-roadmap-text">{step}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── ACTION BAR ── */}
            <div className="ra-action-bar">
              <motion.button
                className="ra-cta-btn"
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                🚀 View Full Dashboard Insights →
              </motion.button>
              <motion.button
                className="ra-secondary-btn"
                onClick={() => navigate('/roadmap')}
                whileHover={{ scale: 1.02 }}
              >
                🗺️ Open Career Roadmap
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResumeAnalyzer
