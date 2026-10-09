import { createContext, useContext, useState } from 'react'
import { INTELLIGENCE_TIERS } from './intelligence.js'

const IntelligenceContext = createContext(null)

export function IntelligenceProvider({ children }) {
  const [tier, setTier] = useState(INTELLIGENCE_TIERS.LOCAL)
  const [apiKey, setApiKey] = useState('')

  return (
    <IntelligenceContext.Provider value={{ tier, setTier, apiKey, setApiKey }}>
      {children}
    </IntelligenceContext.Provider>
  )
}

export function useIntelligence() {
  const ctx = useContext(IntelligenceContext)
  if (!ctx) throw new Error('useIntelligence must be used inside IntelligenceProvider')
  return ctx
}
