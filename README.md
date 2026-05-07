# 🛡️ EtherVault

![EtherVault Hero](./ethervault_hero_1778106194126.png)

### Secure. Immutable. Multi-Tenant.
**EtherVault** is a next-generation document verification system that leverages the power of blockchain technology to ensure document integrity and authenticity. Built with a "stealth-luxury" aesthetic, it provides a premium experience for organizations to issue, manage, and verify documents with absolute certainty.

---

## 💎 Key Features

- **🔗 Blockchain-Powered Integrity**: Every document hash is anchored to the blockchain, creating an immutable record of issuance.
- **🏢 Multi-Organization Support**: A robust multi-tenant architecture allowing multiple organizations to operate independently within the same ecosystem.
- **🔐 Hardened Security**: Role-Based Access Control (RBAC) ensures only authorized administrators can issue documents.
- **🕵️ Privacy-First Verification**: Public verification lookups are stripped of sensitive metadata (like IPFS CIDs), showing only essential issuance information.
- **🚀 Automated Verification**: Integrated QR code generation for instant, mobile-friendly document validation.
- **🛡️ Rate-Limited APIs**: Public endpoints are protected with Upstash Redis-backed rate limiting to prevent abuse.
- **✨ Stealth-Luxury UI**: A high-fidelity, dark-themed interface built with Next.js, Framer Motion, and GSAP.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4, Radix UI
- **Animations**: GSAP, Lenis (Smooth Scroll), Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Caching/Rate Limiting**: Upstash Redis
- **Authentication**: JWT, BcryptJS

### Blockchain
- **Development**: Hardhat
- **Library**: Ethers.js v6
- **Network**: Local Hardhat Node / Ethereum EVM

---

## 📂 Project Structure

```text
EtherVault/
├── client/          # Next.js Frontend
├── server/          # Express Backend API
├── chain/           # Hardhat Smart Contracts
└── README.md        # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)
- Redis (Upstash or local)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/me-athxrva/ether-vault.git
   cd ether-vault
   ```

2. **Setup Smart Contracts**
   ```bash
   cd chain
   npm install
   npx hardhat node  # Keep this running
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Setup Backend**
   ```bash
   cd ../server
   npm install
   # Create a .env file based on the environment variables section below
   npm run dev
   ```

4. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   # Create a .env.local file
   npm run dev
   ```

---

## 🔑 Environment Variables

### Server (`/server/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=your_upstash_redis_url
PRIVATE_KEY=your_deployer_private_key
CONTRACT_ADDRESS=your_deployed_contract_address
```

### Client (`/client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
```

---

## 🔒 Security Audit
- **RBAC**: Implemented at the middleware level in the server.
- **Validation**: All document uploads are hashed using `crypto` before blockchain submission.
- **Privacy**: The `/verify` route returns a filtered object, ensuring no sensitive file paths or IDs are leaked.
- **Rate Limiting**: Configured specifically for the verification endpoint to mitigate DDoS attempts.

---

## 📄 License
This project is licensed under the ISC License.

---

<p align="center">
  Built with ❤️ for the Decentralized Web.
</p>
