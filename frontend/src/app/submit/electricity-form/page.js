'use client';
import { motion } from 'framer-motion';
import { Zap, Upload, CheckCircle, Wallet, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '@clerk/nextjs';

export default function ElectricityForm() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    customerId: '',
    unitsConsumed: '',
    homeType: '',
    carpetArea: '',
    billFile: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');


  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, billFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.customerId || !formData.unitsConsumed || !formData.homeType || 
        !formData.carpetArea || !formData.billFile) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      console.log('Electricity Bill Submitted:', formData);

      const data = new FormData();
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      
      data.append("month", currentMonth);
      data.append("unitsUsed", formData.unitsConsumed);
      data.append("bill", "0"); // Bill amount 
      data.append("billImage", formData.billFile);
      
      // Keep extra fields if backend needs them later
      data.append("customerId", formData.customerId);
      data.append("homeType", formData.homeType);
      data.append("carpetArea", formData.carpetArea);

      const token = await getToken();

      // Call Backend API
      const res = await axios.post("http://localhost:8000/api/v1/form/electricity", data, {
        withCredentials: true,
        headers: {
           "Content-Type": "multipart/form-data",
           "Authorization": `Bearer ${token}`
        }
      });
      
      console.log('Backend Response:', res.data);
      if(res.data.success) {
         setResponseMsg(`✅ Bill logged! Earned ${res.data.data.tokensEarned} Green Points!`);
         setSubmitted(true);
         
         // Reset form after 3 seconds
          setTimeout(() => {
            setSubmitted(false);
            setResponseMsg('');
            setFormData({
              customerId: '',
              unitsConsumed: '',
              homeType: '',
              carpetArea: '',
              billFile: null
            });
          }, 4000);
      }

    } catch (error) {
       console.error("Submission error:", error);
       const errMsg = error.response?.data?.message || "Failed to submit";
       alert(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-200 py-12 px-4">
      <motion.div
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-yellow-900">Electricity Bill</h1>
              <p className="text-yellow-700">Earn tokens for energy conservation</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-yellow-600">
          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Customer ID *
            </label>
            <input
              type="text"
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:border-yellow-600 transition-colors"
              placeholder="Enter your electricity customer ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Units Consumed (kWh) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.unitsConsumed}
              onChange={(e) => setFormData({ ...formData, unitsConsumed: e.target.value })}
              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:border-yellow-600 transition-colors"
              placeholder="e.g., 250"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Home Type *
            </label>
            <select
              required
              value={formData.homeType}
              onChange={(e) => setFormData({ ...formData, homeType: e.target.value })}
              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:border-yellow-600 transition-colors"
            >
              <option value="">Select home type</option>
              <option value="apartment">Apartment</option>
              <option value="bungalow">Bungalow</option>
              <option value="villa">Villa</option>
              <option value="independent-house">Independent House</option>
              <option value="farmhouse">Farmhouse</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Carpet Area (sq ft) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.carpetArea}
              onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:border-yellow-600 transition-colors"
              placeholder="e.g., 1200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Upload Electricity Bill *
            </label>
            <div className="relative">
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="bill-upload"
              />
              <label
                htmlFor="bill-upload"
                className="w-full px-4 py-6 border-2 border-dashed border-yellow-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-yellow-600 transition-colors"
              >
                <Upload className="w-8 h-8 text-yellow-600 mb-2" />
                <span className="text-sm text-yellow-700 text-center">
                  {formData.billFile ? formData.billFile.name : 'Click to upload bill (PDF, JPG, PNG)'}
                </span>
              </label>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || submitted}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-700 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : submitted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Submitted Successfully!
              </>
            ) : (
              'Submit & Earn Tokens'
            )}
          </motion.button>
        </form>

        {submitted && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
             <p className="text-sm text-yellow-800 font-medium text-center">
                {responseMsg}
             </p>
          </div>
        )}
      </motion.div>
    </div>
  );}