'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MouseFollower = () => {
  const followerRef = useRef(null);

  useEffect(() => {
    const follower = followerRef.current;

    const moveFollower = (e) => {
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', moveFollower);
    return () => window.removeEventListener('mousemove', moveFollower);
  }, []);

  return (
    <div
      ref={followerRef}
      className="pointer-events-none fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-[#77AA41] z-50 mix-blend-difference"
      style={{
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default MouseFollower;
