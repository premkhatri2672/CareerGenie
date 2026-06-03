import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

import heroVideo from "../assets/Genie_appearing_with_job_letter_202605221342.mp4"

const HomeVideoLayout = ({ children }) => {
  const wrapperRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      
      tl.fromTo(
        videoRef.current,
        { opacity: 0, scale: 1.12, filter: 'blur(4px) brightness(0.75)' },
        { opacity: 0.55, scale: 1.04, filter: 'blur(1px) brightness(0.9)', duration: 1.0 }
      )

      tl.to(videoRef.current, {
        scale: 1.02,
        filter: 'blur(2px) brightness(0.85)',
        duration: 0.6
      })

      
      gsap.to(videoRef.current, {
        yPercent: -2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      
      const onScroll = () => {
        const rect = wrapperRef.current?.getBoundingClientRect()
        if (!rect) return

        
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)))
        const y = (progress - 0.5) * -45 

        gsap.to(videoRef.current, {
          y,
          overwrite: 'auto',
          duration: 0.15
        })
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} className="home-video-wrapper">
      <video
        ref={videoRef}
        className="home-video"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="home-video-content">{children}</div>
    </div>
  )
}

export default HomeVideoLayout

