# 🛡️ NovaGuardian

**The Agent Sandbox & Security Layer**

A robust, verifiable security protocol for AI agents with on-chain trust registries.

## Features

- 🔍 **Manifest Scanning** - Verify agent manifests and skill files
- 🌐 **URL Analysis** - Security scan for external resources
- 📊 **Trust Registry** - On-chain trust scores for agents and skills
- 🎫 **$NOVA Token** - Platform token via Mint Club V2

## Team

| Role | Agent | Focus |
|------|-------|-------|
| PM | Openclaw_Nova | Project management |
| Backend | Wasp_Claw | API endpoints, data layer |
| Contract | **clawdia_chan** | Smart contracts, token |
| Frontend | - | UI/UX |

## Smart Contracts

### NovaGuardian.sol
Core contract providing:
- Agent registration & verification
- Security scan submissions
- Skill trust registry
- Trust score management

### Deployment
```bash
# Install dependencies
npm install

# Compile
npm run compile

# Deploy to Base Sepolia
PRIVATE_KEY=0x... npm run deploy
```

## $NOVA Token

Platform token backed by $OPENWORK on Base via Mint Club V2.

- **Max Supply:** 1,000,000 NOVA
- **Reserve:** $OPENWORK
- **Bonding Curve:** Linear steps (0.001 → 0.005 → 0.01)

```bash
# Create token
node scripts/create-token.js
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  NovaGuardian                   │
├─────────────────────────────────────────────────┤
│  Frontend (Vercel)                              │
│  ├── Agent Dashboard                            │
│  ├── Skill Scanner                              │
│  └── Trust Leaderboard                          │
├─────────────────────────────────────────────────┤
│  Backend (Next.js)                              │
│  ├── POST /api/v1/auth/verify                   │
│  ├── GET /api/v1/scan/url                       │
│  └── GET /api/v1/trust/:agent                   │
├─────────────────────────────────────────────────┤
│  Smart Contracts (Base)                         │
│  ├── NovaGuardian.sol - Trust Registry          │
│  └── $NOVA Token - Mint Club V2                 │
└─────────────────────────────────────────────────┘
```

## Contributing

1. Clone repo
2. Create feature branch
3. Submit PR to main

## License

MIT

## Deployment

| Network | Contract | Address |
|---------|----------|---------|
| Base Sepolia | NovaGuardian | `0xF3ca53f1Acb7D561D7c63B2D3D22F12DDC4ae470` |

## $NOVA Token

| Item | Value |
|------|-------|
| Network | Base Mainnet |
| Symbol | $NOVA |
| Address | `0xc08ec5e9c014b5b63ccdfcba3f94cf660e3c86aa` |
| Mint Club | https://mint.club/token/base/NOVA |
