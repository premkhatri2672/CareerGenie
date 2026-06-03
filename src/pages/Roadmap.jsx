import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserAnalyses } from '../utils/ai.js'
import planIcon from "../assets/plan.png"
import "./Dashboard.css" 
import "./Roadmap.css" 


const TECH_ROADMAPS = {
  frontend: {
    beginner: [
      { tech: 'HTML', desc: 'Learn HTML5 fundamentals - semantic tags, forms, accessibility', weeks: '2 weeks' },
      { tech: 'CSS', desc: 'Master CSS3 - selectors, flexbox, grid, animations, responsive design', weeks: '3 weeks' },
      { tech: 'JavaScript', desc: 'Learn JavaScript ES6+ - variables, functions, DOM manipulation, async/await', weeks: '4 weeks' },
      { tech: 'React', desc: 'Build React apps - components, hooks, state management, props', weeks: '6 weeks' }
    ],
    intermediate: [
      { tech: 'TypeScript', desc: 'Add TypeScript for type-safe code and better developer experience', weeks: '3 weeks' },
      { tech: 'Next.js', desc: 'Learn Next.js for SSR, routing, and full-stack React development', weeks: '4 weeks' },
      { tech: 'State Management', desc: 'Master Redux Toolkit or Zustand for complex state management', weeks: '3 weeks' },
      { tech: 'Testing', desc: 'Write tests with Jest and React Testing Library', weeks: '2 weeks' }
    ],
    expert: [
      { tech: 'System Design', desc: 'Design scalable architectures - micro-frontends, monorepos', weeks: '4 weeks' },
      { tech: 'Performance', desc: 'Optimize app performance - lazy loading, caching, bundle analysis', weeks: '3 weeks' },
      { tech: 'DevOps', desc: 'CI/CD pipelines, Docker containerization, deployment strategies', weeks: '3 weeks' },
      { tech: 'Leadership', desc: 'Mentor juniors, conduct code reviews, architectural decisions', weeks: 'ongoing' }
    ]
  },
  backend: {
    beginner: [
      { tech: 'Node.js', desc: 'Learn Node.js fundamentals - npm, modules, Express basics', weeks: '3 weeks' },
      { tech: 'Express', desc: 'Build REST APIs with Express - routes, middleware, error handling', weeks: '3 weeks' },
      { tech: 'PostgreSQL', desc: 'Learn SQL and PostgreSQL - queries, joins, indexes', weeks: '3 weeks' },
      { tech: 'Authentication', desc: 'Implement JWT auth, password hashing, session management', weeks: '2 weeks' }
    ],
    intermediate: [
      { tech: 'Docker', desc: 'Containerize apps with Docker - images, docker-compose', weeks: '2 weeks' },
      { tech: 'Redis', desc: 'Use Redis for caching, sessions, and real-time features', weeks: '2 weeks' },
      { tech: 'GraphQL', desc: 'Build GraphQL APIs - schemas, resolvers, subscriptions', weeks: '3 weeks' },
      { tech: 'Testing', desc: 'Write API tests with Jest and Supertest', weeks: '2 weeks' }
    ],
    expert: [
      { tech: 'System Design', desc: 'Design microservices, event-driven architecture', weeks: '4 weeks' },
      { tech: 'Kubernetes', desc: 'Orchestrate containers with Kubernetes - pods, services, ingress', weeks: '4 weeks' },
      { tech: 'AWS', desc: 'Master AWS services - Lambda, ECS, RDS, S3, CloudFront', weeks: '4 weeks' },
      { tech: 'Leadership', desc: 'Technical leadership, architecture reviews, mentoring', weeks: 'ongoing' }
    ]
  },
  datascience: {
    beginner: [
      { tech: 'Python', desc: 'Learn Python fundamentals - data types, functions, OOP', weeks: '3 weeks' },
      { tech: 'Pandas', desc: 'Master Pandas for data manipulation and analysis', weeks: '3 weeks' },
      { tech: 'NumPy', desc: 'Learn NumPy for numerical computing and arrays', weeks: '2 weeks' },
      { tech: 'Visualization', desc: 'Create visualizations with Matplotlib and Seaborn', weeks: '2 weeks' }
    ],
    intermediate: [
      { tech: 'Scikit-Learn', desc: 'Build ML models with Scikit-Learn - regression, classification', weeks: '4 weeks' },
      { tech: 'SQL', desc: 'Advanced SQL queries, window functions, database optimization', weeks: '2 weeks' },
      { tech: 'Statistics', desc: 'Statistical analysis - hypothesis testing, distributions', weeks: '3 weeks' },
      { tech: 'Feature Engineering', desc: 'Feature selection, encoding, scaling techniques', weeks: '2 weeks' }
    ],
    expert: [
      { tech: 'Deep Learning', desc: 'Neural networks with TensorFlow or PyTorch', weeks: '6 weeks' },
      { tech: 'MLOps', desc: 'Deploy and monitor ML models in production', weeks: '4 weeks' },
      { tech: 'Big Data', desc: 'Process large datasets with Spark and distributed computing', weeks: '4 weeks' },
      { tech: 'Research', desc: 'Stay current with ML research, publish findings', weeks: 'ongoing' }
    ]
  },
  fullstack: {
    beginner: [
      { tech: 'HTML/CSS', desc: 'Learn HTML5 and CSS3 fundamentals - semantic elements, layout (flexbox/grid), responsive styling', weeks: '3 weeks' },
      { tech: 'JavaScript', desc: 'Master JavaScript programming - syntax, scopes, async operations, API integration', weeks: '4 weeks' },
      { tech: 'React', desc: 'Build reactive user interfaces - state management, components, hooks, routing', weeks: '5 weeks' }
    ],
    intermediate: [
      { tech: 'Node.js & Express', desc: 'Build server-side REST APIs with Node and Express middleware', weeks: '4 weeks' },
      { tech: 'PostgreSQL & MongoDB', desc: 'Learn relational and document databases - queries, index optimization, schemas', weeks: '3 weeks' },
      { tech: 'TypeScript', desc: 'Implement type safety across frontend and backend applications', weeks: '3 weeks' }
    ],
    expert: [
      { tech: 'Docker', desc: 'Containerize fullstack applications for consistent deployments', weeks: '2 weeks' },
      { tech: 'AWS', desc: 'Deploy services to the cloud using ECS, RDS, S3, and CloudFront', weeks: '4 weeks' },
      { tech: 'System Design', desc: 'Design scalable, secure, and distributed web architectures', weeks: '4 weeks' }
    ]
  }
}


const DEFAULT_ROADMAP = {
  beginner: [
    { tech: 'Fundamentals', desc: 'Learn programming basics - syntax, data structures, algorithms', weeks: '4 weeks' },
    { tech: 'Version Control', desc: 'Master Git - branching, merging, collaboration workflows', weeks: '1 week' },
    { tech: 'Core Concepts', desc: 'Understand core programming concepts and design patterns', weeks: '4 weeks' },
    { tech: 'Build Projects', desc: 'Apply skills by building real-world projects', weeks: '4 weeks' }
  ],
  intermediate: [
    { tech: 'Specialization', desc: 'Choose a specialization and deepen your expertise', weeks: '4 weeks' },
    { tech: 'Advanced Patterns', desc: 'Learn advanced architecture and design patterns', weeks: '3 weeks' },
    { tech: 'Databases', desc: 'Work with databases - SQL and NoSQL solutions', weeks: '3 weeks' },
    { tech: 'Deployment', desc: 'Deploy applications to cloud platforms', weeks: '2 weeks' }
  ],
  expert: [
    { tech: 'System Design', desc: 'Design large-scale distributed systems', weeks: '6 weeks' },
    { tech: 'Performance', desc: 'Optimize for scale, performance, and reliability', weeks: '4 weeks' },
    { tech: 'Leadership', desc: 'Lead technical teams and make architectural decisions', weeks: 'ongoing' },
    { tech: 'Innovation', desc: 'Drive innovation and mentor the next generation', weeks: 'ongoing' }
  ]
}


const TECH_COURSES = {
  frontend: {
    beginner: {
      'HTML': ['Learn HTML in 1 Video', 'HTML Crash Course for Beginners'],
      'CSS': ['CSS Full Course for Beginners', 'Modern CSS Tutorial'],
      'JavaScript': ['JavaScript Crash Course', 'JS Complete Course for Beginners'],
      'React': ['React JS Tutorial for Beginners', 'React Complete Course']
    },
    intermediate: {
      'TypeScript': ['TypeScript Tutorial for Beginners', 'TypeScript Crash Course'],
      'Next.js': ['Next.js Full Tutorial', 'Next.js Crash Course'],
      'State Management': ['Redux Toolkit Tutorial', 'Zustand State Management'],
      'Testing': ['Jest Testing Tutorial', 'React Testing Library Guide']
    },
    expert: {
      'System Design': ['System Design Interview Prep', 'Scalable System Design'],
      'Performance': ['Web Performance Optimization', 'Core Web Vitals Guide'],
      'DevOps': ['CI/CD Pipeline Tutorial', 'Docker and Kubernetes Guide'],
      'Leadership': ['Tech Lead Handbook', 'Engineering Leadership']
    }
  },
  backend: {
    beginner: {
      'Node.js': ['Node.js Tutorial for Beginners', 'Node Crash Course'],
      'Express': ['Express JS Tutorial', 'Build REST API with Express'],
      'PostgreSQL': ['PostgreSQL Tutorial for Beginners', 'SQL Complete Course'],
      'Authentication': ['JWT Authentication Tutorial', 'Auth Implementation Guide']
    },
    intermediate: {
      'Docker': ['Docker Tutorial for Beginners', 'Docker Complete Course'],
      'Redis': ['Redis Tutorial', 'Redis Caching Strategies'],
      'GraphQL': ['GraphQL Tutorial', 'GraphQL API Development'],
      'Testing': ['API Testing with Jest', 'Backend Testing Tutorial']
    },
    expert: {
      'System Design': ['Microservices Architecture', 'Distributed Systems Design'],
      'Kubernetes': ['Kubernetes Tutorial', 'K8s Complete Guide'],
      'AWS': ['AWS Tutorial for Beginners', 'Amazon Web Services Complete Guide'],
      'Leadership': ['Engineering Manager Guide', 'Technical Leadership']
    }
  },
  datascience: {
    beginner: {
      'Python': ['Python for Data Science', 'Python Crash Course'],
      'Pandas': ['Pandas Tutorial for Beginners', 'Data Analysis with Pandas'],
      'NumPy': ['NumPy Tutorial', 'Numerical Computing with NumPy'],
      'Visualization': ['Matplotlib Tutorial', 'Data Visualization with Python']
    },
    intermediate: {
      'Scikit-Learn': ['Scikit-Learn Tutorial', 'Machine Learning with Sklearn'],
      'SQL': ['Advanced SQL Tutorial', 'SQL for Data Analysis'],
      'Statistics': ['Statistics for Data Science', 'Hypothesis Testing'],
      'Feature Engineering': ['Feature Engineering Tutorial', 'ML Feature Selection']
    },
    expert: {
      'Deep Learning': ['Deep Learning Full Course', 'Neural Networks Tutorial'],
      'MLOps': ['MLOps Tutorial', 'Deploying ML Models'],
      'Big Data': ['Spark Tutorial', 'Big Data Processing'],
      'Research': ['ML Research Papers Guide', 'Staying Current in AI']
    }
  },
  fullstack: {
    beginner: {
      'HTML/CSS': ['HTML and CSS Tutorial for Beginners', 'Learn HTML & CSS in 2 Hours'],
      'JavaScript': ['JavaScript Complete Course', 'Modern JavaScript Tutorial'],
      'React': ['React JS Crash Course for Beginners', 'React Tutorial 2024']
    },
    intermediate: {
      'Node.js & Express': ['Node JS Tutorial for Beginners', 'Express JS Crash Course'],
      'PostgreSQL & MongoDB': ['PostgreSQL Full Course', 'MongoDB Crash Course'],
      'TypeScript': ['TypeScript Tutorial', 'TypeScript in 1 Video']
    },
    expert: {
      'Docker': ['Docker Tutorial for Beginners', 'Docker Complete Guide'],
      'AWS': ['AWS Certified Cloud Practitioner', 'AWS Tutorial for Beginners'],
      'System Design': ['System Design Interview Prep', 'Full Stack System Design']
    }
  }
}



const RECOMMENDED_VIDEOS = {
  frontend: {
    beginner: {
      HTML: ['HTML for Beginners - Learn HTML in 1 Hour', 'HTML Crash Course', 'Semantic HTML explained'],
      CSS: ['CSS for Beginners - Full Course', 'Flexbox and Grid Tutorial', 'Responsive CSS Crash Course'],
      JavaScript: ['JavaScript for Beginners - Full Course', 'Async/Await in JavaScript', 'DOM Manipulation Crash Course'],
      React: ['React JS Tutorial for Beginners', 'React Hooks Crash Course', 'Build a React App from Scratch']
    },
    intermediate: {
      TypeScript: ['TypeScript Tutorial for Beginners', 'TypeScript Crash Course', 'TypeScript Generics Explained'],
      'Next.js': ['Next.js Full Tutorial', 'Next.js Crash Course', 'Next.js Routing & Data Fetching'],
      'State Management': ['Redux Toolkit Tutorial', 'Zustand State Management', 'State Management Best Practices'],
      Testing: ['React Testing Library Tutorial', 'Jest Crash Course', 'Testing React Components']
    },
    expert: {
      'System Design': ['System Design for Beginners (Frontend)', 'Scalable System Design', 'Micro-frontends Explained'],
      Performance: ['Web Performance Optimization', 'Core Web Vitals Guide', 'Optimizing React Apps'],
      DevOps: ['CI/CD Pipeline Tutorial', 'Docker and Kubernetes for Developers', 'Deploy a React App'],
      Leadership: ['Engineering Leadership', 'Tech Lead Handbook', 'Conducting Code Reviews']
    }
  },
  backend: {
    beginner: {
      'Node.js': ['Node.js Tutorial for Beginners', 'Node Express Crash Course', 'REST APIs with Node.js'],
      Express: ['Express JS Tutorial', 'Build a REST API with Express', 'Express Middleware Explained'],
      PostgreSQL: ['PostgreSQL for Beginners', 'SQL Crash Course', 'Joins and Indexes in PostgreSQL'],
      Authentication: ['JWT Authentication Tutorial', 'Auth Implementation Guide', 'Password Hashing and Sessions']
    },
    intermediate: {
      Docker: ['Docker Tutorial for Beginners', 'Docker Compose Crash Course', 'Containerize Node Apps'],
      Redis: ['Redis Tutorial', 'Redis Caching Strategies', 'Redis for Sessions Explained'],
      GraphQL: ['GraphQL Tutorial', 'Build a GraphQL API', 'GraphQL vs REST Explained'],
      Testing: ['API Testing with Jest', 'Supertest Tutorial', 'Backend Testing Best Practices']
    },
    expert: {
      'System Design': ['Microservices Architecture', 'Distributed Systems Design', 'Event-Driven Architecture'],
      Kubernetes: ['Kubernetes Tutorial', 'K8s Complete Guide', 'Deploying with Kubernetes'],
      AWS: ['AWS Tutorial for Beginners', 'Learn AWS by Building', 'Serverless with AWS Lambda'],
      Leadership: ['Engineering Manager Guide', 'Technical Leadership', 'Architectural Reviews']
    }
  },
  datascience: {
    beginner: {
      Python: ['Python for Data Science - Full Course', 'Python Crash Course', 'Python Basics Explained'],
      Pandas: ['Pandas Tutorial for Beginners', 'Data Analysis with Pandas', 'Pandas Crash Course'],
      NumPy: ['NumPy Tutorial', 'Numerical Computing with NumPy', 'NumPy for Beginners'],
      Visualization: ['Data Visualization with Matplotlib and Seaborn', 'Matplotlib Tutorial', 'Charts in Python explained']
    },
    intermediate: {
      'Scikit-Learn': ['Scikit-Learn Tutorial', 'Machine Learning with Sklearn', 'Training ML Models with Sklearn'],
      SQL: ['Advanced SQL Tutorial', 'SQL for Data Analysis', 'Window Functions Explained'],
      Statistics: ['Statistics for Data Science', 'Hypothesis Testing', 'Probability Distributions Explained'],
      'Feature Engineering': ['Feature Engineering Tutorial', 'ML Feature Selection', 'Encoding & Scaling for ML']
    },
    expert: {
      'Deep Learning': ['Deep Learning Full Course', 'Neural Networks Tutorial', 'TensorFlow or PyTorch Deep Learning'],
      MLOps: ['MLOps Tutorial', 'Deploying ML Models', 'Monitoring ML in Production'],
      'Big Data': ['Spark Tutorial', 'Big Data Processing', 'Distributed Data with Spark'],
      Research: ['ML Research Papers Guide', 'Staying Current in AI', 'How to Read ML Papers']
    }
  },
  fullstack: {
    beginner: {
      'HTML/CSS': ['HTML & CSS Full Course', 'Flexbox & CSS Grid Explained', 'Responsive Design Tutorial'],
      'JavaScript': ['JavaScript for Beginners', 'Async JavaScript Explained', 'DOM Manipulation Tutorial'],
      'React': ['React JS Tutorial', 'React Hooks Tutorial', 'Build a React Project']
    },
    intermediate: {
      'Node.js & Express': ['Node.js Tutorial for Beginners', 'Build a REST API with Express', 'Node Express Middleware'],
      'PostgreSQL & MongoDB': ['PostgreSQL for Beginners', 'MongoDB Crash Course', 'Relational vs Non-Relational Databases'],
      'TypeScript': ['TypeScript Crash Course', 'TypeScript for React Developers', 'TypeScript in 1 Hour']
    },
    expert: {
      'Docker': ['Docker Tutorial', 'Docker Compose Explained', 'Containerizing Full Stack Apps'],
      'AWS': ['AWS Tutorial for Beginners', 'Deploy React and Node to AWS', 'AWS Services Explained'],
      'System Design': ['System Design for Beginners', 'Web Application Architecture', 'Scalable Systems Design']
    }
  }
}

const Roadmap = () => {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
  const loadData = async () => {
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
  }, [])

  const latestAnalysis = analyses[0] || null
  let latestRole = ""
  let latestScore = 0

  if (latestAnalysis) {
    latestRole = latestAnalysis.role_transition || "Unknown Role"
    latestScore = latestAnalysis.score || 0
  }

  
  const safeParse = (v) => {
    if (Array.isArray(v)) return v
    if (typeof v === 'string') {
      try { return JSON.parse(v) } catch { return [] }
    }
    return []
  }
  const missingSkills = latestAnalysis ? safeParse(latestAnalysis.missing_skills) : []

  const isMissing = (techName) => {
    if (!latestAnalysis) return false
    const nameLower = techName.toLowerCase()
    return missingSkills.some(s => {
      const sLower = s.toLowerCase()
      return sLower.includes(nameLower) || nameLower.includes(sLower)
    })
  }

  
  const detectRoleCategory = (role) => {
    const r = (role || '').toLowerCase()
    if (r.includes('front') || r.includes('react') || r.includes('web') || r.includes('ui')) return 'frontend'
    if (r.includes('back') || r.includes('node') || r.includes('server') || r.includes('api')) return 'backend'
    if (r.includes('data') || r.includes('ml') || r.includes('ai') || r.includes('science')) return 'datascience'
    return 'fullstack' 
  }

  const roleCategory = latestRole ? detectRoleCategory(latestRole) : 'fullstack'

  const [levelMode, setLevelMode] = useState('auto') 

  
  const getUserLevel = () => {
    if (latestScore < 55) return 'beginner'
    if (latestScore < 75) return 'intermediate'
    return 'expert'
  }

  
  const getStructuredRoadmap = () => {
    const userLevel = getUserLevel()

    
    if (roleCategory && TECH_ROADMAPS[roleCategory]) {
      const roadmapData = TECH_ROADMAPS[roleCategory]

      if (levelMode === 'auto') {
        
        return {
          beginner: roadmapData.beginner,
          intermediate: roadmapData.intermediate,
          expert: roadmapData.expert,
          currentLevel: userLevel
        }
      }

      
      if (levelMode === 'beginner') return { [levelMode]: roadmapData.beginner, currentLevel: 'beginner' }
      if (levelMode === 'intermediate') return { [levelMode]: roadmapData.intermediate, currentLevel: 'intermediate' }
      if (levelMode === 'expert') return { [levelMode]: roadmapData.expert, currentLevel: 'expert' }
    }

    
    const defaultData = DEFAULT_ROADMAP
    if (levelMode === 'auto') {
      return {
        beginner: defaultData.beginner,
        intermediate: defaultData.intermediate,
        expert: defaultData.expert,
        currentLevel: userLevel
      }
    }

    return { [levelMode]: defaultData[levelMode], currentLevel: levelMode }
  }

  const roadmapData = getStructuredRoadmap()
  const totalTechs = (roadmapData.beginner?.length || 0) + (roadmapData.intermediate?.length || 0) + (roadmapData.expert?.length || 0)

  
  const masteredSkills = latestAnalysis
    ? [
        ...(TECH_ROADMAPS[roleCategory]?.beginner || []),
        ...(TECH_ROADMAPS[roleCategory]?.intermediate || []),
        ...(TECH_ROADMAPS[roleCategory]?.expert || [])
      ]
        .map(item => item.tech)
        .filter(tech => !isMissing(tech))
    : []

  const getRemainingCount = () => {
    let count = 0
    if (roadmapData.beginner) count += roadmapData.beginner.filter(item => isMissing(item.tech)).length
    if (roadmapData.intermediate) count += roadmapData.intermediate.filter(item => isMissing(item.tech)).length
    if (roadmapData.expert) count += roadmapData.expert.filter(item => isMissing(item.tech)).length
    return count
  }
  const remainingTechs = latestAnalysis ? getRemainingCount() : totalTechs

  
  const getTechCourses = (tech) => {
    if (!roleCategory || !TECH_COURSES[roleCategory]) {
      return []
    }
    const levelCourses = TECH_COURSES[roleCategory][levelMode === 'auto' ? roadmapData.currentLevel : levelMode]
    return levelCourses?.[tech] || []
  }

  const getRecommendedVideos = (tech) => {
    if (!roleCategory || !RECOMMENDED_VIDEOS[roleCategory]) {
      return []
    }
    const activeLevel = levelMode === 'auto' ? roadmapData.currentLevel : levelMode
    const levelRecommended = RECOMMENDED_VIDEOS[roleCategory][activeLevel]

    const curated = levelRecommended?.[tech] || []
    const fallback = getTechCourses(tech)

    const combined = [...curated]
    for (const q of fallback) {
      if (combined.length >= 3) break
      if (!combined.includes(q)) combined.push(q)
    }

    return combined.slice(0, 3)
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loader">
          <div className="loader-spinner" />
          <p>Loading your career roadmap...</p>
        </div>
      </div>
    )
  }

  const RenderTechBlock = ({ items, color, levelKey }) => {
    const learningItems = items.filter(item => isMissing(item.tech))

    if (learningItems.length === 0) {
      return (
        <div style={{ marginBottom: levelKey === 'expert' ? 0 : '2rem' }}>
          <h4 style={{ color, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{levelKey === 'beginner' ? '🌱' : levelKey === 'intermediate' ? '🚀' : '⚡'}</span> {levelKey[0].toUpperCase() + levelKey.slice(1)} Level
          </h4>
          <p className="no-videos" style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px dashed rgba(16, 185, 129, 0.25)', color: '#34d399', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎉 All skills in this level have been mastered!
          </p>
        </div>
      )
    }

    return (
      <div style={{ marginBottom: levelKey === 'expert' ? 0 : '2rem' }}>
        <h4 style={{ color, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{levelKey === 'beginner' ? '🌱' : levelKey === 'intermediate' ? '🚀' : '⚡'}</span> {levelKey[0].toUpperCase() + levelKey.slice(1)} Level
          {levelMode === 'auto' && roadmapData.currentLevel === levelKey && (
            <span
              style={{
                fontSize: '0.75rem',
                background:
                  levelKey === 'beginner'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : levelKey === 'intermediate'
                      ? 'rgba(99, 102, 241, 0.2)'
                      : 'rgba(236, 72, 153, 0.2)',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                color:
                  levelKey === 'beginner'
                    ? '#10b981'
                    : levelKey === 'intermediate'
                      ? '#6366f1'
                      : '#ec4899'
              }}
            >
              Your Level
            </span>
          )}
        </h4>

        <div className='tech-roadmap-grid'>
          {learningItems.map((item, idx) => {
            const missing = isMissing(item.tech)
            return (
              <div key={`${levelKey}-${idx}`} className={`tech-card ${levelMode === 'auto' && roadmapData.currentLevel === levelKey ? 'current' : ''}`}>
                <div className="tech-header">
                  <span className="tech-number">{idx + 1}</span>
                  <span className="tech-name">{item.tech}</span>
                  {latestAnalysis && (
                    <span className={`tech-status-badge ${missing ? 'badge-missing' : 'badge-completed'}`}>
                      {missing ? '⚡ To Learn' : '✓ Mastered'}
                    </span>
                  )}
                  <span className="tech-weeks">{item.weeks}</span>
                </div>
                <p className="tech-desc">{item.desc}</p>
                <div className="tech-videos">
                  <span className="videos-label">✅ Recommended videos</span>
                  {getRecommendedVideos(item.tech).length > 0 ? (
                    getRecommendedVideos(item.tech).map((course, cIdx) => (
                      <a
                        key={cIdx}
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(course)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="recommended-video-btn"
                      >
                        {course}
                      </a>
                    ))
                  ) : (
                    <span className="no-videos">Search on YouTube for "{item.tech}" tutorials</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className='dashboard'>
      {}
      <div className="dash-header">
        <div className="dash-header-left">
          <div className="greeting-text">
            <div>
              <h1><span className="gradient-text">Career Roadmap</span> ✨</h1>
              <p className="header-subtitle">
                {latestRole
                  ? `Learning path for ${latestRole}`
                  : 'Select a role and analyze your skills to get a personalized roadmap'}
              </p>
            </div>
          </div>
        </div>
        <div className="dash-header-right">
          <div className="header-profile" style={{ cursor: 'default' }}>
            <img src={planIcon} alt="roadmap" style={{ filter: 'brightness(0) invert(1)' }} />
            <span>Learning Path</span>
          </div>
        </div>
      </div>

      <div className="dash-content">
        {}
        <div className="stats-grid-4">
          <div className={`metric-card ${animateIn ? 'animate-in' : ''}`} style={{ '--delay': '0s' }}>
            <div className="metric-icon-wrap" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>🗺️</div>
            <div className="metric-info">
              <span className="metric-value">{remainingTechs}</span>
              <span className="metric-label">{latestAnalysis ? 'To Learn' : 'Technologies'}</span>
            </div>
          </div>
          <div className={`metric-card ${animateIn ? 'animate-in' : ''}`} style={{ '--delay': '0.1s' }}>
            <div className="metric-icon-wrap" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>🎯</div>
            <div className="metric-info">
              <span className="metric-value">{latestAnalysis ? `${latestScore}%` : 'N/A'}</span>
              <span className="metric-label">Match Score</span>
            </div>
          </div>
          <div className={`metric-card ${animateIn ? 'animate-in' : ''}`} style={{ '--delay': '0.2s' }}>
            <div className="metric-icon-wrap" style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}>📊</div>
            <div className="metric-info">
              <span className="metric-value">{latestAnalysis ? roadmapData.currentLevel.charAt(0).toUpperCase() + roadmapData.currentLevel.slice(1) : 'Auto'}</span>
              <span className="metric-label">Your Level</span>
            </div>
          </div>
        </div>

        {}
        {latestAnalysis && masteredSkills.length > 0 && (
          <div className={`glass-card ${animateIn ? 'animate-in' : ''}`} style={{ marginTop: '2rem', '--delay': '0.3s' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
              <span>🏆</span> Key Strengths & Mastered Skills
            </h3>
            <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
              These skills were detected on your profile and are already mastered. Excellent job!
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
              {masteredSkills.map((tech, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    color: '#34d399',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.04)'
                  }}
                >
                  <span style={{ color: '#10b981' }}>✓</span> {tech}
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        <div className='glass-card' style={{ marginTop: '2rem' }}>
          <div className="card-header" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>📍 Trajectory Path: {latestRole || 'Frontend Developer'}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button type="button" className={`action-btn-secondary ${levelMode === 'auto' ? 'active' : ''}`} onClick={() => setLevelMode('auto')} style={{ padding: '0.5rem 0.9rem' }}>
                  All Levels
                </button>
                <button type="button" className={`action-btn-secondary ${levelMode === 'beginner' ? 'active' : ''}`} onClick={() => setLevelMode('beginner')} style={{ padding: '0.5rem 0.9rem' }}>
                  Beginner
                </button>
                <button type="button" className={`action-btn-secondary ${levelMode === 'intermediate' ? 'active' : ''}`} onClick={() => setLevelMode('intermediate')} style={{ padding: '0.5rem 0.9rem' }}>
                  Intermediate
                </button>
                <button type="button" className={`action-btn-secondary ${levelMode === 'expert' ? 'active' : ''}`} onClick={() => setLevelMode('expert')} style={{ padding: '0.5rem 0.9rem' }}>
                  Expert
                </button>
              </div>
            </div>
            <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
              {levelMode === 'auto'
                ? `Showing complete path from Beginner → Expert. Your detected level: ${roadmapData.currentLevel.toUpperCase()}`
                : `Showing ${levelMode.toUpperCase()} level technologies only`}
            </p>
          </div>

          {!latestAnalysis && (
            <div
              style={{
                padding: '1.25rem',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '12px',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.9rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <span>💡 Analyze your skills to get personalized roadmaps based on your current level!</span>
              <button className="action-btn-primary" onClick={() => navigate('/analyze')} style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                Analyze Skills Now
              </button>
            </div>
          )}

          {}
          {(levelMode === 'auto' || levelMode === 'beginner') && roadmapData.beginner && (
            <RenderTechBlock items={roadmapData.beginner} color="#10b981" levelKey="beginner" />
          )}

          {(levelMode === 'auto' || levelMode === 'intermediate') && roadmapData.intermediate && (
            <RenderTechBlock items={roadmapData.intermediate} color="#6366f1" levelKey="intermediate" />
          )}

          {(levelMode === 'auto' || levelMode === 'expert') && roadmapData.expert && (
            <RenderTechBlock items={roadmapData.expert} color="#ec4899" levelKey="expert" />
          )}
        </div>
      </div>
    </div>
  )
}

export default Roadmap

