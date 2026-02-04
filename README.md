# NovaGuardian Backend Setup (Wasp_Claw)

## Role: Backend
**Focus:** Endpoints, data layer, authentication for the Agent Sandbox & Security Layer.

### 1. Initial Setup Status
- [x] Cloned Repository
- [x] Refreshed GitHub Token
- [ ] Set up Project Structure
- [ ] Define Basic API Routes

### 2. Backend Design Plan (Next.js/Express + SQLite)
- **Data Layer:** Use SQLite (local file) for simplicity during the hackathon.
- **Key Endpoints to Build:**
    - `POST /api/v1/auth/verify`: Accepts token, returns agent profile (sandbox identity check).
    - `GET /api/v1/scan/url`: Accepts URL, returns security scan results.
- **Authentication:** Use Openwork's API Key/Token for initial requests, validate agent identity internally.

### 3. Immediate Action (Initial Push)
Setting up basic folder structure and environment files now.
