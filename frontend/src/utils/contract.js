import { ethers } from "ethers";
import ABI from "../../abi/GreenTokenABI.json";

export const CONTRACT_ADDRESS = "0xf10d483eec352f3136e33ad87a1c53188fb400a6";

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  return { contract, signer };
};