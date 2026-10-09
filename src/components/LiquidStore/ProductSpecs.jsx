const SPECS = {
  expert: [
    { label: 'Pump',             value: '15-bar vibration — regulated to 9-bar extraction' },
    { label: 'Boilers',          value: 'Dual — coffee 93°C / steam 130°C' },
    { label: 'PID Control',      value: 'Yes — digital ±0.5°C' },
    { label: 'Pre-infusion',     value: 'Programmable — 0 to 30s' },
    { label: 'Steam Wand',       value: '360° articulating, 4-hole commercial' },
    { label: 'Hot Water Flow',   value: '200 ml/min' },
    { label: 'Water Reservoir',  value: '2.5 L removable' },
    { label: 'Power Rating',     value: '1450 W' },
  ],
  lifestyle: [
    { label: 'Dimensions',  value: '28 × 34 × 38 cm' },
    { label: 'Weight',      value: '8.5 kg' },
    { label: 'Acoustics',   value: '42 dB — whisper-quiet operation' },
    { label: 'Finishes',    value: 'Matte Black / Brushed Steel / Copper' },
    { label: 'Warranty',    value: '3-year comprehensive parts & labor' },
  ],
  general: [
    { label: 'Pump',        value: '15 bars' },
    { label: 'Boilers',     value: 'Dual brass' },
    { label: 'Water Tank',  value: '2.5 L' },
    { label: 'Acoustics',   value: '42 dB' },
    { label: 'Warranty',    value: '3 years' },
  ],
}

export default function ProductSpecs({ intent }) {
  const specs = SPECS[intent] || SPECS.general
  const isExpert = intent === 'expert'

  return (
    <section
      data-profile="expert"
      className="mt-16 scroll-mt-24 rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-zinc-400 block">
            {isExpert ? 'Full Technical Specifications' : 'Condensed Overview'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mt-0.5">
            {isExpert ? 'Engineering Tolerances & Hardware Specs' : 'At a Glance'}
          </h2>
        </div>
        {isExpert && (
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-mono font-medium text-emerald-800">
            ✓ 9-bar extraction certified
          </span>
        )}
      </div>

      <dl className="grid sm:grid-cols-2 gap-x-12 gap-y-4 text-sm">
        {specs.map(({ label, value }) => (
          <div key={label} className="flex flex-col sm:flex-row sm:items-baseline justify-between py-2 border-b border-zinc-100 gap-1 sm:gap-4">
            <dt className="text-zinc-500 font-medium text-xs sm:text-sm">{label}</dt>
            <dd className="text-zinc-950 font-mono font-semibold text-xs sm:text-sm sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
