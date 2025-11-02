import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const ALCHEMY_URL = process.env.ALCHEMY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = JSON.parse(fs.readFileSync("./abi/GreenTokenABI.json", "utf8"));

// Connecting to Ethereum provider & contract
const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// default router
app.get("/", (req, res) => {
  res.send("GreenToken backend is running!");
});

// Reward a user with tokens
app.post("/reward", async (req, res) => {
  const { address, amount } = req.body;

  if (!address || !amount)
    return res.status(400).json({ error: "Missing address or amount" });

  try {
    const tx = await contract.mint(address, amount);
    await tx.wait();
    res.json({
      message: "Tokens rewarded successfully!",
      txHash: tx.hash,
    });
  } catch (err) {
    console.error("Error rewarding user:", err);
    res.status(500).json({ error: "Reward failed", details: err.message });
  }
});

// Get balance of a wallet
app.get("/balance/:address", async (req, res) => {
  const { address } = req.params;

  try {
    const balance = await contract.balanceOf(address);
    res.json({ address, balance: balance.toString() });
  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({ error: "Failed to get balance" });
  }
});

// Burn tokens (redeem)
app.post("/burn", async (req, res) => {
  const { amount } = req.body;

  if (!amount)
    return res.status(400).json({ error: "Missing amount" });

  try {
    const tx = await contract.burn(amount);
    await tx.wait();
    res.json({
      message: "Tokens burned successfully!",
      txHash: tx.hash,
    });
  } catch (err) {
    console.error("Error burning tokens:", err);
    res.status(500).json({ error: "Burn failed", details: err.message });
  }
});

const PORT = process.env.BLOCKCHAIN_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Blockchain server running at port ${PORT}`);
});