import React from 'react'
import { motion } from 'framer-motion'
// import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Instagram, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className=' relative w-full bg-linear-to-b from-[#E8F5E9] to-[#C8E6C9] text-[#1B5E20] py-10 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8 '
    >
      {/* Left Section */}
      <div className='text-center md:text-left'>
        <h2 className='text-2xl font-bold'>GreenLens</h2>
        <p className='text-sm mt-2 text-[#33691E]'>
          Making sustainability a lifestyle — not a challenge.
        </p>
      </div>

      {/* Middle Section */}
      <div className='flex gap-6'>
        <a href="#hero" className='hover:text-[#43A047] transition'>Home</a>
        <a href="#help" className='hover:text-[#43A047] transition'>How We Help</a>
        <a href="#get-started" className='hover:text-[#43A047] transition'>Get Started</a>
        <a href="#partners" className='hover:text-[#43A047] transition'>Partners</a>
      </div>

      {/* Right Section */}
      <div className='flex gap-5 text-xl'>
        <a href="#" className='hover:text-[#43A047]'><Instagram /></a>
        <a href="#" className='hover:text-[#43A047]'><Linkedin /></a>
        <a href="#" className='hover:text-[#43A047]'><Twitter /></a>
      </div>

      {/* Bottom note */}
      <div className='absolute bottom-3 text-sm text-[#2E7D32] text-center'>
        Made with 🌱 in India © {new Date().getFullYear()} GreenLens
      </div>
    </motion.footer>
  )
}
