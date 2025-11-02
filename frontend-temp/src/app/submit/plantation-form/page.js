'use client';
import { motion } from 'framer-motion';
import { Trees, Upload, CheckCircle, Plus, X, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function PlantationForm() {
  const [formData, setFormData] = useState({
    numberOfTrees: '',
    location: '',
    treeTypes: [''],
    imageFile: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [account, setAccount] = useState(null);

  // Connect wallet function (you'll need to call this elsewhere or on mount)
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
    if (!formData.numberOfTrees || !formData.location || !formData.imageFile) {
      alert("⚠️ Please fill in all required fields");
      return;
    }

    if (formData.treeTypes.some(type => !type.trim())) {
      alert("⚠️ Please fill in all tree types");
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

      // Log plantation data
      console.log('Plantation Data Submitted:', formData);

      // Mint tokens
      await mintTokens(walletAccount);
      
      // Success!
      alert("✅ Plantation submitted and 50 Green Tokens minted successfully!");
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          numberOfTrees: '',
          location: '',
          treeTypes: [''],
          imageFile: null
        });
      }, 3000);

    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setIsMinting(false);
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
            disabled={isMinting || submitted}
            whileHover={{ scale: isMinting ? 1 : 1.02 }}
            whileTap={{ scale: isMinting ? 1 : 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-green-700 to-emerald-800 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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

        <div className="mt-6 p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-green-900">
            🌳 <strong>Token Reward:</strong> Earn 50 tokens for each successful submission. Native species earn bonus rewards!
          </p>
        </div>
      </motion.div>
    </div>
  );
}