'use client';
import React, { useEffect } from 'react'
import AuthPage from './auth/page'
import page from '../app/welcome/page'
import MouseFollower from './components/MouseFollower';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CarbonFootprint from './components/CarbonFootprint';
import WhatWeDo from './components/WhatWeDo';
import HowItWorks from './components/HowItWorks';
import NGOPartnership from './components/NGOPartnership';
import Footer from './components/Footer';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';

export default function Page() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    // Smooth anchor scrolling
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) lenis.scrollTo(target);
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener('click', handleAnchorClick)
    );

    // GSAP cinematic scroll
    gsap.to('.carbon-section', {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'bottom bottom',
        end: '+=120%',
        scrub: true,
      },
      yPercent: -100,
      ease: 'power2.out',
    });

    gsap.to('.hero-section', {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'bottom bottom',
        end: '+=40%',
        scrub: true,
      },
      opacity: 0.6,
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      document.querySelectorAll('a[href^="#"]').forEach((a) =>
        a.removeEventListener('click', handleAnchorClick)
      );
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      <MouseFollower />
      <Navbar />

      <section id="hero" className="hero-section relative h-screen w-full">
        <Hero />
      </section>

      <section id="about" className="carbon-section relative h-screen w-full z-10">
        <CarbonFootprint />
      </section>

      <section id="impact" className="relative z-20 mt-[-50vh]">
        <WhatWeDo />
      </section>

      <section id="how-it-works" className="relative">
        <HowItWorks />
      </section>

      <section id="connect" className="relative">
        <NGOPartnership />
      </section>

      <Footer />
    </div>
  );
}
