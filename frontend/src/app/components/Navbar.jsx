'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Lenis from 'lenis'

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('#hero')

  const leftNavItems = [
    { name: 'About', href: '#about' },
    { name: 'Our Impact', href: '#impact' },
  ]

  const rightNavItems = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Connect', href: '#connect' },
  ]

  // Initialize Lenis once for smooth scrolling
  useEffect(() => {
    let lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    // Update active section on scroll
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      let current = '#hero'
      const scrollPos = window.scrollY + window.innerHeight / 2

      sections.forEach((section) => {
        const top = section.offsetTop
        const height = section.offsetHeight
        if (scrollPos >= top && scrollPos < top + height) {
          current = `#${section.id}`
        }
      })

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      lenis.destroy()
    }
  }, [])

  // Smooth scroll on click
  const handleClick = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const lenis = new Lenis()
      lenis.scrollTo(target)
    }
  }

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className='fixed top-4 left-1/2 -translate-x-1/2 z-50 
                 bg-white/20 backdrop-blur-xl border border-white/30 
                 rounded-full shadow-lg px-8 py-3 flex items-center 
                 justify-center space-x-8'
    >
      {/* Left Nav Items */}
      <div className='flex space-x-6'>
        {leftNavItems.map((item, i) => (
          <a
            key={i}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className={`font-semibold text-sm md:text-base transition-all duration-300 hover:text-[#2E7D32] hover:scale-105 ${
              activeSection === item.href ? 'text-[#2E7D32]' : 'text-[#1B5E20]'
            }`}
          >
            {item.name}
          </a>
        ))}
      </div>

      {/* Center Logo */}
      <Link href="#hero" onClick={(e) => handleClick(e, '#hero')} className='mx-6'>
        <div className='w-10 h-10 bg-[#1B5E20] rounded-full hover:scale-110 transition-transform duration-300 cursor-pointer shadow-md'></div>
      </Link>

      {/* Right Nav Items + CTA */}
      <div className='flex items-center space-x-6'>
        {rightNavItems.map((item, i) => (
          <a
            key={i}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className={`font-semibold text-sm md:text-base transition-all duration-300 hover:text-[#2E7D32] hover:scale-105 ${
              activeSection === item.href ? 'text-[#2E7D32]' : 'text-[#1B5E20]'
            }`}
          >
            {item.name}
          </a>
        ))}

        {/* Login / Signup Button */}
        <Link
          href="/auth"
          className='bg-[#1B5E20] text-[#E8F5E9] font-semibold text-sm md:text-base px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:bg-[#2E7D32] hover:scale-105'
        >
          Login
        </Link>
      </div>
    </motion.nav>
  )
}
