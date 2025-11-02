'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Mail, Phone, Coins, Edit, TrendingUp, Award, Zap, Sun, Car, Trees, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import GraphComponent from '../components/GraphComponent';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import { getContract } from "../../utils/contract";

export default function UserProfile() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  
  // Wallet and token states
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [greenTokens, setGreenTokens] = useState(0);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [contractError, setContractError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Connect wallet function
  const connectWallet = async () => {
    if (isConnecting) return; // Prevent multiple simultaneous connection attempts
    
    setIsConnecting(true);
    setContractError(null);
    
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        console.log("Not in browser environment");
        return;
      }

      // Check if MetaMask is installed
      if (!window.ethereum) {
        console.warn("MetaMask not installed");
        setContractError("Please install MetaMask to connect your wallet");
        return;
      }

      console.log("Requesting MetaMask accounts...");

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        console.log("Connected to account:", address);
        setAccount(address);
        setContractError(null);
      } else {
        console.warn("No accounts found");
        setContractError("No accounts found. Please unlock MetaMask.");
      }
      
    } catch (error) {
      console.error("Error connecting wallet:", error);
      
      if (error.code === 4001) {
        // User rejected the request
        setContractError("Connection rejected. Please approve the connection in MetaMask.");
      } else if (error.code === -32002) {
        // Request already pending
        setContractError("Connection request pending. Please check MetaMask.");
      } else {
        setContractError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setBalance("0");
    setGreenTokens(0);
    setContractError(null);
    console.log("Wallet disconnected");
  };

  // Fetch token balance
  const viewTokens = async (walletAddress) => {
    if (!walletAddress) {
      console.log("No wallet address provided");
      return;
    }
    
    setIsLoadingTokens(true);
    setContractError(null);
    
    try {
      console.log("Fetching balance for:", walletAddress);
      
      // Get contract and provider
      const contractData = await getContract();
      console.log("Contract data received:", contractData);
      
      const contract = contractData.contract || contractData;
      
      // Check if contract is valid
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      // Get provider - either from contractData or create new one
      let provider = contractData.provider;
      
      if (!provider) {
        console.log("Provider not returned from getContract, creating new one...");
        if (!window.ethereum) {
          throw new Error("MetaMask not found");
        }
        provider = new ethers.BrowserProvider(window.ethereum);
      }

      // Get network info for debugging
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.chainId.toString());
      
      // Check if contract has code (is deployed)
      const contractAddress = contract.target || contract.address;
      console.log("Contract address:", contractAddress);
      
      const code = await provider.getCode(contractAddress);
      console.log("Contract code length:", code.length);
      
      if (code === '0x') {
        throw new Error("Contract not deployed at this address on current network");
      }

      console.log("Contract found, fetching balance...");
      
      // Attempt to get balance
      const bal = await contract.balanceOf(walletAddress);
      console.log("Raw balance:", bal.toString());
      
      const formattedBalance = ethers.formatUnits(bal, 18);
      console.log("Formatted balance:", formattedBalance);
      
      setBalance(formattedBalance);
      setGreenTokens(parseFloat(formattedBalance));
      
    } catch (error) {
      console.error("Error fetching balance:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        data: error.data
      });
      
      // Provide more specific error messages
      let errorMsg = "Failed to fetch balance";
      if (error.message.includes("not deployed")) {
        errorMsg = "Contract not deployed on current network";
      } else if (error.message.includes("BAD_DATA") || error.code === "BAD_DATA") {
        errorMsg = "Contract address may be incorrect or not deployed";
      } else if (error.code === "NETWORK_ERROR") {
        errorMsg = "Network connection error";
      } else if (error.message.includes("MetaMask")) {
        errorMsg = "MetaMask connection error";
      }
      
      setContractError(errorMsg);
      setGreenTokens(0);
      
    } finally {
      setIsLoadingTokens(false);
    }
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts && accounts.length > 0) {
            console.log("Already connected to:", accounts[0]);
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        console.log("Accounts changed:", accounts);
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          // User switched accounts
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        console.log("Chain changed, reloading...");
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Fetch tokens when account changes
  useEffect(() => {
    if (account) {
      console.log("Account connected, fetching tokens...");
      viewTokens(account);
    }
  }, [account]);

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

                {/* Wallet Info */}
                {account ? (
                  <div className="w-full mt-4 space-y-2">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Connected Wallet</p>
                      <p className="text-sm font-mono text-emerald-800 truncate">
                        {account.slice(0, 6)}...{account.slice(-4)}
                      </p>
                    </div>
                    <button 
                      onClick={disconnectWallet}
                      className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="w-full mt-4">
                    <button 
                      onClick={connectWallet}
                      disabled={isConnecting}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4" />
                          Connect Wallet
                        </>
                      )}
                    </button>
                    {contractError && (
                      <p className="text-xs text-red-600 mt-2 text-center">{contractError}</p>
                    )}
                  </div>
                )}

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
              
              {!account ? (
                <div className="mb-4">
                  <div className="text-2xl font-bold text-white/90 mb-2">--</div>
                  <p className="text-sm text-white/80">Connect wallet to view balance</p>
                </div>
              ) : contractError ? (
                <div className="mb-4">
                  <div className="text-2xl font-bold text-white/90 mb-2">⚠️</div>
                  <p className="text-sm text-white/90 mb-2">{contractError}</p>
                  <button 
                    onClick={() => viewTokens(account)}
                    className="text-xs underline text-white/80 hover:text-white"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="text-4xl font-bold mb-2">
                  {isLoadingTokens ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    greenTokens.toLocaleString(undefined, { maximumFractionDigits: 2 })
                  )}
                </div>
              )}
              
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
                  <p className="text-2xl font-bold text-emerald-700">12</p>
                  <p className="text-sm text-gray-600">Submissions</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-700">847 kg</p>
                  <p className="text-sm text-gray-600">CO₂ Saved</p>
                </div>
                <div className="text-center p-4 bg-teal-50 rounded-xl">
                  <p className="text-2xl font-bold text-teal-700">23</p>
                  <p className="text-sm text-gray-600">Trees Planted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div><GraphComponent/></div>
    </div>
  );
}