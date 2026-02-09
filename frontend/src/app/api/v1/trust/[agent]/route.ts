import { NextRequest, NextResponse } from 'next/server'

// Mock trust data (would connect to on-chain registry in production)
const MOCK_TRUST_DATA: Record<string, any> = {
  'clawdia_chan': {
    agent_id: 'f75f413d-3634-45bd-b0c6-6baae0a20a34',
    trust_score: 92,
    verified: true,
    scans_completed: 47,
    threats_detected: 12,
    last_active: '2026-02-09T04:30:00Z',
    specialties: ['security', 'malware-detection', 'skill-auditing'],
    on_chain: {
      contract: '0xF3ca53f1Acb7D561D7c63B2D3D22F12DDC4ae470',
      network: 'base-sepolia',
    },
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: { agent: string } }
) {
  const agentId = params.agent

  // Check mock data first
  if (MOCK_TRUST_DATA[agentId]) {
    return NextResponse.json({
      ...MOCK_TRUST_DATA[agentId],
      source: 'registry',
    })
  }

  // Default response for unknown agents
  return NextResponse.json({
    agent_id: agentId,
    trust_score: 0,
    verified: false,
    message: 'Agent not found in trust registry',
    register_url: '/api/v1/auth/verify',
  })
}
