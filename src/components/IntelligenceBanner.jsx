import { useIntelligence } from '../config/IntelligenceContext.jsx'
import { useWebLLMEngine } from '../lib/useWebLLMEngine.js'

const TIER_DETAILS = {
  LOCAL: {
    bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    tag: 'WebGPU Local · Zero Cloud',
    engine: 'SmolLM2 / Phi-3.5 via WebLLM',
    latency: '~400ms (on-device GPU)',
    privacy: '100% local (Native GDPR)',
    desc: 'AI executes on-device via WebGPU. Zero network calls, zero API keys required, private data stays local.',
  },
  HYBRID: {
    bg: 'bg-indigo-50/80 border-indigo-200 text-indigo-900',
    tag: 'Edge Local + Cloud Gateway',
    engine: 'WebLLM (local) + Claude 3.5 Sonnet (OpenRouter)',
    latency: '~250ms',
    privacy: 'Hybrid (Anonymized data)',
    desc: 'Intelligent partitioning: sensitive fields remain in the client, while cloud handles multi-session reasoning.',
  },
  VISION: {
    bg: 'bg-purple-50/80 border-purple-200 text-purple-900',
    tag: 'Machine-Native · System One',
    engine: 'Jev / System One Models (TypeSafe AI)',
    latency: '~100ms (predictive)',
    privacy: 'Agent-Ready / WebMCP',
    desc: 'The interface no longer reacts after the fact: it anticipates user intent before the click happens.',
  },
}

export default function IntelligenceBanner() {
  const { tier } = useIntelligence()
  const detail = TIER_DETAILS[tier.id] || TIER_DETAILS.LOCAL
  const { status, progress, progressText, loadEngine } = useWebLLMEngine()

  return (
    <aside aria-label="Active AI Architecture Details" className={`border-b transition-colors duration-300 ${detail.bg}`}>
      <div className="mx-auto max-w-5xl px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/80 shadow-xs border border-current/20">
            {tier.label}
          </span>
          <span className="font-medium hidden md:inline">{detail.desc}</span>
          <span className="font-medium md:hidden">{detail.tag}</span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 text-[11px] font-mono">
          {tier.id === 'LOCAL' ? (
            <>
              {status === 'ready' && (
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  WebGPU Active
                </span>
              )}
              {(status === 'downloading' || status === 'checking') && (
                <span className="inline-flex items-center gap-1.5 font-bold text-amber-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse shadow-xs">
                  ⏳ {Math.round(progress * 100)}% ({progressText || 'Loading...'})
                </span>
              )}
              {status === 'idle' && (
                <button
                  type="button"
                  onClick={() => loadEngine()}
                  className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-2.5 py-0.5 font-sans font-medium transition-all shadow-xs cursor-pointer"
                >
                  🚀 Load WebLLM (SmolLM2)
                </button>
              )}
            </>
          ) : (
            <>
              <span>⚙️ {detail.engine}</span>
              <span>⚡ {detail.latency}</span>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
