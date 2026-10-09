const ALL_REVIEWS = [
  { id: 1, profile: 'expert',    author: 'Marc D.',   rating: 5, text: 'La pré-infusion programmable est un game-changer. Extraction parfaitement homogène sur mes Geisha 90°C. Le PID tient la température à la virgule.' },
  { id: 2, profile: 'expert',    author: 'Laure T.',  rating: 5, text: 'Double chaudière vraiment indépendantes, aucun délai entre espresso et vapeur. Pour ce prix, aucun concurrent ne tient.' },
  { id: 3, profile: 'lifestyle', author: 'Sophie M.', rating: 5, text: 'Le coloris cuivre est absolument magnifique dans ma cuisine. Et elle est si silencieuse — je peux faire mon espresso sans réveiller personne.' },
  { id: 4, profile: 'lifestyle', author: 'Antoine K.',rating: 4, text: 'Objet du désir absolu. Mes invités la remarquent avant le café. Le résultat dans la tasse est à la hauteur du design.' },
  { id: 5, profile: 'general',   author: 'Isabelle R.',rating: 5, text: 'Première vraie machine après dix ans de capsules. Le saut de qualité est immense. Je ne pensais pas qu\'un espresso maison pouvait être à ce niveau.' },
]

export default function ProductReviews({ intent }) {
  // Filtre les avis selon le profil, fallback sur 'general'
  const reviews = ALL_REVIEWS.filter(r => r.profile === intent || r.profile === 'general')

  return (
    <section data-profile="lifestyle" className="mt-16 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 gap-2">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-zinc-400 block">
            Retours d'expérience vérifiés
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mt-0.5">
            Ce que disent les propriétaires de Lumina
          </h2>
        </div>
        {intent !== 'general' && (
          <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full w-fit">
            ✨ Filtrés sur l'angle {intent === 'expert' ? 'Technique & Extraction' : 'Design & Confort'}
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {reviews.map(review => (
          <article
            key={review.id}
            className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs flex flex-col justify-between gap-4 transition-all hover:border-zinc-300"
          >
            <p className="text-sm text-zinc-700 leading-relaxed font-normal">
              “{review.text}”
            </p>
            <footer className="flex items-center justify-between border-t border-zinc-100 pt-3">
              <div className="flex items-center gap-2.5">
                <span className="h-7 w-7 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono font-bold flex items-center justify-center">
                  {review.author[0]}
                </span>
                <span className="font-semibold text-xs text-zinc-900">{review.author}</span>
              </div>
              <div className="flex text-zinc-900 text-xs tracking-widest" aria-label={`${review.rating} étoiles sur 5`}>
                {'★'.repeat(review.rating)}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
