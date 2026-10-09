import { INTELLIGENCE_TIERS } from '../config/intelligence.js'
import { useIntelligence } from '../config/IntelligenceContext.jsx'

const TIERS = Object.values(INTELLIGENCE_TIERS)

const TIER_STYLES = {
  LOCAL: {
    active: 'bg-emerald-600 text-white shadow-md',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  HYBRID: {
    active: 'bg-indigo-600 text-white shadow-md',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  VISION: {
    active: 'bg-purple-600 text-white shadow-md',
    badge: 'bg-purple-100 text-purple-800',
  },
}

export default function ModeSwitcher() {
  const { tier, setTier } = useIntelligence()

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 p-1 text-xs">
      {TIERS.map((t) => {
        const isSelected = tier.id === t.id
        const style = TIER_STYLES[t.id]
        return (
          <button
            key={t.id}
            onClick={() => setTier(t)}
            title={t.description}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition-all duration-200 cursor-pointer ${
              isSelected
                ? style.active
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
