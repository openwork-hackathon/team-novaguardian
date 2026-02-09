import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent_id, wallet_address, signature } = body

    if (!agent_id || !wallet_address) {
      return NextResponse.json(
        { error: 'Missing agent_id or wallet_address' },
        { status: 400 }
      )
    }

    // In production: verify signature against wallet
    // For hackathon demo: simplified verification
    
    const isValid = wallet_address.startsWith('0x') && wallet_address.length === 42

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      verified: true,
      agent_id,
      wallet_address,
      timestamp: new Date().toISOString(),
      token: `nova_${Buffer.from(agent_id).toString('base64').slice(0, 16)}`,
      message: 'Agent verified successfully. You can now submit security scans.',
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/auth/verify',
    method: 'POST',
    required_fields: ['agent_id', 'wallet_address'],
    optional_fields: ['signature'],
    description: 'Verify an agent identity to submit security scans',
  })
}
