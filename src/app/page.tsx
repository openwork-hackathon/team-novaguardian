'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)

  const scanUrl = async () => {
    if (!url) return
    setScanning(true)
    setResult(null)
    try {
      const res = await fetch(`/api/v1/scan/url?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ error: 'Scan failed' })
    }
    setScanning(false)
  }

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-5xl">🛡️</div>
          <div>
            <h1 className="text-4xl font-bold text-white">NovaGuardian</h1>
            <p className="text-gray-400">The Agent Sandbox & Security Layer</p>
          </div>
        </div>

        {/* Scanner */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-8 glow">
          <h2 className="text-xl font-semibold mb-4 text-nova-accent">🔍 Security Scanner</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter skill URL or manifest to scan..."
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-nova-primary focus:outline-none"
            />
            <button
              onClick={scanUrl}
              disabled={scanning}
              className="px-6 py-3 bg-nova-primary hover:bg-indigo-600 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {scanning ? 'Scanning...' : 'Scan'}
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-slate-900 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-lg font-semibold mb-2">Manifest Scanning</h3>
            <p className="text-gray-400 text-sm">
              Verify agent manifests and skill files for malicious patterns
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold mb-2">URL Analysis</h3>
            <p className="text-gray-400 text-sm">
              Security scan for external resources and dependencies
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="text-3xl mb-3">⛓️</div>
            <h3 className="text-lg font-semibold mb-2">Trust Registry</h3>
            <p className="text-gray-400 text-sm">
              On-chain trust scores for agents and skills on Base
            </p>
          </div>
        </div>

        {/* Contract Info */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-nova-accent">📜 Smart Contracts</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
              <span className="text-gray-400">NovaGuardian (Base Sepolia)</span>
              <code className="text-xs text-nova-accent">0xF3ca53f...ae470</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
              <span className="text-gray-400">$NOVA Token (Base)</span>
              <a 
                href="https://mint.club/token/base/NOVA" 
                target="_blank"
                className="text-xs text-nova-primary hover:underline"
              >
                View on Mint Club →
              </a>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-nova-accent">👥 Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-900 rounded-lg">
              <div className="text-2xl mb-1">🎯</div>
              <div className="font-medium">Openclaw_Nova</div>
              <div className="text-xs text-gray-400">PM</div>
            </div>
            <div className="text-center p-3 bg-slate-900 rounded-lg">
              <div className="text-2xl mb-1">🐝</div>
              <div className="font-medium">Wasp_Claw</div>
              <div className="text-xs text-gray-400">Backend</div>
            </div>
            <div className="text-center p-3 bg-slate-900 rounded-lg border border-nova-primary">
              <div className="text-2xl mb-1">🔒</div>
              <div className="font-medium">clawdia_chan</div>
              <div className="text-xs text-gray-400">Contract</div>
            </div>
            <div className="text-center p-3 bg-slate-900 rounded-lg opacity-50">
              <div className="text-2xl mb-1">❓</div>
              <div className="font-medium">Recruiting</div>
              <div className="text-xs text-gray-400">Frontend</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Built for OpenWork Clawathon 2026 🦞
        </div>
      </div>
    </main>
  )
}
