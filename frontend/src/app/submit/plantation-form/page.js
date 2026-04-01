'use client';
import { motion } from 'framer-motion';
import { Trees, Upload, CheckCircle, Plus, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

import { useAuth } from '@clerk/nextjs';

export default function PlantationForm() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    numberOfTrees: '',
    location: '',
    treeTypes: [''],
    imageFile: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    }
  };

  const addTreeType = () => {
    setFormData({ ...formData, treeTypes: [...formData.treeTypes, ''] });
  };

  const removeTreeType = (index) => {
    const newTypes = formData.treeTypes.filter((_, i) => i !== index);
    setFormData({ ...formData, treeTypes: newTypes.length ? newTypes : [''] });
  };

  const updateTreeType = (index, value) => {
    const newTypes = [...formData.treeTypes];
    newTypes[index] = value;
    setFormData({ ...formData, treeTypes: newTypes });
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.numberOfTrees || !formData.location || !formData.imageFile) {
      alert("⚠️ Please fill in all required fields");
      return;
    }

    if (formData.treeTypes.some(type => !type.trim())) {
      alert("⚠️ Please fill in all tree types");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("plantCount", formData.numberOfTrees);
      data.append("plantationLocation", formData.location);
      data.append("treeSpecies", formData.treeTypes.join(', '));
      data.append("plantImage", formData.imageFile);

      const token = await getToken();

      // Call Backend API
      const res = await axios.post("http://localhost:8000/api/v1/form/plantation", data, {
        withCredentials: true,
        headers: {
           "Content-Type": "multipart/form-data",
           "Authorization": `Bearer ${token}`
        }
      });

      console.log('Backend Response:', res.data);
      if(res.data.success) {
         setResponseMsg(`✅ Plantation submitted! Earned ${res.data.data.tokensEarned} Green Points!`);
         setSubmitted(true);
      }
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setResponseMsg('');
        setFormData({
          numberOfTrees: '',
          location: '',
          treeTypes: [''],
          imageFile: null
        });
      }, 4000);

    } catch (error) {
      console.error("Submission error:", error);
      const errMsg = error.response?.data?.message || "Failed to submit";
      alert(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-300 py-12 px-4 text-green-700">
      <motion.div
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Trees className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-900">Tree Plantation</h1>
            <p className="text-green-700">Earn tokens for growing our planet</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              Number of Trees Planted *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.numberOfTrees}
              onChange={(e) => setFormData({ ...formData, numberOfTrees: e.target.value })}
              className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-700 transition-colors"
              placeholder="e.g., 5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              Plantation Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-700 transition-colors"
              placeholder="e.g., Central Park, New Delhi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              Tree Species/Types *
            </label>
            <div className="space-y-3">
              {formData.treeTypes.map((type, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={type}
                    onChange={(e) => updateTreeType(index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-700 transition-colors"
                    placeholder={`Tree type ${index + 1} (e.g., Neem, Mango, Oak)`}
                  />
                  {formData.treeTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTreeType(index)}
                      className="w-12 h-12 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTreeType}
                className="w-full py-3 border-2 border-dashed border-green-300 rounded-xl text-green-700 hover:border-green-700 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Another Tree Type
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              Upload Proof Image *
            </label>
            <div className="relative">
              <input
                type="file"
                required
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="plantation-upload"
              />
              <label
                htmlFor="plantation-upload"
                className="w-full px-4 py-6 border-2 border-dashed border-green-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-700 transition-colors"
              >
                <Upload className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm text-green-700 text-center">
                  {formData.imageFile 
                    ? formData.imageFile.name 
                    : 'Click to upload image proof (JPG, PNG)'}
                </span>
                <span className="text-xs text-green-600 mt-1">
                  Photo should show planted trees clearly
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
            className="w-full py-4 bg-gradient-to-r from-green-700 to-emerald-800 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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