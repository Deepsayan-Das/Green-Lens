
'use client';
import { motion } from 'framer-motion';
import { Car, Bike, Bus, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

import { useAuth } from '@clerk/nextjs';

export default function TransportForm() {
  const { getToken } = useAuth();
  const [isEV, setIsEV] = useState(null);
  const [vehicleType, setVehicleType] = useState('');
  const [formData, setFormData] = useState({
    evCapacity: '',
    odometerReading: '',
    vehicleModel: '',
    vehicleNumber: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const validateForm = () => {
    if (isEV === null) {
      alert("⚠️ Please select if your vehicle is electric");
      return false;
    }

    if (!vehicleType) {
      alert("⚠️ Please select a vehicle type");
      return false;
    }

    // For cycle and public transport, less validation needed
    if (['cycle', 'public-transport'].includes(vehicleType)) {
      // Need distance for calculation
      if(!formData.odometerReading) {
         alert("⚠️ Please enter distance traveled");
         return false;
      }
      return true;
    }

    // For other vehicles, check required fields
    if (!formData.vehicleModel || !formData.vehicleNumber || !formData.odometerReading) {
      alert("⚠️ Please fill in all vehicle details");
      return false;
    }

    // If EV, check battery capacity
    if (isEV && !formData.evCapacity) {
      alert("⚠️ Please enter battery capacity");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare submit data
      // Backend expects: mode, distance, isEV
      let mode = 'default';
      if(vehicleType === 'cycle') mode = 'bicycle';
      else if(vehicleType === 'public-transport') mode = 'public transport';
      else if(vehicleType === '2-wheeler') mode = 'two wheeler';
      else if(vehicleType === '4-wheeler') mode = 'four wheeler';

      const payload = {
        mode: mode,
        distance: Number(formData.odometerReading), // Using odometer field as "Distance Traveled" for this form logic
        isEV: isEV
      };

      console.log('Sending Transport Data:', payload);

      const token = await getToken();

      // Call Backend API
      const res = await axios.post("http://localhost:8000/api/v1/form/transport", payload, {
        withCredentials: true,
        headers: {
           "Authorization": `Bearer ${token}`
        }
      });

      console.log('Backend Response:', res.data);
      const { tokensChange } = res.data.data;

      // Success!
      if(tokensChange > 0) {
        setResponseMsg(`✅ Trip logged! You earned ${tokensChange} Green Points!`);
      } else if (tokensChange < 0) {
         setResponseMsg(`✅ Trip logged. ${Math.abs(tokensChange)} points deducted for carbon emissions.`);
      } else {
         setResponseMsg(`✅ Trip logged successfully.`);
      }
      
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setResponseMsg('');
        setIsEV(null);
        setVehicleType('');
        setFormData({
          evCapacity: '',
          odometerReading: '',
          vehicleModel: '',
          vehicleNumber: ''
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-200 py-12 px-4">
      <motion.div
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Car className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Transport Mode</h1>
            <p className="text-blue-700">Earn tokens for sustainable commuting</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* EV or Not */}
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-3">
              Is your vehicle Electric? *
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsEV(true)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  isEV === true
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Yes, EV
              </button>
              <button
                type="button"
                onClick={() => setIsEV(false)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  isEV === false
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                No, Non-EV
              </button>
            </div>
          </div>

          {/* Vehicle Type */}
          {isEV !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-blue-900 mb-3">
                Vehicle Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['4-wheeler', '2-wheeler', 'cycle', 'public-transport'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setVehicleType(type)}
                    className={`py-3 rounded-xl font-medium transition-all ${
                      vehicleType === type
                        ? 'bg-blue-700 text-white shadow-lg'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {type === '4-wheeler' && <Car className="w-5 h-5 mx-auto mb-1" />}
                    {type === '2-wheeler' && <Bike className="w-5 h-5 mx-auto mb-1" />}
                    {type === 'public-transport' && <Bus className="w-5 h-5 mx-auto mb-1" />}
                    <div className="text-sm capitalize">{type.replace('-', ' ')}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* EV Capacity (if EV) */}
          {isEV === true && vehicleType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Battery Capacity (kWh) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.evCapacity}
                onChange={(e) => setFormData({ ...formData, evCapacity: e.target.value })}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-700 transition-colors text-blue-900 placeholder:text-blue-400"
                placeholder="e.g., 40.5"
              />
            </motion.div>
          )}

          {/* Vehicle Details */}
          {vehicleType && !['cycle', 'public-transport'].includes(vehicleType) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-700 transition-colors text-blue-900 placeholder:text-blue-400"
                  placeholder="e.g., Tesla Model 3, Honda Activa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-700 transition-colors text-blue-900 placeholder:text-blue-400"
                  placeholder="e.g., MH12AB1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Distance Traveled (km) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.odometerReading}
                  onChange={(e) => setFormData({ ...formData, odometerReading: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-700 transition-colors text-blue-900 placeholder:text-blue-400"
                  placeholder="Trip distance in km"
                />
              </div>
            </motion.div>
          )}

          {/* Public Transport/Cycle Info - Needs distance too */}
          {vehicleType && ['cycle', 'public-transport'].includes(vehicleType) && (
             <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
               <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Distance Traveled (km) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.odometerReading}
                  onChange={(e) => setFormData({ ...formData, odometerReading: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-700 transition-colors text-blue-900 placeholder:text-blue-400"
                  placeholder="Trip distance in km"
                />
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-900">
                  🎉 Excellent choice! {vehicleType === 'cycle' ? 'Cycling' : 'Public transport'} is 
                  one of the most sustainable ways to travel. You'll earn bonus tokens!
                </p>
              </div>
            </motion.div>
          )}

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!vehicleType || loading || submitted}
            whileHover={{ scale: vehicleType && !loading ? 1.02 : 1 }}
            whileTap={{ scale: vehicleType && !loading ? 0.98 : 1 }}
            className={`w-full py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all ${
              vehicleType && !loading && !submitted
                ? 'bg-gradient-to-r from-blue-700 to-cyan-800 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : submitted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Submitted!
              </>
            ) : (
              'Submit & Earn Points'
            )}
          </motion.button>
        </div>

        {submitted && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
             <p className="text-sm text-blue-800 font-medium text-center">
                {responseMsg}
             </p>
          </div>
        )}

      </motion.div>
    </div>
  );
}