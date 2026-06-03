import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import analyzeIcon from "../assets/analyze.png"
import genie2 from "../assets/genie2.png"
import { performAnalysis } from '../utils/ai.js'
import "./Dashboard.css" 
import "./Analyze.css" 

const ROLES = [
  "Frontend Developer", "Backend Developer", "Fullstack Developer", 
  "Data Scientist", "Machine Learning Engineer", "DevOps Engineer", 
  "Product Manager", "UX Designer", "Mobile Developer", "Cloud Architect",
  "Software Engineer", "Data Analyst", "Cybersecurity Analyst", "QA Engineer"
];

const SKILLS = [
  "React", "JavaScript", "Python", "Node.js", "Java", "C++", "AWS", 
  "Docker", "Kubernetes", "TypeScript", "SQL", "MongoDB", "GraphQL", 
  "Next.js", "HTML", "CSS", "Git", "Linux", "Angular", "Vue.js", "C#", "Ruby",
  "TailwindCSS", "Express", "PostgreSQL", "Redis", "Rust", "Go"
];

const Analyze = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState("")
  const [roleSuggestions, setRoleSuggestions] = useState([])
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)

  const [skillsInput, setSkillsInput] = useState("")
  const [skillSuggestions, setSkillSuggestions] = useState([])
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false)

  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [animateIn, setAnimateIn] = useState(false)

  const roleRef = useRef(null)
  const skillsRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100)

    const handleClickOutside = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) setShowRoleSuggestions(false)
      if (skillsRef.current && !skillsRef.current.contains(e.target)) setShowSkillSuggestions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRoleChange = (e) => {
    const val = e.target.value;
    setRole(val);
    if (val.trim()) {
      const filtered = ROLES.filter(r => r.toLowerCase().includes(val.toLowerCase()));
      setRoleSuggestions(filtered);
      setShowRoleSuggestions(true);
    } else {
      setShowRoleSuggestions(false);
    }
  }

  const selectRole = (r) => {
    setRole(r);
    setShowRoleSuggestions(false);
  }

  const handleSkillChange = (e) => {
    const val = e.target.value;
    setSkillsInput(val);
    const parts = val.split(',');
    const lastPart = parts[parts.length - 1].trim();
    
    if (lastPart) {
      
      const filtered = SKILLS.filter(s => 
        s.toLowerCase().includes(lastPart.toLowerCase()) && 
        !parts.some(p => p.trim().toLowerCase() === s.toLowerCase())
      );
      setSkillSuggestions(filtered);
      setShowSkillSuggestions(true);
    } else {
      setShowSkillSuggestions(false);
    }
  }

  const selectSkill = (s) => {
    const parts = skillsInput.split(',');
    parts.pop(); 
    const newVal = [...parts.map(p => p.trim()), s].filter(Boolean).join(', ') + ', ';
    setSkillsInput(newVal);
    setShowSkillSuggestions(false);
  }

  const handleAnalyze = async () => {
    if(!role.trim() || !skillsInput.trim()){
      toast.error('Please select your Role and Skills', {
        style: { background: '#1e1e2d', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      return
    }

    setIsLoading(true);
    toast.loading('Analyzing your profile...', { 
      id: 'analyze',
      style: { background: '#1e1e2d', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });

    try {
      
      const userSkillsList = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const analysis = await performAnalysis(resumeFile, role, userSkillsList);
      
      const parsedMissingSkills = typeof analysis.missing_skills === 'string'
        ? JSON.parse(analysis.missing_skills || '[]')
        : (analysis.missing_skills || []);
        
      const parsedRoadmap = typeof analysis.roadmap === 'string'
        ? JSON.parse(analysis.roadmap || '[]')
        : (analysis.roadmap || []);

      const formattedResult = {
        ...analysis,
        missingSkills: parsedMissingSkills,
        roadmap: parsedRoadmap
      };

      setResult(formattedResult);

      if (analysis.isOfflineMock) {
        toast.success(`Offline ML simulator complete! Score: ${analysis.score}% (OpenAI Quota Exceeded)`, {
          id: 'analyze',
          duration: 6000,
          style: { background: '#f59e0b', color: '#fff', border: '1px solid rgba(251, 191, 36, 0.4)' }
        });
      } else {
        toast.success(`Analysis complete! Score: ${analysis.score}%`, { 
          id: 'analyze',
          style: { background: '#10b981', color: '#fff' }
        });
      }
    } catch (error) {
      toast.error('Analysis failed: ' + error.message, { 
        id: 'analyze',
        style: { background: '#ef4444', color: '#fff' }
      });
    } finally {
      toast.dismiss('analyze');
      setIsLoading(false);
    }
  }

  return (
    <div className='dashboard'>
      {}
      <div className="dash-header">
        <div className="dash-header-left">
          <div className="greeting-text">
            <div>
              <h1><span className="gradient-text">Skill Analysis</span> ⚡</h1>
              <p className="header-subtitle">Evaluate your current skills against industry standard roles</p>
            </div>
          </div>
        </div>
        <div className="dash-header-right">
          <div className="header-profile" style={{ cursor: 'default' }}>
            <img src={analyzeIcon} alt="analyze" style={{filter: 'brightness(0) invert(1)'}} />
            <span>New Analysis</span>
          </div>
        </div>
      </div>

      <div className="dash-content">
        <div className="dash-grid-2">
          {}
          <div className={`glass-card form-card ${animateIn ? 'animate-in' : ''}`} style={{ '--delay': '0s' }}>
            <div className="card-header">
              <h3>🎯 Target Profile Details</h3>
            </div>
            
            <div className="input-group" ref={roleRef}>
              <label>Target Role</label>
              <input 
                type="text" 
                className="premium-input"
                placeholder="e.g., Frontend Developer, Data Scientist"
                value={role}
                onChange={handleRoleChange}
                onFocus={() => { if (roleSuggestions.length > 0) setShowRoleSuggestions(true) }}
              />
              {showRoleSuggestions && roleSuggestions.length > 0 && (
                <ul className="suggestions-dropdown">
                  {roleSuggestions.map((r, i) => (
                    <li key={i} onClick={() => selectRole(r)}>{r}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="input-group" ref={skillsRef}>
              <label>Current Skills (comma separated)</label>
              <input 
                type="text" 
                className="premium-input"
                placeholder="e.g., React, Node.js, Python"
                value={skillsInput}
                onChange={handleSkillChange}
                onFocus={() => { if (skillSuggestions.length > 0) setShowSkillSuggestions(true) }}
              />
              {showSkillSuggestions && skillSuggestions.length > 0 && (
                <ul className="suggestions-dropdown">
                  {skillSuggestions.map((s, i) => (
                    <li key={i} onClick={() => selectSkill(s)}>{s}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="input-group">
              <label>Upload Resume (Optional)</label>
              <div className="file-upload-wrapper">
                <input 
                  type="file" 
                  accept=".pdf"
                  id="resume-upload"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="hidden-input"
                />
                <label htmlFor="resume-upload" className="file-upload-label">
                  <span className="upload-icon">📄</span>
                  <span className="upload-text">
                    {resumeFile ? resumeFile.name : 'Choose PDF File'}
                  </span>
                </label>
              </div>
            </div>

            <button 
              type="button" 
              className="action-btn-primary analyze-submit-btn" 
              onClick={handleAnalyze}
              disabled={isLoading || !role.trim() || !skillsInput.trim()}
            >
              {isLoading ? (
                <><span className="loader-spinner mini"></span> Processing...</>
              ) : (
                'Run Analysis →'
              )}
            </button>
          </div>

          {}
          <div className={`glass-card center-content promo-card ${animateIn ? 'animate-in' : ''}`} style={{ '--delay': '0.1s' }}>
            <img src={genie2} alt="Career Genie" className="floating-mascot" />
            <h3>Let AI Guide Your Career</h3>
            <p className="promo-text">
              Our advanced AI evaluates your skills against thousands of job descriptions to generate a precise roadmap and identify critical skill gaps.
            </p>
          </div>
        </div>

        {}
        {result && (
          <div className="result-modal-overlay">
            <div className="result-modal-content glass-card slide-up">
              <button className="close-modal-btn" onClick={() => setResult(null)}>✕</button>
              
              <div className="result-header">
                <div className="score-ring">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="modal-score-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#modal-score-grad)" strokeWidth="8"
                      strokeDasharray="282.74" strokeDashoffset={282.74 - (result.score / 100) * 282.74}
                      strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                    <text x="50" y="58" textAnchor="middle" fill="white" fontSize="22" fontWeight="800">{result.score}%</text>
                  </svg>
                </div>
                <div className="result-title">
                  <h2>Analysis Complete!</h2>
                  <p>Readiness Score for {role}</p>
                </div>
              </div>

              <div className="result-body dash-grid-2">
                <div className="glass-card feedback-card weaknesses">
                  <h4>⚠️ Missing Skills</h4>
                  <ul>
                    {result.missingSkills?.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                    {(!result.missingSkills || result.missingSkills.length === 0) && (
                      <li style={{ color: '#10b981' }}>None found! You have a strong match.</li>
                    )}
                  </ul>
                </div>

                <div className="glass-card feedback-card roadmap">
                  <h4>🗺️ Recommended Steps</h4>
                  <ul className="step-list">
                    {result.roadmap?.map((step, index) => (
                      <li key={index}>
                        <span className="step-num">{index + 1}</span> {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                className="action-btn-primary dismiss-btn"
                onClick={() => {
                  setResult(null);
                  navigate('/dashboard');
                }}
                style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', background: 'linear-gradient(135deg, #10b981, #34d399)', border: 'none' }}
              >
                🚀 Save & View Full Insights on Dashboard →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analyze