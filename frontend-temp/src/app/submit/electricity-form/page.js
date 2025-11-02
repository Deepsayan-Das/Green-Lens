'use client';
import { motion } from 'framer-motion';
import { Zap, Upload, CheckCircle, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { getContract } from "../../../utils/contract";

export default function ElectricityForm() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    unitsConsumed: '',
    homeType: '',
    carpetArea: '',
    billFile: null
  });
  const [submitted, setSubmitted] = useState(false);

  // Connect wallet on mount
  useEffect(() => {
    checkWalletConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
        } else {
          setAccount(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  // Check if wallet is already connected
  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          console.log("Wallet already connected:", accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        alert("Please install MetaMask to connect your wallet");
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("Connected to account:", accounts[0]);
        alert("✅ Wallet connected successfully!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        alert("Connection rejected. Please approve the connection in MetaMask.");
      } else {
        alert("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, billFile: e.target.files[0] });
    }
  };

  // Mint tokens
  const getTokens = async () => {
    if (!account) {
      alert("⚠️ Please connect your wallet first!");
      return;
    }

    setIsMinting(true);
    try {
      console.log("Minting tokens to:", account);
      
      const contractData = await getContract();
      const contract = contractData.contract || contractData;

      if (!contract) {
        throw new Error("Contract not initialized");
      }

      // Get provider to check contract deployment
      let provider = contractData.provider;
      if (!provider) {
        if (!window.ethereum) {
          throw new Error("MetaMask not found");
        }
        provider = new ethers.BrowserProvider(window.ethereum);
      }

      // Verify contract is deployed
      const contractAddress = contract.target || contract.address;
      const code = await provider.getCode(contractAddress);
      
      if (code === '0x' || code === '0x0') {
        throw new Error("Contract not deployed on current network. Please switch to the correct network.");
      }

      console.log("Minting 50 tokens...");
      const tx = await contract.mint(account, ethers.parseUnits("50", 18));
      console.log("Transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Transaction confirmed!");
      
      alert("✅ 50 Green Tokens minted successfully!");
      return true;
    } catch (error) {
      console.error("Error minting:", error);
      
      let errorMsg = "Failed to mint tokens";
      if (error.message.includes("not deployed")) {
        errorMsg = "Contract not deployed. Please check your network.";
      } else if (error.code === "ACTION_REJECTED") {
        errorMsg = "Transaction rejected by user";
      } else if (error.message.includes("insufficient funds")) {
        errorMsg = "Insufficient funds for gas";
      }
      
      alert(`❌ ${errorMsg}`);
      return false;
    } finally {
      setIsMinting(false);
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

    // Check wallet connection
    if (!account) {
      alert("⚠️ Please connect your wallet first!");
      return;
    }

    console.log('Electricity Bill Submitted:', formData);
    
    // Mint tokens
    const success = await getTokens();
    
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        // Reset form
        setFormData({
          customerId: '',
          unitsConsumed: '',
          homeType: '',
          carpetArea: '',
          billFile: null
        });
      }, 3000);
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

          {/* Wallet Connection Button */}
          {!account ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </>
              )}
            </button>
          ) : (
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              <p className="text-xs text-green-600">Connected</p>
              <p className="font-mono text-xs">{account.slice(0, 6)}...{account.slice(-4)}</p>
            </div>
          )}
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
            disabled={isMinting || submitted}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-700 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Minting Tokens...
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

        <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
          <p className="text-sm text-yellow-900">
            💡 <strong>Token Reward:</strong> Earn 50 Green Tokens for submitting your electricity bill and contributing to energy efficiency tracking.
          </p>
          {!account && (
            <p className="text-xs text-yellow-700 mt-2">
              ⚠️ Connect your wallet to receive tokens
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );}