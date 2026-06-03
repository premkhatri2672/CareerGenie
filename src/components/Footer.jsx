import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { splitTextToSpans } from './footerTextSplit'
import './footerCharStagger.css'
import './Footer.css'

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.735-8.844L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const Footer = () => {
  const footerRef = useRef(null)

  useEffect(() => {
    const root = footerRef.current
    if (!root) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const h2 = root.querySelector('.footer-brand-name')
    if (!h2) return
    h2.textContent = (h2.textContent || '').replace(/\s+/g, ' ').trim()
    if (h2.querySelector('.footer-char')) {
      h2.textContent = h2.textContent.replace(/\u00A0/g, ' ')
    }
    splitTextToSpans(h2)

    const chars = Array.from(h2.querySelectorAll('.footer-char'))
    if (!chars.length) return

    const rafId = window.requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        gsap.set(chars, { opacity: 1, y: 16, filter: 'blur(10px)', rotateX: -12 })
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(chars, { opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0, duration: 0.42, stagger: 0.035 })
          .to(chars, { y: -4, duration: 0.18, stagger: 0.035, ease: 'back.out(2)' }, '<0.08')
          .to(chars, { y: 0, duration: 0.22, stagger: 0.035, ease: 'power2.out' }, '<0.1')
      }, root)
      return () => ctx.revert()
    })
    return () => window.cancelAnimationFrame(rafId)
  }, [])

  return (
    <footer ref={footerRef} className="footer">
      {}
      <div className="footer-top-border" />

      <div className="footer-inner">
        {}
        <div className="footer-top">
          {}
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="footer-brand-name">CareerGenie</h2>
            <p className="footer-brand-tagline">Your AI Career Coach</p>
            <p className="footer-brand-desc">
              Empowering professionals worldwide with AI-driven career intelligence, 
              personalized roadmaps, and real-time skill gap analysis.
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener" className="social-icon">
                <TwitterIcon />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener" className="social-icon">
                <LinkedInIcon />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener" className="social-icon">
                <InstagramIcon />
              </a>
              <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noopener" className="social-icon">
                <GitHubIcon />
              </a>
            </div>
          </motion.div>

          {}
          <div className="footer-links">
            <motion.div
              className="footer-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4>Product</h4>
              <Link to="/analyze">Skill Analysis</Link>
              <Link to="/roadmap">Career Roadmap</Link>
              <Link to="/resumeanalyzer">Resume AI</Link>
              <Link to="/history">History</Link>
              <Link to="/dashboard">Dashboard</Link>
            </motion.div>

            <motion.div
              className="footer-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
            >
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#about">How It Works</a>
              <a href="#about">Mission</a>
              <a href="/#">Blog</a>
              <a href="/#">Careers</a>
            </motion.div>

            <motion.div
              className="footer-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.26 }}
            >
              <h4>Support</h4>
              <a href="/#">Help Center</a>
              <a href="/#">Documentation</a>
              <a href="/#">Privacy Policy</a>
              <a href="/#">Terms of Service</a>
              <a href="/#">Contact Us</a>
            </motion.div>

            {}
            <motion.div
              className="footer-col footer-newsletter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.34 }}
            >
              <h4>Stay Updated</h4>
              <p>Get career insights and tips delivered to your inbox.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="your@email.com" className="newsletter-input" />
                <button className="newsletter-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {}
        <div className="footer-bottom">
          <p>© 2026 CareerGenie. All rights reserved. Made with ❤️ for career success</p>
          <div className="footer-bottom-links">
            <a href="/#">Privacy</a>
            <a href="/#">Terms</a>
            <a href="/#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
