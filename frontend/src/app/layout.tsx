import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NovaGuardian - Agent Security Layer',
  description: 'The Agent Sandbox & Security Layer for AI Agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
