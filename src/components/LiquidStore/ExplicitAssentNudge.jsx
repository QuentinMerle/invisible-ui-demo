export default function ExplicitAssentNudge({
  suggestedProfile,
  onAccept,
  onDismiss,
}) {
  if (!suggestedProfile) return null

  const isExpert = suggestedProfile === 'expert'

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border border-zinc-200/90 bg-white/95 backdrop-blur-md p-5 shadow-2xl ring-1 ring-zinc-900/5">
        <div className="flex items-start gap-3.5">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-base ${
            isExpert ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isExpert ? '⚙️' : '✨'}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-500">
                Explicit Assent · Invisible UI
              </span>
              <button
                onClick={onDismiss}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-mono cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-bold text-zinc-950 mt-0.5">
              {isExpert
                ? 'Would you like to load the Workshop View (specs & engineering)?'
                : 'Would you like to explore the Lifestyle Edition (finishes & aesthetics)?'}
            </h4>

            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              {isExpert
                ? 'Your browsing focused on extraction components and pressure curves. The layout remains untouched until confirmed.'
                : 'Your browsing focused on finishes, photography, and acoustic silence. The layout remains untouched until confirmed.'}
            </p>

            <div className="mt-3.5 flex items-center gap-2.5">
              <button
                onClick={onAccept}
                className={`rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-xs hover:shadow transition-all cursor-pointer ${
                  isExpert
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-amber-700 hover:bg-amber-800'
                }`}
              >
                {isExpert ? 'Yes, switch to Workshop View ⚙️' : 'Yes, show Copper Edition ✨'}
              </button>

              <button
                onClick={onDismiss}
                className="rounded-xl px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Keep standard view
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
