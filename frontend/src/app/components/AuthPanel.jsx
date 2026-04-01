// components/AuthPanel.js
'use client';

import { SignUp } from '@clerk/nextjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function AuthPanel() {
  const slides = [
    { bg: '/loginCar1.png' },
    { bg: '/loginCar2.png' },
    { bg: '/loginCar3.png'},
    { bg: '/loginCar4.png'},
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* LEFT: Clerk SignUp */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white  ">
        <div className="w-full max-w-md">
          <div className="mb-6 text-[#212121]">
            <h1 className="text-3xl font-semibold text-eco-dark">Join GreenLens</h1>
            <p className="text-sm text-gray-500"> {`Create an account — it's fast and secure.`} </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-50">
            <SignUp
  routing="hash"
  fallbackRedirectUrl="/"
  forceRedirectUrl="/home"

  appearance={{
    variables: { 
      colorPrimary: '#10b981',
      spacingUnit: '0.75rem',
    },
    elements: {
      formButtonPrimary: 'bg-eco-green text-white hover:opacity-90',
      card: 'bg-white shadow-none',
      rootBox: 'w-full',
      cardBox: 'shadow-none',
      formFieldInput: 'py-2',
      formFieldLabel: 'mb-1',
      form: 'gap-3',
      footer: 'mt-4',
      footerAction: 'mt-3',
    },
  }}
/>
          </div>
        </div>
      </div>

      {/* RIGHT: Swiper Carousel */}
      <div className="w-full md:w-1/2 h-80 md:h-auto">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          className="h-full w-full flex justify-center items-center bg-[#A5D6A7] "
        >
          {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
          <div
            className="relative h-[75%] aspect-4/5   top-[50%] left-[50%] translate-[-50%] bg-center bg-cover rounded-3xl shadow-lg"
            style={{
              backgroundImage: `url(${slide.bg})`,
            }}
            ></div>
          </SwiperSlide>
))}

        </Swiper>
      </div>
    </div>
  );
}