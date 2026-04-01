'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Leaf } from 'lucide-react';

export default function MethodSelection() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const router = useRouter();

  const methods = [
    { id: 'electricity', label: 'Electricity Bills' },
    { id: 'solar', label: 'Solar Power' },
    { id: 'transport', label: 'Transport Mode' },
    { id: 'plantation', label: 'Tree Plantation' },
    {id: 'purchase', label: 'Purchase of Eco-Friendly Products' }
  ];

  const handleContinue = () => {
    if (selectedMethod) router.push(`/submit/${selectedMethod}-form`);
  };

  return (
    <motion.div
      className="min-h-screen  w-full bg-linear-to-b from-[#A5D6A7] to-[#E8F5E9] flex items-center justify-center px-4"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className="max-w-3xl w-full bg-white/70 rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-8 border border-[#1B5E20]/20 backdrop-blur-md">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-[#1B5E20] text-center uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Track Down Your Footprints
        </motion.h1>

        <p className="text-lg text-[#2E7D32]/80 text-center -mt-2">
          Choose your method to calculate and record your sustainability impact.
        </p>

        <div className="w-full flex flex-col gap-4 mt-4">
          {methods.map((method) => (
            <motion.label
              key={method.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`w-full cursor-pointer p-4 rounded-2xl flex items-center justify-between border-2 transition-all duration-200 ${
                selectedMethod === method.id
                  ? 'bg-[#C8E6C9] border-[#1B5E20]'
                  : 'bg-white border-[#A5D6A7] hover:border-[#1B5E20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="method"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  className="accent-[#1B5E20] w-5 h-5"
                />
                <span className="text-lg text-[#1B5E20] font-medium">
                  {method.label}
                </span>
              </div>
              {selectedMethod === method.id && (
                <CheckCircle className="w-5 h-5 text-[#1B5E20]" />
              )}
            </motion.label>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200 }}
          onClick={handleContinue}
          disabled={!selectedMethod}
          className={`h-14 w-[60%] mt-4 rounded-2xl flex items-center justify-center gap-2 text-white shadow-lg transition-all duration-300 ${
            selectedMethod
              ? 'bg-linear-to-r from-emerald-900 to-green-950 hover:opacity-90'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <Leaf className="w-5 h-5" />
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}
