'use client'
import React from 'react'
import { motion } from 'framer-motion'

function HowItWorks() {
  return (
    <div className='relative bg-gradient-to-b h-[175vh] from-[#E8F5E9] to-[#A5D6A7] min-h-screen flex flex-col justify-center items-center overflow-hidden'>
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
        className='text-center mb-12 max-w-3xl'
      >
        <h2 className='text-4xl md:text-5xl font-extrabold text-[#1B5E20] tracking-tight'>
          3 Simple Steps to a Greener You
        </h2>
        <p className='text-[#2e7d32] mt-4 text-lg font-medium'>
          Join the movement. Measure, reduce, and earn rewards while helping the planet breathe.
        </p>
      </motion.div>

      {/* Timeline Container */}
      <div className='relative w-[85%] md:w-[55%] mt-4'>
        
        {/* Growing vine animation */}
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className='absolute left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-[#66BB6A] to-[#1B5E20] rounded-full shadow-lg origin-top'
        ></motion.div>

        {/* Step Items */}
        <div className='flex flex-col items-center relative z-10'>

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.5 }}
            className='w-full flex md:justify-start justify-center mb-20'
          >
            <div className='md:w-1/2 bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-md -m-4'>
              <h3 className='text-[#1b5e20] font-black text-xl mb-2'>Step 1 — Create Your Profile</h3>
              <p className='text-[#4e4e4e]'>
                Tell us about your lifestyle — your travel, food, and home habits. No judgment, only awareness.
              </p>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 150 }}
              viewport={{ once: true, amount: 0.5 }}
              className='absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-[#388E3C] rounded-full shadow-lg border-2 border-white'
            ></motion.div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.5 }}
            className='w-full flex md:justify-end justify-center mb-20'
          >
            <div className='md:w-1/2 bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-md text-right -m-4'>
              <h3 className='text-[#1b5e20] font-black text-xl mb-2'>Step 2 — Track Your Activities</h3>
              <p className='text-[#4e4e4e]'>
                Use our dashboard to monitor your footprint in real-time. Each action brings you closer to balance.
              </p>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 1.0, type: 'spring', stiffness: 150 }}
              viewport={{ once: true, amount: 0.5 }}
              className='absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-[#43A047] rounded-full shadow-lg border-2 border-white'
            ></motion.div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.5 }}
            className='w-full flex md:justify-start justify-center'
          >
            <div className='md:w-1/2 bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-md -m-4'>
              <h3 className='text-[#1b5e20] font-black text-xl mb-2'>Step 3 — Earn & Redeem Green Tokens</h3>
              <p className='text-[#4e4e4e]'>
                Earn Green Tokens for every positive action — redeem them for sustainable rewards or plant trees.
              </p>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 150 }}
              viewport={{ once: true, amount: 0.5 }}
              className='absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-[#2E7D32] rounded-full shadow-lg border-2 border-white'
            ></motion.div>
          </motion.div>

        </div>
      </div>

      {/* Tagline */}
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        className='text-[#1B5E20] mt-16 text-lg italic font-medium text-center'
      >
        Every action counts — your small step makes a world of difference.
      </motion.p>
    </div>
  )
}

export default HowItWorks