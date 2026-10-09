/**
 * ProductHero
 * Headline and primary visual change based on detected user intent.
 * data-profile="expert" and data-profile="lifestyle" allow
 * useImplicitIntent to track dwell time on this section.
 */
const CONTENT = {
  expert: {
    kicker: "WORKSHOP SPECIFICATIONS & EXTRACTION",
    title: 'Lumina 9000 — Dual boiler PID, 9-bar extraction',
    description: '15-bar vibration pump regulated to 9 bars. Digital PID control ±0.5°C. 360° 4-hole stainless steam wand. For discerning home baristas demanding extraction perfection.',
    cta: 'Order with 5-year extraction warranty →',
  },
  lifestyle: {
    kicker: "LIVING SPACES & INTERIOR COLLECTION",
    title: 'The Lumina 9000 — Espresso artistry on your countertop',
    description: 'Exclusive brushed copper finish. Muffled acoustics at 42 dB. A sculptural silhouette crafted to elevate your morning ritual and warm your kitchen.',
    cta: 'Order in Copper Finish ($899) →',
  },
  general: {
    kicker: "PROFESSIONAL SERIES",
    title: 'Lumina 9000 — The ultimate home espresso experience',
    description: 'Commercial extraction precision housed in an elegant everyday design. The best of engineering and aesthetics.',
    cta: 'Add to cart — $899 →',
  },
}

const COLORS = [
  { id: 'noir',   label: 'Matte Black',    hex: '#1a1a1a', profile: 'expert' },
  { id: 'acier',  label: 'Brushed Steel',  hex: '#8c8c8c', profile: 'general' },
  { id: 'cuivre', label: 'Brushed Copper', hex: '#b87333', profile: 'lifestyle' },
]

export default function ProductHero({ intent, onSwatchClick }) {
  const content = CONTENT[intent] || CONTENT.general
  const isExpert = intent === 'expert'
  const isLifestyle = intent === 'lifestyle'

  return (
    <section data-profile={intent} className="grid gap-10 lg:grid-cols-12 items-start">
      {/* High-fidelity product visual */}
      <div className={`lg:col-span-6 relative group overflow-hidden rounded-2xl border transition-all duration-700 shadow-sm ${
        isLifestyle
          ? 'lg:col-span-7 border-amber-200/90 ring-1 ring-amber-300/40 shadow-amber-900/5'
          : isExpert
          ? 'border-zinc-300 bg-zinc-900/5 shadow-zinc-900/10'
          : 'border-zinc-200/90 bg-zinc-100'
      }`}>
        <img
          src="/lumina-coffee.jpg"
          alt="Lumina 9000 Espresso Machine"
          className="w-full h-full object-cover object-center aspect-[4/5] sm:aspect-square lg:aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.02]"
        />

        {/* Embedded telemetry badge at bottom of photo */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 bg-zinc-950/85 backdrop-blur-md px-4 py-2.5 rounded-xl text-white text-xs border border-white/10 font-mono shadow-lg">
          {isExpert && (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Extraction: 9.0 BAR (PID 93.2°C)</span>
              </div>
              <span className="text-zinc-400 text-[11px]">Dual-brass boiler</span>
            </>
          )}
          {isLifestyle && (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Acoustic Silence: 42 dB</span>
              </div>
              <span className="text-amber-200/80 text-[11px]">Copper & Ceramic Edition</span>
            </>
          )}
          {!isExpert && !isLifestyle && (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span>Lumina 9000 Edition</span>
              </div>
              <span className="text-zinc-400 text-[11px]">Swiss Design & Engineering</span>
            </>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className={`flex flex-col gap-6 lg:py-2 ${
        isLifestyle ? 'lg:col-span-5' : 'lg:col-span-6'
      }`}>
        <div>
          <span className={`text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md mb-3 inline-block transition-colors ${
            isLifestyle
              ? 'bg-amber-100 text-amber-900 border border-amber-200'
              : isExpert
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
          }`}>
            {content.kicker}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 leading-[1.15] transition-all duration-500">
            {content.title}
          </h1>
          <p className="mt-3.5 text-base text-zinc-600 leading-relaxed transition-all duration-300">
            {content.description}
          </p>
        </div>

        {/* Micro-metrics strip */}
        <div className={`grid grid-cols-3 gap-3 border-y py-4 my-1 transition-colors ${
          isLifestyle ? 'border-amber-200/80 bg-amber-50/30 -mx-2 px-2 rounded-lg' : 'border-zinc-200/80'
        }`}>
          {isExpert ? (
            <>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Pressure</span>
                <span className="text-base font-bold text-zinc-900">9.0 BAR</span>
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">PID Accuracy</span>
                <span className="text-base font-bold text-zinc-900">±0.5°C</span>
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Steam</span>
                <span className="text-base font-bold text-zinc-900">4 Holes / 360°</span>
              </div>
            </>
          ) : isLifestyle ? (
            <>
              <div>
                <span className="block text-xs text-amber-900/70 font-mono">Silence</span>
                <span className="text-base font-bold text-zinc-950">42 dB</span>
              </div>
              <div>
                <span className="block text-xs text-amber-900/70 font-mono">Chassis</span>
                <span className="text-base font-bold text-zinc-950">100% Metal</span>
              </div>
              <div>
                <span className="block text-xs text-amber-900/70 font-mono">Warranty</span>
                <span className="text-base font-bold text-zinc-950">3 Years Direct</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Boilers</span>
                <span className="text-base font-bold text-zinc-900">Dual</span>
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Water Tank</span>
                <span className="text-base font-bold text-zinc-900">2.5 Liters</span>
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Warm-up</span>
                <span className="text-base font-bold text-zinc-900">45 sec</span>
              </div>
            </>
          )}
        </div>

        {/* Color finish selector */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Workshop Finishes:</span>
            <span className="font-mono text-zinc-700">
              {isLifestyle ? 'Brushed Copper (Selected)' : isExpert ? 'Matte Black (Selected)' : 'Brushed Aluminum & Copper'}
            </span>
          </div>
          <div className="flex gap-3 items-center">
            {COLORS.map(color => {
              const isSelectedColor = (isLifestyle && color.id === 'cuivre') || (isExpert && color.id === 'noir') || (!isExpert && !isLifestyle && color.id === 'acier')
              return (
                <button
                  key={color.id}
                  title={color.label}
                  className={`h-9 w-9 rounded-full border-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isSelectedColor
                      ? 'border-white ring-2 ring-zinc-900 scale-110'
                      : 'border-white ring-1 ring-zinc-300 hover:ring-zinc-600'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => {
                    document.documentElement.style.setProperty('--color-accent', color.hex)
                    if (onSwatchClick && color.profile !== 'general') {
                      onSwatchClick(color.profile)
                    }
                  }}
                />
              )
            })}
            <span className="text-xs text-zinc-400 pl-2">Palette matched to profile</span>
          </div>
        </div>

        {/* Pricing and Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-950 font-mono tracking-tight">$899</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">VAT incl.</span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Ships in 24h · 30-day free returns</p>
          </div>

          <button
            className="rounded-xl px-7 py-3.5 font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] text-sm cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)' }}
            onClick={() => window.location.href = '/checkout'}
          >
            {content.cta}
          </button>
        </div>
      </div>
    </section>
  )
}
