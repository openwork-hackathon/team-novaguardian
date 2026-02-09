import { NextRequest, NextResponse } from 'next/server'

// Security patterns to detect
const MALICIOUS_PATTERNS = [
  { pattern: /eval\s*\(/, category: 'code_execution', severity: 'critical' },
  { pattern: /exec\s*\(/, category: 'code_execution', severity: 'critical' },
  { pattern: /curl.*\|.*sh/, category: 'remote_execution', severity: 'critical' },
  { pattern: /wget.*\|.*bash/, category: 'remote_execution', severity: 'critical' },
  { pattern: /\$\(.*\)/, category: 'command_substitution', severity: 'high' },
  { pattern: /base64.*decode/, category: 'obfuscation', severity: 'high' },
  { pattern: /reverse.?shell/, category: 'backdoor', severity: 'critical' },
  { pattern: /nc\s+-e/, category: 'netcat_backdoor', severity: 'critical' },
  { pattern: /process\.env/, category: 'env_access', severity: 'medium' },
  { pattern: /api[_-]?key/i, category: 'credential_access', severity: 'medium' },
  { pattern: /private[_-]?key/i, category: 'credential_access', severity: 'high' },
  { pattern: /webhook\.site|requestbin|pipedream/i, category: 'exfil_endpoint', severity: 'critical' },
]

async function fetchContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NovaGuardian/1.0' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } catch (e: any) {
    throw new Error(`Fetch failed: ${e.message}`)
  }
}

function scanContent(content: string) {
  const findings: any[] = []
  
  for (const { pattern, category, severity } of MALICIOUS_PATTERNS) {
    const matches = content.match(new RegExp(pattern, 'gi'))
    if (matches) {
      findings.push({
        category,
        severity,
        count: matches.length,
        sample: matches[0].slice(0, 50),
      })
    }
  }
  
  return findings
}

function calculateRiskScore(findings: any[]): number {
  const severityWeights: Record<string, number> = {
    critical: 40,
    high: 25,
    medium: 10,
    low: 5,
  }
  
  let score = 0
  for (const f of findings) {
    score += severityWeights[f.severity] || 5
  }
  
  return Math.min(100, score)
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    // Validate URL
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const content = await fetchContent(url)
    const findings = scanContent(content)
    const riskScore = calculateRiskScore(findings)
    
    return NextResponse.json({
      url,
      scanned_at: new Date().toISOString(),
      content_length: content.length,
      risk_score: riskScore,
      risk_level: riskScore >= 50 ? 'high' : riskScore >= 20 ? 'medium' : 'low',
      findings,
      verdict: findings.length === 0 ? '✅ No threats detected' : `⚠️ ${findings.length} potential issues found`,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
