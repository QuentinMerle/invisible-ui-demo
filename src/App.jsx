import { Routes, Route, Link } from 'react-router-dom'
import ModeSwitcher from './components/ModeSwitcher.jsx'
import IntelligenceBanner from './components/IntelligenceBanner.jsx'
import LiquidStorePage from './components/LiquidStore/LiquidStorePage.jsx'
import CheckoutPage from './components/CheckoutForm/CheckoutPage.jsx'
import { IntelligenceProvider } from './config/IntelligenceContext.jsx'

export default function App() {
  return (
    <IntelligenceProvider>
      <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
        {/* Header global avec le Mode Switcher */}
        <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
            <nav className="flex gap-6 text-sm font-semibold">
              <Link to="/" className="text-zinc-800 hover:text-zinc-950 transition-colors">
                ☕ LiquidStore
              </Link>
              <Link to="/checkout" className="text-zinc-800 hover:text-zinc-950 transition-colors">
                ✨ Auto-Hydrating Form
              </Link>
            </nav>
            <ModeSwitcher />
          </div>
          {/* Bannière explicative dynamique du mode actif */}
          <IntelligenceBanner />
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LiquidStorePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>

        <footer className="mt-24 border-t border-zinc-200/80 py-8 text-center text-xs text-zinc-400 font-mono">
          PoC · Invisible UI Demo ·{' '}
          <a
            href="https://vibrisse-studio.dev"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-600 underline underline-offset-4 hover:text-zinc-900 transition-colors"
          >
            Vibrisse Studio
          </a>{' '}
          · 🍁 Beauce, Québec
        </footer>
      </div>
    </IntelligenceProvider>
  )
}
