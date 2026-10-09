/**
 * ProductHero
 * Le titre et le visuel principal changent selon l'intent détecté.
 * data-profile="expert" et data-profile="lifestyle" permettent à
 * useImplicitIntent de mesurer le dwell time sur cette section.
 */
const CONTENT = {
  expert: {
    kicker: "SPÉCIFICATIONS D'ATELIER & EXTRACTION",
    title: 'Lumina 9000 — Double chaudière PID, extraction 9 bars',
    description: 'Pompe vibratoire 15 bars calibrée à 9. Contrôle PID numérique ±0.5°C. Buse vapeur inox 4 trous 360°. Pour les baristas exigeants qui recherchent la perfection d\'extraction.',
    cta: 'Commander avec garantie extraction 5 ans →',
  },
  lifestyle: {
    kicker: "COLLECTION INTÉRIEUR & ART DE VIVRE",
    title: 'La Lumina 9000 — L\'art de l\'espresso dans votre cuisine',
    description: 'Finition cuivre brossé exclusive. Silence feutré à 42 dB. Une silhouette sculpturale pensée pour sublimer votre rituel du matin et habiter chaleureusement votre espace.',
    cta: 'Commander en Finition Cuivre (899 $) →',
  },
  general: {
    kicker: "GAMME PROFESSIONNELLE",
    title: 'Lumina 9000 — L\'espresso parfait à la maison',
    description: 'Précision d\'extraction professionnelle dans un design pensé pour votre quotidien. Le meilleur des deux mondes.',
    cta: 'Ajouter au panier — 899 $ →',
  },
}

const COLORS = [
  { id: 'noir',   label: 'Noir Mat',      hex: '#1a1a1a', profile: 'expert' },
  { id: 'acier',  label: 'Acier Brossé',  hex: '#8c8c8c', profile: 'general' },
  { id: 'cuivre', label: 'Cuivre Brossé', hex: '#b87333', profile: 'lifestyle' },
]

export default function ProductHero({ intent, onSwatchClick }) {
  const content = CONTENT[intent] || CONTENT.general
  const isExpert = intent === 'expert'
  const isLifestyle = intent === 'lifestyle'

  return (
    <section data-profile={intent} className="grid gap-10 lg:grid-cols-12 items-start">
      {/* Visuel produit haute fidélité */}
      <div className={`lg:col-span-6 relative group overflow-hidden rounded-2xl border transition-all duration-700 shadow-sm ${
        isLifestyle
          ? 'lg:col-span-7 border-amber-200/90 ring-1 ring-amber-300/40 shadow-amber-900/5'
          : isExpert
          ? 'border-zinc-300 bg-zinc-900/5 shadow-zinc-900/10'
          : 'border-zinc-200/90 bg-zinc-100'
      }`}>
        <img
          src="/lumina-coffee.jpg"
          alt="Machine à café Lumina 9000"
          className="w-full h-full object-cover object-center aspect-[4/5] sm:aspect-square lg:aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.02]"
        />

        {/* Badge contextuel incrusté en bas de photo */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 bg-zinc-950/85 backdrop-blur-md px-4 py-2.5 rounded-xl text-white text-xs border border-white/10 font-mono shadow-lg">
          {isExpert && (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Extraction : 9.0 BAR (PID 93.2°C)</span>
              </div>
              <span className="text-zinc-400 text-[11px]">Chaudière dual-brass</span>
            </>
          )}
          {isLifestyle && (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Silence acoustique : 42 dB</span>
              </div>
              <span className="text-amber-200/80 text-[11px]">Édition Cuivre & Céramique</span>
            </>
          )}
          {!isExpert && !isLifestyle && (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span>Lumina 9000 Edition</span>
              </div>
              <span className="text-zinc-400 text-[11px]">Design & Ingénierie Suisse</span>
            </>
          )}
        </div>
      </div>

      {/* Informations produit */}
      <div className={`flex flex-col gap-6 lg:py-2 ${
        isLifestyle ? 'lg:col-span-5' : 'lg:col-span-6'
      }`}>
        {/* Titre et description avec hiérarchie impeccable */}
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
                <span className="block text-xs text-zinc-500 font-mono">Pression</span>
                <span className="text-base font-bold text-zinc-900">9.0 BAR</span>
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Précision PID</span>
                <span className="text-base font-bold text-zinc-900">±0.5°C</span>
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Vapeur</span>
                <span className="text-base font-bold text-zinc-900">4 Trous / 360°</span>
              </div>
            </>
          ) : isLifestyle ? (
            <>
              <div>
                <span className="block text-xs text-amber-900/70 font-mono">Silence</span>
                <span className="text-base font-bold text-zinc-950">42 dB</span>
              </div>
              <div>
                <span className="block text-xs text-amber-900/70 font-mono">Châssis</span>
                <span className="text-base font-bold text-zinc-950">100% Métal</span>
              </div>
              <div>
                <span className="block text-xs text-amber-900/70 font-mono">Garantie</span>
                <span className="text-base font-bold text-zinc-950">3 Ans direct</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Chaudière</span>
                <span className="text-base font-bold text-zinc-900">Double</span>
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Réservoir</span>
                <span className="text-base font-bold text-zinc-900">2.5 Litres</span>
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-mono">Chauffe</span>
                <span className="text-base font-bold text-zinc-900">45 sec</span>
              </div>
            </>
          )}
        </div>

        {/* Sélecteur de coloris */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Finitions atelier :</span>
            <span className="font-mono text-zinc-700">
              {isLifestyle ? 'Cuivre Brossé (Sélectionné)' : isExpert ? 'Noir Mat (Sélectionné)' : 'Aluminium brossé & cuivre'}
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
            <span className="text-xs text-zinc-400 pl-2">Palette accordée au profil</span>
          </div>
        </div>

        {/* Prix et Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-950 font-mono tracking-tight">899 $</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">TTC</span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Expédition 24h · Retour gratuit 30j</p>
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
