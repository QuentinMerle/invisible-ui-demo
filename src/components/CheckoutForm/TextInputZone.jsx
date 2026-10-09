import { useState } from 'react'

const SAMPLES = [
  {
    id: 'b2b',
    label: '💼 B2B Email Signature',
    noise: 'Corporate Tax ID, Phone number, Job title, Direct email',
    target: 'Quentin Merle, 42 rue des Érables, G0S 1M0 Saint-Odilon (QC)',
    text: `Quentin Merle
AI Engineer & Senior Web Developer — Vibrisse Studio Inc.
42 rue des Érables, Saint-Odilon (QC) G0S 1M0, Canada
Tel: +1 (418) 555-0198 | quentin@vibrisse-studio.dev
Tax ID: CA-99283741`,
  },
  {
    id: 'corp',
    label: '🏢 Invoice Header Dump',
    noise: 'Corporate email, Phone, Attention line, Floor & Suite',
    target: 'Sarah Connor, Apex Solutions Corp., 1001 Rue du Square-Victoria, Suite 400, Montreal H2Z 2B7',
    text: `Apex Solutions Corp.
Attn: Sarah Connor
1001 Rue du Square-Victoria, Bureau 400
Montréal, QC H2Z 2B7, Canada
s.connor@apex-solutions.ca / (514) 876-4321`,
  },
  {
    id: 'informal',
    label: '📝 Unstructured Plain Text',
    noise: 'Concierge instructions, Cell phone number, Gate code',
    target: 'Marc Dupont, 14 boulevard Saint-Germain, Building B, 75005 Paris',
    text: `Deliver to Marc Dupont at 14 boulevard saint-germain building B gate code 45A2 75005 Paris France please leave with concierge +33 6 12 34 56 78`,
  },
]

export default function TextInputZone({ onSubmit, isLoading }) {
  const [textValue, setTextValue] = useState('')
  const [hoveredSample, setHoveredSample] = useState(null)
  const [activePreviewId, setActivePreviewId] = useState(null)

  function handlePaste(e) {
    const text = e.clipboardData.getData('text')
    if (text.trim()) {
      setTextValue(text)
      onSubmit(text)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (textValue.trim()) onSubmit(textValue.trim())
  }

  function applySampleToInput(sample) {
    setTextValue(sample.text)
    setActivePreviewId(sample.id)
  }

  function testSampleDirectly(sampleText) {
    setTextValue(sampleText)
    onSubmit(sampleText)
  }

  const activeSample = hoveredSample || SAMPLES.find(s => s.id === activePreviewId)

  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 sm:p-10 text-center bg-gray-50/50">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-800">Extraction by local SLM (SmolLM2) in progress…</p>
            <p className="text-xs text-gray-500">On-device WebGPU inference — 0 cloud requests</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <p className="text-xl font-bold text-gray-900">Save time.</p>
            <p className="mt-1 text-sm text-gray-600">
              Paste your email signature, an invoice, or unstructured text.
              <br />
              The local SLM extracts and structures your delivery information in the background.
            </p>
          </div>

          {/* Preset sample buttons with Dev inspection */}
          <div className="flex flex-col gap-2.5 text-left bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-xs relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 font-mono flex items-center gap-1.5">
                <span>💡</span>
                <span>Sample test inputs (Dev):</span>
              </span>
              <span className="text-[11px] text-gray-400 font-sans hidden sm:inline">
                Hover to inspect noise vs target
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLES.map(sample => {
                const isSelected = activePreviewId === sample.id
                return (
                  <div
                    key={sample.id}
                    onMouseEnter={() => setHoveredSample(sample)}
                    onMouseLeave={() => setHoveredSample(null)}
                    className={`group rounded-xl border p-2.5 transition-all text-left flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'border-zinc-800 bg-zinc-50 ring-1 ring-zinc-800'
                        : 'border-gray-200 bg-gray-50/70 hover:bg-white hover:border-gray-400 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-gray-900 block truncate">
                        {sample.label}
                      </span>
                      <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5 font-mono">
                        {sample.target}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-gray-200/60">
                      <button
                        type="button"
                        onClick={() => applySampleToInput(sample)}
                        className="flex-1 rounded-md bg-white hover:bg-gray-100 border border-gray-200 px-2 py-1 text-[10px] font-medium text-gray-700 transition-colors cursor-pointer text-center"
                        title="Paste into field to inspect raw text"
                      >
                        👁️ Paste
                      </button>

                      <button
                        type="button"
                        onClick={() => testSampleDirectly(sample.text)}
                        className="rounded-md bg-zinc-900 hover:bg-zinc-800 text-white px-2 py-1 text-[10px] font-semibold transition-colors cursor-pointer text-center flex items-center gap-1"
                        title="Run extraction directly"
                      >
                        <span>⚡</span>
                        <span>Extract</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Raw text inspection drawer (Tooltip / Dev Preview) */}
            {activeSample && (
              <div className="mt-2 rounded-xl bg-zinc-900 text-zinc-200 p-3.5 text-xs font-mono border border-zinc-800 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                  <span className="font-bold text-amber-400">Raw preview: {activeSample.label}</span>
                  <span className="text-zinc-500">Ready for inference</span>
                </div>

                <pre className="mt-2 text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80 max-h-36 overflow-y-auto">
                  {activeSample.text}
                </pre>

                <div className="mt-2.5 flex flex-wrap gap-2 text-[10px]">
                  <span className="rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5">
                    🚫 Filtered noise: {activeSample.noise}
                  </span>
                  <span className="rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5">
                    🎯 Target: {activeSample.target}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <textarea
              name="rawText"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onPaste={handlePaste}
              rows={5}
              placeholder="Paste any text containing your delivery details here…"
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all font-sans"
            />
            {textValue && (
              <button
                type="button"
                onClick={() => {
                  setTextValue('')
                  setActivePreviewId(null)
                }}
                className="absolute top-3 right-3 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!textValue.trim()}
            className="rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Extract shipping details with local SLM →
          </button>

          <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <span>🔒</span>
            <span>100% on-device processing — your personal details never leave your browser.</span>
          </p>
        </form>
      )}
    </div>
  )
}
