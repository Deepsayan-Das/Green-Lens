'use client';
import { motion } from 'framer-motion';
import { Sun, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

import { useAuth } from '@clerk/nextjs';

export default function SolarForm() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    company: '',
    unitsGenerated: '',
    unitsCharged: '', // [NEW] Added for net calculation
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

  const handleSubmit = async () => {
    // Validate form
    if (!formData.company || !formData.unitsGenerated || !formData.homeType || 
        !formData.carpetArea || !formData.billFile) {
      alert("⚠️ Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("solarCompany", formData.company);
      data.append("unitsGenerated", formData.unitsGenerated);
      data.append("unitsCharged", formData.unitsCharged || 0); // Optional
      data.append("homeType", formData.homeType); // (Note: Backend currently gets this from Profile, but good to have)
      data.append("carpetArea", formData.carpetArea); // (Same as above)
      data.append("solarBillProof", formData.billFile);

      const token = await getToken();

      // Call Backend API
      const res = await axios.post("http://localhost:8000/api/v1/form/solar", data, {
        withCredentials: true, // Important for cookies/auth
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });

      console.log('Backend Response:', res.data);
      
      const tokensEarned = res.data.data.tokensEarned;
      setResponseMsg(`✅ Solar power data submitted! You earned ${tokensEarned} Green Tokens!`);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setResponseMsg('');
        setFormData({
          company: '',
          unitsGenerated: '',
          unitsCharged: '',
          homeType: '',
          carpetArea: '',
          billFile: null
        });
      }, 4000);

    } catch (error) {
      console.error("Submission error:", error);
      const errMsg = error.response?.data?.message || error.message || "Failed to submit";
      alert(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-200 py-12 px-4">
      <motion.div
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Sun className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Solar Power</h1>
            <p className="text-amber-700">Earn tokens for renewable energy generation</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Solar Company/Provider *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-700 transition-colors text-amber-900 placeholder:text-amber-400"
              placeholder="e.g., SunPower, Tesla Solar"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Units Generated (kWh) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.unitsGenerated}
                onChange={(e) => setFormData({ ...formData, unitsGenerated: e.target.value })}
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-700 transition-colors text-amber-900 placeholder:text-amber-400"
                placeholder="e.g., 320"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Units Charged (kWh)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.unitsCharged}
                onChange={(e) => setFormData({ ...formData, unitsCharged: e.target.value })}
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-700 transition-colors text-amber-900 placeholder:text-amber-400"
                placeholder="From Grid (Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Home Type *
            </label>
            <select
              required
              value={formData.homeType}
              onChange={(e) => setFormData({ ...formData, homeType: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-700 transition-colors text-amber-900 placeholder:text-amber-400"
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
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Carpet Area (sq ft) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.carpetArea}
              onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-700 transition-colors text-amber-900 placeholder:text-amber-400"
              placeholder="e.g., 1200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Upload Solar Generation Bill/Report *
            </label>
            <div className="relative">
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="solar-upload"
              />
              <label
                htmlFor="solar-upload"
                className="w-full px-4 py-6 border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-700 transition-colors"
              >
                <Upload className="w-8 h-8 text-amber-600 mb-2" />
                <span className="text-sm text-amber-700">
                  {formData.billFile ? formData.billFile.name : 'Click to upload document (PDF, JPG, PNG)'}
                </span>
              </label>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={loading || submitted}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : submitted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Success!
              </>
            ) : (
              'Submit & Earn Points'
            )}
          </motion.button>
        </div>

        {submitted && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
             <p className="text-sm text-green-800 font-medium text-center">
                {responseMsg}
             </p>
          </div>
        )}

      </motion.div>
    </div>
  );
}