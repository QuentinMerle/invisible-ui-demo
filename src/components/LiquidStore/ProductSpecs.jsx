const SPECS = {
  expert: [
    { label: 'Pompe',             value: 'Vibratoire 15 bars — bridée 9 bars extraction' },
    { label: 'Chaudière',         value: 'Double — café 93°C / vapeur 130°C' },
    { label: 'Contrôle PID',      value: 'Oui — ±0.5°C' },
    { label: 'Pré-infusion',      value: 'Programmable — 0 à 30s' },
    { label: 'Buse vapeur',       value: 'Orientable 360°, 4 trous' },
    { label: 'Débit eau chaude',  value: '200 ml/min' },
    { label: 'Capacité réservoir','value': '2.5 L amovible' },
    { label: 'Puissance',         value: '1450 W' },
  ],
  lifestyle: [
    { label: 'Dimensions',  value: '28 × 34 × 38 cm' },
    { label: 'Poids',       value: '8.5 kg' },
    { label: 'Bruit',       value: '42 dB — silence de fonctionnement' },
    { label: 'Coloris',     value: 'Noir Mat / Acier Brossé / Cuivre' },
    { label: 'Garantie',    value: '3 ans pièces et main d\'œuvre' },
  ],
  general: [
    { label: 'Pompe',       value: '15 bars' },
    { label: 'Chaudière',   value: 'Double' },
    { label: 'Réservoir',   value: '2.5 L' },
    { label: 'Bruit',       value: '42 dB' },
    { label: 'Garantie',    value: '3 ans' },
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
            {isExpert ? 'Spécifications complètes' : 'Aperçu condensé'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mt-0.5">
            {isExpert ? 'Caractéristiques d\'ingénierie & tolérances' : 'En un coup d\'œil'}
          </h2>
        </div>
        {isExpert && (
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-mono font-medium text-emerald-800">
            ✓ Certifié extraction 9 bars
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
