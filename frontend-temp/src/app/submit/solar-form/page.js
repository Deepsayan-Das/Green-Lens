'use client';
import { motion } from 'framer-motion';
import { Sun, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SolarForm() {
  const [formData, setFormData] = useState({
    company: '',
    unitsGenerated: '',
    homeType: '',
    carpetArea: '',
    billFile: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [account, setAccount] = useState(null);

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        return accounts[0];
      } catch (error) {
        console.error("Error connecting wallet:", error);
        return null;
      }
    }
    return null;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, billFile: e.target.files[0] });
    }
  };

  const mintTokens = async (connectedAccount) => {
    try {
      console.log("Minting tokens to:", connectedAccount);
      
      // Import ethers dynamically
      const { ethers } = await import('ethers');
      
      // You'll need to provide your contract ABI and address
      const contractAddress = "YOUR_CONTRACT_ADDRESS";
      const contractABI = [
        "function mint(address to, uint256 amount) public"
      ];

      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Verify contract is deployed
      const code = await provider.getCode(contractAddress);
      if (code === '0x' || code === '0x0') {
        throw new Error("Contract not deployed on current network. Please switch to the correct network.");
      }

      console.log("Minting 50 tokens...");
      const tx = await contract.mint(connectedAccount, ethers.parseUnits("50", 18));
      console.log("Transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Transaction confirmed!");
      
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
      
      throw new Error(errorMsg);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.company || !formData.unitsGenerated || !formData.homeType || 
        !formData.carpetArea || !formData.billFile) {
      alert("⚠️ Please fill in all required fields");
      return;
    }

    setIsMinting(true);

    try {
      // Connect wallet if not connected
      let walletAccount = account;
      if (!walletAccount) {
        walletAccount = await connectWallet();
        if (!walletAccount) {
          alert("⚠️ Please connect your wallet first!");
          setIsMinting(false);
          return;
        }
      }

      // Log solar power data
      console.log('Solar Power Data Submitted:', formData);

      // Mint tokens
      await mintTokens(walletAccount);
      
      // Success!
      alert("✅ Solar power data submitted and 50 Green Tokens minted successfully!");
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          company: '',
          unitsGenerated: '',
          homeType: '',
          carpetArea: '',
          billFile: null
        });
      }, 3000);

    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setIsMinting(false);
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
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-700 transition-colors"
              placeholder="e.g., SunPower, Tesla Solar"
            />
          </div>

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
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-700 transition-colors"
              placeholder="e.g., 320"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Home Type *
            </label>
            <select
              required
              value={formData.homeType}
              onChange={(e) => setFormData({ ...formData, homeType: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-700 transition-colors"
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
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-700 transition-colors"
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
            disabled={isMinting || submitted}
            whileHover={{ scale: isMinting ? 1 : 1.02 }}
            whileTap={{ scale: isMinting ? 1 : 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isMinting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
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
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-xl">
          <p className="text-sm text-amber-900">
            ☀️ <strong>Token Reward:</strong> Earn 50 bonus tokens for every submission of clean solar energy generated!
          </p>
        </div>
      </motion.div>
    </div>
  );
}