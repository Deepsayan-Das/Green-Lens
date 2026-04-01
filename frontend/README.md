# GreenLens – Track, Earn, and Give Back to the Planet 🌱

*GreenLens* is an intelligent sustainability platform that helps users understand, track, and reduce their environmental impact. By manually logging daily activities such as travel, energy consumption, and shopping habits, users earn *Green Tokens* for verified eco-friendly actions. Tokens can be redeemed for eco-friendly products or donated to verified NGOs, turning small actions into real-world environmental impact.  

---

## 🌟 Features

- *Track Daily Activities:*  
  Users manually log travel distance, electricity usage, shopping habits, and solar power generation. Optional bill/receipt uploads are processed using *Google Cloud Document AI* for accurate data extraction.  

- *ML-Powered Verification:*  
  An *XGBoost model* validates submitted activities to ensure fair token assignment.  

- *Blockchain Token Management:*  
  Verified eco-friendly actions trigger *Green Token minting* via a *Solidity smart contract* on the *Sepolia testnet*, providing secure and transparent reward tracking.  

- *Redeem Tokens:*  
  Users can redeem tokens for eco-friendly products or donate to verified NGOs. All redemptions are recorded on the blockchain for transparency.  

- *AI Chatbot Assistance:*  
  An intelligent chatbot powered by *OpenAI SDK & Generative AI* helps users log activities, answer sustainability questions, and suggest eco-friendly actions.  

- *Interactive Dashboard:*  
  Users can track token balance, transaction history, leaderboard ranking, and overall environmental impact through a clean *React + TailwindCSS* interface.  

---

## 🛠 Tech Stack

*Frontend:*  
- React  
- TailwindCSS  

*Backend:*  
- Node.js + Express  
- MongoDB  

*AI / ML:*  
- Python (Flask/FastAPI)  
- XGBoost (activity verification)  
- Google Cloud Document AI (OCR extraction)  

*Blockchain:*  
- Solidity Smart Contracts  
- Ethereum Sepolia Testnet  

*Deployment / Hosting:*  
- Vercel (Frontend)  
- Render (Backend)  

*Other Tools:*  
- OpenAI SDK & Generative AI (Chatbot)  
- REST / JSON APIs  

---

## ⚡ Workflow

1. *Track Activities:*  
   Users log sustainable actions or upload receipts/bills.  

2. *Verify Actions:*  
   ML model checks the validity of submitted data.  

3. *Mint Green Tokens:*  
   Verified actions are rewarded via blockchain smart contracts.  

4. *Redeem Tokens:*  
   Tokens can be spent on eco-friendly products or donated to NGOs.  

5. *Track Impact:*  
   Dashboard shows token balance, leaderboard, and contribution history.  

---

## 💚 Impact

GreenLens empowers individuals to take actionable steps toward sustainability while supporting NGOs and eco-startups. By merging blockchain transparency, ML verification, and gamified rewards, GreenLens turns climate awareness into measurable, real-world impact.  

---

## 📥 Installation

1. Clone the repo:  
   ```bash
   git clone https://github.com/your-username/greenlens.git
