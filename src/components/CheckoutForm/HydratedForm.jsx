import { useState } from 'react'

/**
 * HydratedForm
 * Displays the form auto-filled by the local model.
 * Fields with 'low'/'medium' confidence display an amber highlight.
 * Fields with 'high' confidence display a green badge.
 * Includes a developer inspector (Raw input vs Extracted JSON).
 */
const FIELDS = [
  { key: 'prenom',         label: 'First name',       type: 'text' },
  { key: 'nom',            label: 'Last name',        type: 'text' },
  { key: 'entreprise',     label: 'Company',          type: 'text' },
  { key: 'adresse_ligne1', label: 'Street address',   type: 'text' },
  { key: 'adresse_ligne2', label: 'Apt, suite, bldg', type: 'text' },
  { key: 'code_postal',    label: 'Postal code',      type: 'text' },
  { key: 'ville',          label: 'City',             type: 'text' },
  { key: 'pays',           label: 'Country',          type: 'text' },
]

function getFieldStyle(confidence) {
  if (!confidence) return 'border-zinc-200 bg-white text-zinc-900 focus:border-zinc-800'
  if (confidence === 'high') return 'border-emerald-300 bg-emerald-50/20 text-zinc-950 focus:border-emerald-500'
  if (confidence === 'medium') return 'border-amber-400 bg-amber-50/30 text-zinc-950 focus:border-amber-500'
  return 'border-rose-300 bg-rose-50/30 text-zinc-950 focus:border-rose-500'
}

function ConfidenceBadge({ confidence }) {
  if (!confidence) return null
  if (confidence === 'high') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
        ✓ Verified
      </span>
    )
  }
  if (confidence === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded animate-pulse">
        ✨ Review
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
      ⚠ Uncertain
    </span>
  )
}

export default function HydratedForm({ data, meta = {}, onReset }) {
  const [showInspector, setShowInspector] = useState(false)
  const { _confidence = {}, ...fields } = data

  const uncertainCount = Object.values(_confidence).filter(c => c !== 'high').length
  const isWebLLM = meta?.source === 'webllm'

  return (
    <div className="flex flex-col gap-6">
      {/* Extraction status banner */}
      <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isWebLLM ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
            <p className="font-bold text-sm text-zinc-900 font-mono">
              {isWebLLM
                ? `Local WebLLM Extraction (${meta.latencyMs || '~400'}ms · On-Device GPU)`
                : 'Hydrated via heuristic fallback'}
            </p>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isWebLLM
              ? `The local model parsed this text directly on your GPU. Zero bytes transmitted.`
              : (uncertainCount > 0
                ? `${uncertainCount} field(s) require review before checkout.`
                : 'All delivery fields extracted with maximum confidence score.')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowInspector(!showInspector)}
            className="rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>🔍</span>
            <span>{showInspector ? 'Hide inspector' : 'Inspect dev payload'}</span>
          </button>

          {uncertainCount > 0 && (
            <span className="text-xs font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-xl">
              ✨ {uncertainCount} to confirm
            </span>
          )}
        </div>
      </div>

      {/* Developer Inspector: Raw Input vs Extracted JSON */}
      {showInspector && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-200 p-5 shadow-xl font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-base">🧪</span>
              <span className="font-bold text-white text-sm">Developer Inspector · Judge AI Extraction Quality</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">
                Source: {meta.source === 'webllm' ? 'WebLLM (WebGPU)' : 'Heuristic'}
              </span>
              <span className="rounded bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 font-bold">
                ⚡ {meta.latencyMs || 0} ms
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Raw Unstructured Input with noise */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="font-semibold text-amber-300">1. UNSTRUCTURED RAW INPUT</span>
                <span>{meta.rawInput?.length || 0} characters</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-300 text-[11px] whitespace-pre-wrap font-mono leading-relaxed border border-zinc-800/90 h-64 overflow-y-auto">
                {meta.rawInput || 'No raw text provided'}
              </pre>
              <div className="text-[10px] text-zinc-400 font-sans leading-normal">
                💡 <strong>Analysis:</strong> The model isolated delivery targets (address, postal code, city) while discarding corporate noise (tax ID, phone, job title, sign-offs).
              </div>
            </div>

            {/* Column 2: Structured Output JSON with confidence */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="font-semibold text-emerald-400">2. EXTRACTED JSON (STRICT SCHEMA)</span>
                <span className="text-zinc-500 font-sans">Grammar: xgrammar</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-zinc-900 text-emerald-300 text-[11px] whitespace-pre font-mono leading-relaxed border border-zinc-800/90 h-64 overflow-y-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
              <div className="text-[10px] text-zinc-400 font-sans leading-normal">
                ✨ <strong>Confidence:</strong> Notice the <code className="text-zinc-300">_confidence</code> object—it directly controls the amber <span className="text-amber-400">✨ Review</span> highlights in the form.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-hydrated form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          alert('Order confirmed successfully! (Simulation)')
        }}
        className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map(({ key, label, type }) => {
            const confidence = _confidence[key]
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-700">
                    {label}
                  </label>
                  <ConfidenceBadge confidence={confidence} />
                </div>
                <input
                  type={type}
                  defaultValue={fields[key] || ''}
                  className={`rounded-xl border px-3.5 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all ${getFieldStyle(confidence)}`}
                />
              </div>
            )
          })}
        </div>

        <div className="border-t border-zinc-100 pt-5 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-500 block">Order total</span>
            <span className="text-xl font-bold font-mono text-zinc-900">$899 VAT incl.</span>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-zinc-950 px-8 py-3.5 font-semibold text-white hover:bg-zinc-800 transition-all text-sm cursor-pointer shadow-sm hover:shadow"
          >
            Confirm & Pay for Lumina 9000 →
          </button>
        </div>
      </form>

      <button
        type="button"
        onClick={onReset}
        className="text-center text-xs text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
      >
        ← Start over with another signature or raw text
      </button>
    </div>
  )
}
