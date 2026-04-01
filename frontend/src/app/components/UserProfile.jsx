'use client';

import { useUser, useAuth, UserButton } from '@clerk/nextjs';
import { Mail, Phone, Coins, Edit, TrendingUp, Award, Zap, Sun, Car, Trees, ShoppingCart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import GraphComponent from '../components/GraphComponent';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function UserProfile() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  
  // Wallet and token states
  const [greenTokens, setGreenTokens] = useState(0);

  // Dashboard State
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoadingDashboard(true);
        const token = await getToken();
        const res = await axios.get("http://localhost:8000/api/v1/users/dashboard", {
          withCredentials: true,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.data.success) {
           setDashboardData(res.data.data);
           // Use backend tokens if available, or fallback to 0
           setGreenTokens(res.data.data.totalGreenTokens || 0); 
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    if (isSignedIn) {
       fetchDashboard();
    }
  }, [isSignedIn]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-emerald-300 rounded-full"></div>
          <div className="h-4 w-32 bg-emerald-300 rounded"></div>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="text-center">
          <p className="text-xl text-gray-600">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900">
              Welcome back, {user.firstName}! 🌿
            </h1>
            <p className="text-emerald-700 mt-1">Track your sustainability journey</p>
          </div>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-12 h-12"
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col items-center">
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-lg mb-4"
                />
                <h2 className="text-xl font-bold text-gray-800 text-center">
                  {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                </h2>
                {user.username && (
                  <p className="text-gray-500 text-sm mt-1">@{user.username}</p>
                )}

                {/* Contact Info */}
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span className="text-gray-700 truncate">
                      {user.primaryEmailAddress?.emailAddress || 'No email'}
                    </span>
                  </div>
                  {user.primaryPhoneNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span className="text-gray-700">
                        {user.primaryPhoneNumber.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats Summary */}
                <div className="w-full mt-4 space-y-2">
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                       <span className="text-sm text-gray-600">Trust Level</span>
                       <span className="font-bold text-emerald-700">{dashboardData?.profile?.trustLevel || 'New'}</span>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                       <span className="text-sm text-gray-600">Carbon Footprint</span>
                       <span className="font-bold text-emerald-700">{dashboardData?.currentCarbonFootprint?.toFixed(1) || 0} kg</span>
                    </div>
                </div>

                {/* Edit Account Button */}
                <button className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Edit className="w-5 h-5" />
                  Edit Account
                </button>
              </div>
            </div>

            {/* Green Tokens Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Green Tokens</h3>
                <Coins className="w-6 h-6" />
              </div>
              
                <div className="text-4xl font-bold mb-2">
                  {loadingDashboard ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    greenTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })
                  )}
                </div>
              
              <div className="space-y-3 mt-6">
                <Link href='/store'>
                  <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                    <Award className="w-5 h-5" />
                    Redeem Tokens
                  </button>
                </Link>
                <Link href='/submit'>
                  <button className="w-full py-3 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mb-6 mt-6">
                    <TrendingUp className="w-5 h-5" />
                    Earn More Tokens
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Earn Tokens Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                Earn Tokens
              </h3>
              <p className="text-gray-600 mb-6">Submit your sustainability data to earn Green Tokens</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Electricity Form */}
                <button onClick={() => router.push('/submit/electricity-form')} className="p-4 border-2 border-yellow-300 hover:border-yellow-500 rounded-xl transition-all hover:shadow-lg group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Electricity Bill</h4>
                      <p className="text-xs text-gray-500">Energy conservation</p>
                    </div>
                  </div>
                </button>

                {/* Solar Form */}
                <button onClick={() => router.push('/submit/solar-form')} className="p-4 border-2 border-orange-300 hover:border-orange-500 rounded-xl transition-all hover:shadow-lg group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <Sun className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Solar Power</h4>
                      <p className="text-xs text-gray-500">Renewable energy</p>
                    </div>
                  </div>
                </button>

                {/* Transport Form */}
                <button onClick={() => router.push('/submit/transport-form')} className="p-4 border-2 border-blue-300 hover:border-blue-500 rounded-xl transition-all hover:shadow-lg group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Transport Mode</h4>
                      <p className="text-xs text-gray-500">Sustainable travel</p>
                    </div>
                  </div>
                </button>

                {/* Plantation Form */}
                <button onClick={() => router.push('/submit/plantation-form')} className="p-4 border-2 border-green-300 hover:border-green-500 rounded-xl transition-all hover:shadow-lg group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Trees className="w-6 h-6 text-green-700" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Tree Plantation</h4>
                      <p className="text-xs text-gray-500">Grow the planet</p>
                    </div>
                  </div>
                </button>

                {/* Purchase Form */}
                <button onClick={() => router.push('/submit/purchase-form')} className="p-4 border-2 border-purple-300 hover:border-purple-500 rounded-xl transition-all hover:shadow-lg group sm:col-span-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <ShoppingCart className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Eco Purchase</h4>
                      <p className="text-xs text-gray-500">Solar panels & EV purchases</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Graph Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">Your Impact</h3>
              <p className="text-gray-600 mb-6">Track your sustainability contributions over time</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-700">
                    {loadingDashboard ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      dashboardData?.totalSubmissions || 0
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Submissions</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-700">
                    {loadingDashboard ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      dashboardData?.co2Saved || 0
                    )} kg
                  </p>
                  <p className="text-sm text-gray-600">CO₂ Saved</p>
                </div>
                <div className="text-center p-4 bg-teal-50 rounded-xl">
                  <p className="text-2xl font-bold text-teal-700">
                     {loadingDashboard ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      dashboardData?.treesPlanted || 0
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Trees Planted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {dashboardData && (
          <GraphComponent 
             monthlyTokens={dashboardData.monthlyTokens} 
             activityBreakdown={dashboardData.activityBreakdown} 
          />
        )}
      </div>
    </div>
  );
}