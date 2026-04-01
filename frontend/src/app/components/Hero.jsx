'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronsDown } from 'lucide-react';
import MouseFollower from './MouseFollower';
import Link from 'next/link';

function Hero() {

    const arrowRef = useRef(null);
  const buttonRef = useRef(null);


  useEffect(() => {
    // Subtle bounce animation for the arrow
    gsap.to(arrowRef.current, {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 0.6,
      ease: 'expo.out',
    });
  }, []);

useEffect(() => {
  const btn = buttonRef.current;
  if (!btn) return;

  // separate radii for x and y
  const magneticRadiusX = 130; // horizontal magnetic reach
  const magneticRadiusY = 70;  // vertical magnetic reach
  const strength = 0.3;        // how strong the pull feels

  const handleMouseMove = (e) => {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 6;
    const centerY = rect.top + rect.height / 6;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // normalized distances (−1 to 1 range if within radius)
    const normalizedX = distanceX / magneticRadiusX;
    const normalizedY = distanceY / magneticRadiusY;

    // check if inside magnetic area
    const withinMagneticX = Math.abs(distanceX) < magneticRadiusX;
    const withinMagneticY = Math.abs(distanceY) < magneticRadiusY;

    // check if mouse is inside actual button
    const isInside =
      e.clientX > rect.left &&
      e.clientX < rect.right &&
      e.clientY > rect.top &&
      e.clientY < rect.bottom;

    if (!isInside && withinMagneticX && withinMagneticY) {
      // attract smoothly
      gsap.to(btn, {
        x: normalizedX * strength * rect.width/1.25,
        y: normalizedY * strength * rect.height/1.25,
        
        duration: 0.2,
        ease: 'linear',
      });
    } else {
      // reset if inside or outside magnetic zone
      gsap.to(btn, {
        x: 0,
        y: 0,
        
        duration: 0.2,
        ease: 'linear',
      });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' });
  };

  window.addEventListener('mousemove', handleMouseMove);
  btn.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    btn.removeEventListener('mouseleave', handleMouseLeave);
  };
}, []);
  return (
    <div className="h-screen w-screen bg-white flex overflow-hidden relative bg-fixed">
        {/* Decorative SVG Background */}
        <svg
          viewBox="0 0 200 200"
          className="absolute -top-300 -left-300 self-start opacity-30"
          style={{ transform: 'scale(0.5)' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#77AA41"
            d="M45.6,-15.3C54.5,12.7,54.1,43.2,39.4,53.8C24.7,64.4,-4.3,55,-28,37.9C-51.8,20.8,-70.3,-4,-64.8,-27.3C-59.3,-50.7,-29.6,-72.4,-5.7,-70.6C18.3,-68.7,36.6,-43.3,45.6,-15.3Z"
            transform="translate(100 100) scale(0.5)"
          />
        </svg>

        {/* Left Section */}
        <div
          className="sec-1 w-[50%] h-[70%] self-center m-8 bg-clip-text flex flex-col justify-center overflow-visible ml-12"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%), url(/leaves.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h1 className="text-transparent text-7xl font-black font-inter uppercase">
            Shrink Your Footprint,
          </h1>
          <h1 className="text-transparent text-5xl font-black font-inter uppercase">
            Grow Your Impact
          </h1>
          <h4 className="text-black text-2xl font-light mt-4 w-[90%]">
            GreenLens helps you measure your daily carbon footprint and reward eco-friendly choices.
          </h4>
        <Link to='/auth' href='/auth' className='h-[10%]'>
        <button
            ref={buttonRef}
            className="h-full w-[40%] bg-transparent border-2 border-black rounded-full mt-8 text-black text-xl font-medium hover:bg-black hover:text-white transition-all duration-300 ease-in-out pointer-events-auto z-10"
          >
            Get Started
          </button>
       
        </Link>
         </div>
          

        {/* Right Section */}
        <div
          className="sec2 bg-[#fdffff] w-[50%] mr-0 h-full self-center"
          style={{
            backgroundImage: `url(/hero1.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Scroll Prompt */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-600">
          <div className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center items-start p-1">
            <span ref={arrowRef} className="text-gray-500 text-lg leading-none select-none">
              <ChevronsDown />
            </span>
          </div>
        </div>

     
      </div>
  )
}

export default Hero