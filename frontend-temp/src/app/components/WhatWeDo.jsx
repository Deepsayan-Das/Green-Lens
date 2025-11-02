import React, { useState, useEffect, useRef } from 'react'

function WhatWeDo() {
  const [hoveredIndex, setHoveredIndex] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const images = [
    {
      src: "/carousel1.png",
      alt: "Track Smartly - Measure your daily, weekly, and monthly emissions automatically through simple logs and connected devices.",
    },
    {
      src: "/carousel2.png",
      alt: "Get Personalized Insights - Learn which habits have the biggest impact — and get science-backed suggestions to improve them.",
    },
    {
      src: "/carousel3.png",
      alt: "Earn & Redeem Green Tokens -Every eco-friendly action earns you Green Tokens, redeemable for eco products, donations, or rewards.",
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getCardStyle = (index) => {
    const isHovered = hoveredIndex === index;
    return {
      height: isHovered ? '85%' : '75%',
      transition: 'height 0.4s ease-in-out, transform 0.4s ease-in-out',
      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
    };
  };

  return (
    <div 
      ref={sectionRef}
      className='relative bg-linear-to-b h-screen from-[#A5D6A7] to-[#E8F5E9] min-h-screen flex flex-col justify-evenly items-center overflow-hidden'
    >
      <h1 
        className='text-7xl font-bold uppercase text-[#212121] text-center px-4'
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        {`We Don't Just Track. We Transform.`}
      </h1>
      
      {/* Decorative SVG Blobs */}
      <svg
        viewBox="0 0 200 200"
        className="absolute top-[40%] left-[8%] opacity-20 pointer-events-none"
        style={{ width: '500px', height: '500px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#77AA41"
          d="M45.6,-15.3C54.5,12.7,54.1,43.2,39.4,53.8C24.7,64.4,-4.3,55,-28,37.9C-51.8,20.8,-70.3,-4,-64.8,-27.3C-59.3,-50.7,-29.6,-72.4,-5.7,-70.6C18.3,-68.7,36.6,-43.3,45.6,-15.3Z"
          transform="translate(100 100)"
        />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className="absolute top-[35%] right-[5%] opacity-15 pointer-events-none"
        style={{ width: '600px', height: '600px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#4CAF50"
          d="M39.5,-65.4C48.9,-55.5,53.3,-40.3,58.6,-25.6C63.9,-10.9,70.1,3.3,68.2,16.8C66.3,30.3,56.3,43.1,43.8,50.9C31.3,58.7,16.1,61.5,0.5,60.7C-15.1,59.9,-30.2,55.5,-43.3,47.9C-56.4,40.3,-67.5,29.5,-71.8,16.2C-76.1,2.9,-73.6,-12.9,-66.3,-25.5C-59,-38.1,-46.9,-47.5,-34.2,-56.3C-21.5,-65.1,-8.2,-73.3,4.3,-79.5C16.8,-85.7,30.1,-75.3,39.5,-65.4Z"
          transform="translate(100 100)"
        />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className="absolute bottom-[15%] left-[12%] opacity-25 pointer-events-none"
        style={{ width: '400px', height: '400px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#81C784"
          d="M31.8,-52.3C41.9,-43.5,51.4,-34.8,56.8,-23.8C62.2,-12.8,63.5,0.6,60.3,12.8C57.1,25,49.4,36.1,39.5,44.3C29.6,52.5,17.5,57.8,4.2,60.6C-9.1,63.4,-23.6,63.7,-35.8,57.4C-48,51.1,-57.9,38.2,-63.4,23.8C-68.9,9.4,-70,-6.5,-65.3,-20.2C-60.6,-33.9,-50.1,-45.4,-38.1,-53.7C-26.1,-62,-12.1,-67.1,0.3,-67.6C12.7,-68.1,21.7,-61.1,31.8,-52.3Z"
          transform="translate(100 100)"
        />
      </svg>

      <div 
        className='img-container relative h-[65%] w-[80%] bg-[#ffffff50] rounded-2xl backdrop-blur-3xl flex justify-evenly items-center'
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(80px)',
          transition: 'opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s',
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className='aspect-4/5 bg-red-500 rounded-2xl cursor-pointer'
            style={{
              ...getCardStyle(index),
              backgroundImage: `url(${image.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: isVisible ? 1 : 0,
              transform: isVisible 
                ? `translateY(0) ${hoveredIndex === index ? 'scale(1.02)' : 'scale(1)'}`
                : 'translateY(100px)',
              transition: `
                height 0.4s ease-in-out,
                opacity 1s ease-out ${0.5 + index * 0.15}s,
                transform 0.4s ease-in-out
              `,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(1)}
          />
        ))}
      </div>
    </div>
  )
}

export default WhatWeDo