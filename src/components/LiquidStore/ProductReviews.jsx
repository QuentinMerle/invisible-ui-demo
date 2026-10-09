const ALL_REVIEWS = [
  { id: 1, profile: 'expert',    author: 'Mark D.',   rating: 5, text: 'The programmable pre-infusion is a true game-changer. Unbelievably consistent extraction on my light-roast Geishas at 93°C. The digital PID holds thermal stability to the tenth of a degree.' },
  { id: 2, profile: 'expert',    author: 'Laura T.',  rating: 5, text: 'Genuinely decoupled dual boilers—zero recovery lag between pulling a shot and steaming silky micro-foam. Nothing in this price bracket even competes.' },
  { id: 3, profile: 'lifestyle', author: 'Sophie M.', rating: 5, text: 'The brushed copper finish looks stunning on our white marble kitchen island. And it is so quiet—I can pull my morning espresso at 6 AM without waking anyone up.' },
  { id: 4, profile: 'lifestyle', author: 'Anthony K.', rating: 4, text: 'An absolute centerpiece of industrial design. Guests notice the machine before anything else. The coffee quality matches the visual elegance.' },
  { id: 5, profile: 'general',   author: 'Isabelle R.', rating: 5, text: 'My first serious machine after a decade of pod coffee. The quality leap is massive. I had no idea home espresso could taste this vibrant.' },
]

export default function ProductReviews({ intent }) {
  // Filter reviews by profile, fallback to 'general'
  const reviews = ALL_REVIEWS.filter(r => r.profile === intent || r.profile === 'general')

  return (
    <section data-profile="lifestyle" className="mt-16 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 gap-2">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-zinc-400 block">
            Verified Customer Feedback
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mt-0.5">
            What Lumina Owners Say
          </h2>
        </div>
        {intent !== 'general' && (
          <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full w-fit">
            ✨ Filtered for {intent === 'expert' ? 'Technical & Extraction' : 'Design & Aesthetics'}
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
              <div className="flex text-zinc-900 text-xs tracking-widest" aria-label={`${review.rating} out of 5 stars`}>
                {'★'.repeat(review.rating)}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
