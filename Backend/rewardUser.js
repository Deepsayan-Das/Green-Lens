require("dotenv").config();
const { ethers } = require("ethers");
const contractABI = require("./abi/GreenTokenABI.json");

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

// function to mint tokens
async function mint(address, amount) {
  try {
    const tx = await contract.mint(address, amount);
    await tx.wait();
    console.log(`{amount} tokens rewarded to ${address}`);
    return tx.hash;
  } catch (err) {
    console.error("Error rewarding user:", err);
    throw err;
  }
}

module.exports = mint;