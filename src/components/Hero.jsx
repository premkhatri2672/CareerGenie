import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import heroVideo from "../assets/Genie_appearing_with_job_letter_202605221342.mp4"
import './Hero.css'
import { useAuth } from '../contexts/AuthContext'
import gsap from 'gsap'

const stats = [
  { value: '50K+', label: 'Careers Guided' },
  { value: '98%', label: 'Success Rate' },
  { value: '200+', label: 'Job Roles' },
]

const Hero = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const heroRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        videoRef.current,
        { opacity: 0, scale: 1.12, filter: 'blur(4px) brightness(0.65)' },
        { opacity: 0.55, scale: 1.04, filter: 'blur(1px) brightness(0.85)', duration: 1.2 }
      ).to(videoRef.current, {
        scale: 1.02,
        filter: 'blur(2px) brightness(0.78)',
        duration: 0.7
      })

      gsap.to(videoRef.current, {
        yPercent: -2,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      const onScroll = () => {
        const rect = heroRef.current?.getBoundingClientRect()
        if (!rect) return
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)))
        gsap.to(videoRef.current, { y: (progress - 0.5) * -40, overwrite: 'auto', duration: 0.15 })
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  }

  return (
    <section ref={heroRef} className="hero">
      {/* Ambient orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Background video */}
      <video
        ref={videoRef}
        className="hero-video"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div className="hero-badge" variants={itemVariants}>
          <span className="hero-badge-dot" />
          <span>AI-Powered Career Intelligence</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 className="hero-title" variants={itemVariants}>
          Your AI Career
          <br />
          <span className="gradient-text">Genie Awaits</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p className="hero-subtitle" variants={itemVariants}>
          Discover your ideal career path with intelligent skill analysis,
          personalized roadmaps, and real-time gap detection — all powered by AI.
        </motion.p>

        {/* CTAs */}
        <motion.div className="hero-ctas" variants={itemVariants}>
          <motion.button
            className="hero-btn-primary"
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(139, 92, 246, 0.55)' }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Get Started Free</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
          <motion.button
            className="hero-btn-ghost"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            How it Works
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div className="hero-stats" variants={itemVariants}>
          {stats.map((stat, i) => (
            <div key={i} className="hero-stat">
              <span className="hero-stat-value gradient-text">{stat.value}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  )
}

export default Hero
