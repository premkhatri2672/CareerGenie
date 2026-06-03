import React, { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './About.css'

const steps = [
  {
    number: '01',
    icon: '🔍',
    title: 'Discover',
    description: 'Tell us your current skills and target role. Our AI maps your profile against thousands of industry benchmarks.'
  },
  {
    number: '02',
    icon: '🗺️',
    title: 'Plan',
    description: 'Receive a personalized, step-by-step learning roadmap with curated resources tailored to close your skill gaps.'
  },
  {
    number: '03',
    icon: '⚡',
    title: 'Improve',
    description: 'Follow your roadmap, track progress, and keep re-analyzing as you level up your skills over time.'
  },
  {
    number: '04',
    icon: '🏆',
    title: 'Achieve',
    description: 'Land your dream job with confidence. Your profile evolves with the industry — CareerGenie grows with you.'
  }
]

const features = [
  {
    icon: '🤖',
    title: 'AI Skill Analysis',
    description: 'Advanced machine learning models evaluate your skills against real job market data for pinpoint accuracy.'
  },
  {
    icon: '📄',
    title: 'Resume Intelligence',
    description: 'Upload your resume and let our AI extract, verify, and enhance your skill profile instantly.'
  },
  {
    icon: '🎯',
    title: 'Role Matching',
    description: 'See exactly how well you match any role, with a readiness score and a gap list to focus your efforts.'
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    description: 'Watch your score improve over time as you complete roadmap milestones and add new skills.'
  },
  {
    icon: '🗺️',
    title: 'Smart Roadmaps',
    description: 'Dynamic learning paths that adapt to your pace, background, and the role you are targeting.'
  },
  {
    icon: '⚡',
    title: 'Real-Time Insights',
    description: 'Always up-to-date skill intelligence so your career strategy keeps pace with industry trends.'
  }
]

const stats = [
  { value: '50K+', label: 'Careers Transformed' },
  { value: '200+', label: 'Job Roles Covered' },
  { value: '98%', label: 'User Satisfaction' },
  { value: '2M+', label: 'Skills Analyzed' }
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

const About = () => {
  const stepsRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' })
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })

  return (
    <section id="about" className="about">
      {/* Ambient background */}
      <div className="about-orb about-orb-1" />
      <div className="about-orb about-orb-2" />

      {/* ─── HOW IT WORKS ─────────────────── */}
      <div className="about-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">How It Works</span>
          <h2 className="section-title">
            From <span className="gradient-text">Skill Gaps</span> to Dream Jobs
          </h2>
          <p className="section-subtitle">
            A simple four-step journey to transform your career with AI precision
          </p>
        </motion.div>

        <motion.div
          ref={stepsRef}
          className="steps-grid"
          variants={containerVariants}
          initial="hidden"
          animate={stepsInView ? 'visible' : 'hidden'}
        >
          {steps.map((step, i) => (
            <motion.div key={i} className="step-card" variants={itemVariants}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
              {i < steps.length - 1 && <div className="step-connector" />}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ─── STATS BAR ────────────────────── */}
      <motion.div
        ref={statsRef}
        className="stats-bar"
        variants={containerVariants}
        initial="hidden"
        animate={statsInView ? 'visible' : 'hidden'}
      >
        {stats.map((stat, i) => (
          <motion.div key={i} className="stat-item" variants={itemVariants}>
            <span className="stat-value gradient-text">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── FEATURES ─────────────────────── */}
      <div className="about-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Features</span>
          <h2 className="section-title">
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
        </motion.div>

        <motion.div
          ref={featuresRef}
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, i) => (
            <motion.div key={i} className="feature-card glass-card" variants={itemVariants}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
              <div className="feature-shine" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ─── MISSION ──────────────────────── */}
      <motion.div
        className="mission-section"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="mission-content glass-card">
          <span className="section-eyebrow">Our Mission</span>
          <h2>
            Bridging the Gap Between{' '}
            <span className="gradient-text">Talent & Opportunity</span>
          </h2>
          <p>
            At CareerGenie, we believe that the only thing standing between you and your dream job
            shouldn't be a skill gap. Many talented individuals miss out on opportunities simply because
            they don't have the specific tools the modern market demands. We've built a platform that
            doesn't just find you jobs — it prepares you to win them.
          </p>
          <div className="mission-tagline">
            <span className="gradient-text">— Analyze. Bridge. Achieve —</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default About
