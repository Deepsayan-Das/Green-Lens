'use client';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Users } from 'lucide-react';

const benefits = [
  "Access to eco-conscious college and youth audience",
  "Platform-managed payouts and order fulfillment",
  "Featured marketing during app launches",
  "Zero upfront costs - commission-based model",
  "Transparent blockchain-verified transactions",
  "Sustainability impact tracking and reporting",
];

export default function NGOPartnership() {
  return (
    <motion.div
      className="h-screen w-full from-[#A5D6A7] to-[#E8F5E9] bg-linear-to-b flex items-center"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-[#1B5E20]/10 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-[#1B5E20]" />
              <span className="text-sm font-medium text-[#1B5E20]">For NGOs & Eco Brands</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-[#1B5E20] mb-4 -mt-4">
              Partner with GreenLens
            </h2>

            <p className="text-lg text-[#2E7D32]/80 mb-6">
              Join our marketplace and connect with thousands of sustainability-focused users. 
              We handle the tech, payments, and marketing—you focus on your mission.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="w-5 h-5 text-[#1B5E20] mt-0.5 shrink-0" />
                  <span className="text-[#1B5E20]/90">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="h-14 w-[50%] bg-linear-to-r from-emerald-900 to-green-950 text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Mail />
              Request Partnership Info
            </motion.button>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="h-[80%] w-full mt-12 rounded-3xl shadow-[2px_2px_10px_rgba(0,0,0,0.4)]"
            style={{
              backgroundImage: `url(/ngo.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </motion.div>
  );
}
