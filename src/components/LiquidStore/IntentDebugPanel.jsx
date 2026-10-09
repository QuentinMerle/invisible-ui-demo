import { useState } from 'react'

export default function IntentDebugPanel({
  intent,
  scores,
  activeProfileInView,
  hoveredProfile,
  isLocked,
  elapsedSeconds = 0,
  totalWindowSeconds = 6.0,
  requireAssent = true,
  onToggleRequireAssent,
  onForceIntent,
  onSimulateProfile,
  onReset,
  engineStatus = 'idle',
  engineProgress = 0,
  engineProgressText = '',
  engineModelId = '',
  onLoadEngine,
  onTriggerWebLLM,
  arbitrationSource = 'heuristic',
  arbitrationLatency = null,
  isArbitrating = false,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const percentElapsed = Math.min(100, (elapsedSeconds / totalWindowSeconds) * 100)

  // Calcul du ratio pour la jauge bicolore
  const totalScore = (scores.expert || 0) + (scores.lifestyle || 0)
  const expertPct = totalScore > 0 ? Math.round(((scores.expert || 0) / totalScore) * 100) : 50
  const lifestylePct = 100 - expertPct

  // État minimisé très discret
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 rounded-full border border-zinc-200/90 bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs shadow-xl font-mono flex items-center gap-2 hover:bg-zinc-50 transition-all cursor-pointer text-zinc-700"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold">Intent : {intent.toUpperCase()}</span>
        <span className="text-[11px] text-zinc-400">· {elapsedSeconds > 0 && !isLocked ? `${elapsedSeconds.toFixed(1)}s` : isLocked ? '🔒' : '⏸️'}</span>
        <span className="text-[11px] text-zinc-400 underline">Déplier ↗</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-zinc-200/90 bg-white/95 backdrop-blur-md p-4 text-xs shadow-2xl font-mono flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)]">
      {/* 1. En-tête épuré */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${
            engineStatus === 'checking' || engineStatus === 'downloading'
              ? 'bg-amber-500 animate-pulse'
              : !isLocked && elapsedSeconds > 0
              ? 'bg-emerald-500 animate-ping'
              : isLocked
              ? 'bg-zinc-800'
              : 'bg-zinc-400'
          }`} />
          <span className="font-bold text-zinc-900">Intent Engine</span>
          <span className="text-[10px] text-zinc-400 font-sans">
            {engineStatus === 'checking' || engineStatus === 'downloading'
              ? '⏳ Pause (téléchargement)'
              : isLocked
              ? '🔒 Stabilisé'
              : elapsedSeconds > 0
              ? `${elapsedSeconds.toFixed(1)}s / ${totalWindowSeconds}s`
              : 'En attente de scroll'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            intent === 'expert'
              ? 'bg-emerald-100 text-emerald-800'
              : intent === 'lifestyle'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-zinc-100 text-zinc-700'
          }`}>
            {intent}
          </span>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-zinc-400 hover:text-zinc-700 p-0.5 text-xs cursor-pointer ml-1"
            title="Minimiser le panneau"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Barre de chronomètre (fine) */}
      <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden -mt-1">
        <div
          className={`h-full transition-all duration-300 ${
            isLocked ? 'bg-zinc-800' : 'bg-emerald-500'
          }`}
          style={{ width: `${percentElapsed}%` }}
        />
      </div>

      {/* 2. Jauge d'attention unifiée (Bipolaire Specs vs Design) */}
      <div className="flex flex-col gap-1.5 bg-zinc-50/80 p-2.5 rounded-xl border border-zinc-100">
        <div className="flex justify-between items-center text-[11px]">
          <span className={`font-semibold ${scores.expert >= scores.lifestyle ? 'text-emerald-700 font-bold' : 'text-zinc-500'}`}>
            ⚙️ Specs {scores.expert?.toFixed(1) || '0.0'}
          </span>
          <span className={`font-semibold ${scores.lifestyle > scores.expert ? 'text-amber-700 font-bold' : 'text-zinc-500'}`}>
            {scores.lifestyle?.toFixed(1) || '0.0'} Design ✨
          </span>
        </div>

        {/* Jauge bicolore élégante */}
        <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${totalScore > 0 ? expertPct : 50}%` }}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${totalScore > 0 ? lifestylePct : 50}%` }}
          />
        </div>

        <div className="text-[10px] text-zinc-400 text-center truncate pt-0.5 font-sans">
          {hoveredProfile === 'expert' && '🎯 Curseur sur : Spécifications techniques (x3.5)'}
          {hoveredProfile === 'lifestyle' && '🎯 Curseur sur : Photos & Finitions (x3.5)'}
          {!hoveredProfile && (activeProfileInView ? `👁️ Dans l'écran : ${activeProfileInView === 'expert' ? 'Specs' : 'Photos'}` : 'Survolez ou scrollez pour orienter l\'IA')}
        </div>
      </div>

      {/* 3. Assentiment Explicite Switch */}
      <div className="flex items-center justify-between py-0.5">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-zinc-800 font-sans">Assentiment explicite</span>
          <span className="text-[10px] text-zinc-400 font-sans">
            {requireAssent ? 'Proposer le choix (Nudge)' : 'Morphing direct (Brutal)'}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleRequireAssent}
          className={`h-5 w-9 rounded-full transition-colors relative cursor-pointer ${
            requireAssent ? 'bg-emerald-600' : 'bg-zinc-300'
          }`}
        >
          <span
            className={`h-4 w-4 rounded-full bg-white transition-transform block shadow-xs absolute top-0.5 ${
              requireAssent ? 'translate-x-4 left-0.5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* 4. Statut WebLLM compact */}
      <div className="flex items-center justify-between text-[11px] border-t border-zinc-100 pt-2 font-sans">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-xs">🧠</span>
          <span className="text-zinc-600 truncate text-[11px]">
            {engineStatus === 'ready'
              ? (arbitrationLatency ? `Inférence : ${arbitrationLatency}ms` : 'WebGPU Prêt (SmolLM2)')
              : (engineStatus === 'downloading' || engineStatus === 'checking')
              ? `${Math.round(engineProgress * 100)}% (${engineProgressText || 'Téléch.'})`
              : 'WebLLM non chargé'}
          </span>
        </div>

        {engineStatus === 'idle' && (
          <button
            type="button"
            onClick={() => onLoadEngine()}
            className="rounded-lg bg-zinc-900 text-white px-2.5 py-1 text-[10px] font-semibold hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            Charger
          </button>
        )}

        {engineStatus === 'ready' && (
          <button
            type="button"
            disabled={isArbitrating}
            onClick={() => onTriggerWebLLM()}
            className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-[10px] font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
          >
            {isArbitrating ? '...' : 'Arbitrer'}
          </button>
        )}
      </div>

      {/* 5. Déclencheurs de test UX (Le "Voulez-vous charger...") */}
      <div className="border-t border-zinc-100 pt-2 flex flex-col gap-1.5 font-sans">
        <div className="text-[10px] text-zinc-400 font-medium">Tester la proposition (Nudge) :</div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onSimulateProfile ? onSimulateProfile('expert') : onForceIntent('expert')}
            className="rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-2 py-1.5 text-[10px] font-bold transition-colors cursor-pointer text-center truncate"
          >
            ⚙️ Vue Atelier
          </button>
          <button
            type="button"
            onClick={() => onSimulateProfile ? onSimulateProfile('lifestyle') : onForceIntent('lifestyle')}
            className="rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 px-2 py-1.5 text-[10px] font-bold transition-colors cursor-pointer text-center truncate"
          >
            ✨ Vue Cuivre
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-2 py-1 text-[10px] font-medium transition-colors cursor-pointer text-center w-full mt-0.5"
        >
          🔄 Réinitialiser l'analyse (6s)
        </button>
      </div>
    </div>
  )
}
