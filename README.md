# 🚀 subFlow  
### Automated Subscription & Streaming Payments on Flow EVM using Solidity + Forte Workflows

> **subFlow** is a decentralized subscription and payment streaming platform built on **Flow EVM**, leveraging **Solidity smart contracts** and **Flow Forte Actions & Workflows** for automated recurring payments — all without a backend server.

---

## 🌟 Overview

**subFlow** enables users and businesses to create **on-chain recurring payment subscriptions** directly on the **Flow blockchain**.  

With **Forte Workflows**, payments are **automatically executed** at scheduled intervals, eliminating the need for centralized billing systems or manual reminders.

Users can:
- Subscribe to services or creators using Flow EVM tokens.
- Automate periodic payments securely via Forte Workflows.
- Cancel or modify subscriptions anytime on-chain.
- View all active subscriptions and payment history in one dashboard.

---

## 💡 Problem

Traditional payment systems rely on **centralized intermediaries** (banks, Stripe, PayPal) to process recurring payments.  
These systems:
- Are restricted by region and currency.  
- Involve high fees and long settlement times.  
- Lack transparency and full user control.

Even in crypto, most blockchains **don’t natively automate payments** — users must manually trigger transactions each cycle.

---

## 🧠 Solution

**subFlow** introduces **trustless recurring payments** on **Flow EVM** through smart contracts and **Flow Forte Workflows**.

- Users create a subscription (define recipient, amount, and frequency).  
- The smart contract records it immutably.  
- Forte Workflows automatically triggers `executePayment()` at the scheduled time.  
- Funds move from subscriber → recipient without intermediaries.  
- Users can cancel anytime — full autonomy, zero backend dependency.

---

## 🧱 System Architecture

```text
+---------------------+           +---------------------------+
|     User Wallet     |  <----->  |      React Frontend       |
|  (MetaMask / Flow)  |           | (subFlow Web Interface)   |
+---------------------+           +-------------+-------------+
                                              |
                                              v
                                   +----------------------+
                                   |   Solidity Contract  |
                                   |     (SubFlow.sol     |
                                   |   on Flow EVM Testnet)|
                                   +----------------------+
                                              |
                                              v
                                   +----------------------+
                                   | Forte Workflow Engine|
                                   | - Triggers recurring  |
                                   |   payment execution   |
                                   | - Calls executePayment|
                                   +----------------------+

```

## 🔧 Tech Stack

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Smart Contract** | Solidity | Manages subscription lifecycle |
| **Blockchain** | Flow EVM Testnet | EVM-compatible Flow chain |
| **Automation** | Flow Forte Actions & Workflows | Automates recurring payments |
| **Frontend** | React + TailwindCSS + Wagmi/Viem | Wallet-connected DApp |
| **Wallet** | MetaMask | EVM-compatible wallet |
| **Backend** | None | Fully decentralized (Forte replaces cron jobs) |
| **Hosting** | Vercel / Netlify | Fast frontend deployment |

---

## ⚙️ Smart Contract Overview

**Contract Name:** `SubFlow.sol`

### Core Functions
| Function | Description |
|-----------|-------------|
| `createSubscription(address recipient, uint256 amount, uint256 frequency)` | Initializes a new subscription |
| `cancelSubscription(uint256 id)` | Cancels an active subscription |
| `executePayment(uint256 id)` | Transfers funds at each interval |
| `getUserSubscriptions(address user)` | Fetches active user subscriptions |

**Events:**
- `SubscriptionCreated`
- `PaymentExecuted`
- `SubscriptionCancelled`

---

## ⚙️ Flow Forte Actions & Workflows Integration

- A **Forte Workflow** listens for new `SubscriptionCreated` events.
- It automatically schedules periodic **Action triggers** that call `executePayment()` on the smart contract.
- These executions happen **on-chain**, ensuring decentralization and reliability — no backend servers or cron jobs required.

###  💧 subFlow — Automate the Flow of Recurring Payments on Flow EVM

### ⚙️ Workflow Example (Pseudocode)

```js
onEvent(SubscriptionCreated)
  -> schedule every frequency interval
  -> call contract.executePayment(subscriptionId)
---

## 💻 How to Run Locally
### 1️⃣ Clone Repository
```bash

git clone https://github.com/<your-username>/subflow.git
cd subflow
---

### 2️⃣ Install Dependencies
```bash

npm install
---

### 3️⃣ Configure Environment
Create a .env file:
```bash

PRIVATE_KEY=<your_flow_evm_testnet_wallet_private_key>
RPC_URL=https://testnet.evm.flow.com
---

###4️⃣ Compile & Deploy Contract
```bash

npx hardhat compile
npx hardhat run scripts/deploy.js --network flowTestnet
---

###5️⃣ Run Frontend
```bash

cd frontend
npm run dev
Visit http://localhost:3000 (or your port).
---

###🧪 Testnet Setup
- Faucet
You can request Flow EVM Testnet tokens here:
👉 https://evm-testnet.flow.com/faucet

- Test NFTs or Tokens
If using Flow EVM ERC20 test tokens:

- Tokens are free from the faucet.

- Compatible with standard Solidity ERC20 contracts.

- No real cost during development.
---

### 🎨 UI Features
- ✅ Connect wallet via MetaMask

- 💰 Create new subscription

- 📅 Set amount and frequency

- 🔁 Auto payments triggered by Forte

- ❌ Cancel subscription anytime

- 🧾 View transaction & payment history
---

## 🧩 Hackathon Sponsor Tech Used

| **Sponsor** | **Integration** |
|--------------|-----------------|
| **Flow** | Built on Flow EVM Testnet |
| **Forte** | Automated payment execution via Forte Workflows |
| **Dapper** | EVM wallet compatibility |
| **Find** | (Optional) User identity resolution |
| **Beezie / aiSports / Dune** | Optional integrations (not required for core MVP) |

---

## 📽️ Demo Walkthrough

🎥 **Demo Video:** [link to demo video or Loom recording]

**Steps shown:**
1. Connect wallet  
2. Create subscription  
3. Forte triggers payment automatically  
4. Transaction confirmed on Flow EVM explorer  
5. Subscription cancelled successfully  

---

## 🛠️ Future Improvements

- 💎 NFT-based subscription tiers  
- 📈 Analytics dashboard with Dune integration  
- 🤖 AI billing prediction with Beezie API  
- 💬 Notification system (email / Discord)  
- 💼 Integration with creators’ platforms (YouTube, Patreon, etc.)

---

## 🧑‍💻 Team

| **Role** | **Name** | **Handle** |
|-----------|-----------|-------------|
| Developer | Austin [You] | @<your-handle> |
| Designer / UI | [Optional teammate] | — |

---

## 🏁 License

**MIT License © 2025 subFlow Team**

---

## 🪙 Submission Info (Forte Hacks by Flow)

- **Hackathon:** Forte Hacks 2025 – *Build with Disney, Dune, and Dapper*  
- **Category:** Best Killer App on Flow / Best Use of Flow Forte Actions & Workflows  
- **Prize Eligibility:** ✅ Yes  
- **Project Name:** subFlow  
- **Tech Used:** Flow EVM, Solidity, React, Forte Workflows  
- **Deployed On:** Flow EVM Testnet  

---
