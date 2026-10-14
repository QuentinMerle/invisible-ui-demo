/**
 * LiquidStorePage
 *
 * Démo 1 : Page produit polymorphe
 * L'UI s'adapte au profil détecté via useImplicitIntent()
 *
 * Profils :
 *  - 'expert'    → titre technique, specs en avant, avis filtrés
 *  - 'lifestyle' → photos pleine largeur, bénéfices, accent colorimétrique
 *  - 'general'   → affichage par défaut équilibré
 *
 * TODO :
 *  [ ] Brancher useImplicitIntent sur le vrai modèle WebLLM
 *  [ ] Ajouter les vraies images produit
 *  [ ] Implémenter navigator.modelContext (WebMCP) pour l'exposition aux agents
 *  [ ] Ajouter les transitions Tailwind entre les layouts
 */
import { useEffect } from 'react'
import { useImplicitIntent } from '../../hooks/useImplicitIntent.js'
import ProductHero from './ProductHero.jsx'
import ProductSpecs from './ProductSpecs.jsx'
import ProductReviews from './ProductReviews.jsx'
import IntentDebugPanel from './IntentDebugPanel.jsx'
import ExplicitAssentNudge from './ExplicitAssentNudge.jsx'

export default function LiquidStorePage() {
  const {
    intent,
    scores,
    activeProfileInView,
    hoveredProfile,
    isLocked,
    elapsedSeconds,
    totalWindowSeconds,
    suggestedProfile,
    acceptSuggestion,
    dismissSuggestion,
    requireAssent,
    setRequireAssent,
    resetScores,
    forceIntent,
    simulateProfile,
    engineStatus,
    engineProgress,
    engineProgressText,
    engineModelId,
    loadEngine,
    triggerWebLLMArbitration,
    arbitrationSource,
    arbitrationLatency,
    isArbitrating,
  } = useImplicitIntent()

  // Accent colorimétrique dynamique selon le coloris le plus regardé
  // TODO : connecter aux clics sur les color swatches
  useEffect(() => {
    const accentMap = {
      expert:    '#059669', // vert émeraude technique
      lifestyle: '#b87333', // cuivre chaleureux
      general:   '#1a1a1a', // noir neutre
    }
    document.documentElement.style.setProperty('--color-accent', accentMap[intent])
  }, [intent])

  // TODO : implémenter navigator.modelContext pour WebMCP
  useEffect(() => {
    if (!('modelContext' in navigator)) return
    navigator.modelContext.register({
      name: 'switch_product_profile',
      description: 'Changer l\'affichage de la fiche produit selon le profil utilisateur',
      parameters: {
        profile: { type: 'string', enum: ['expert', 'lifestyle', 'general'] },
      },
      handler: ({ profile }) => {
        console.log('[WebMCP] switch_product_profile appelé avec :', profile)
        forceIntent(profile)
        return { success: true, appliedLayout: profile }
      },
    })
  }, [forceIntent])

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Panel de debug flottant (bas à droite) pour observer les scores en temps réel */}
      <IntentDebugPanel
        intent={intent}
        scores={scores}
        activeProfileInView={activeProfileInView}
        hoveredProfile={hoveredProfile}
        isLocked={isLocked}
        elapsedSeconds={elapsedSeconds}
        totalWindowSeconds={totalWindowSeconds}
        requireAssent={requireAssent}
        onToggleRequireAssent={() => setRequireAssent(!requireAssent)}
        onForceIntent={forceIntent}
        onSimulateProfile={simulateProfile}
        onReset={resetScores}
        engineStatus={engineStatus}
        engineProgress={engineProgress}
        engineProgressText={engineProgressText}
        engineModelId={engineModelId}
        onLoadEngine={loadEngine}
        onTriggerWebLLM={triggerWebLLMArbitration}
        arbitrationSource={arbitrationSource}
        arbitrationLatency={arbitrationLatency}
        isArbitrating={isArbitrating}
      />

      {/* Toast d'assentiment explicite : demande l'accord avant de muter */}
      <ExplicitAssentNudge
        suggestedProfile={suggestedProfile}
        onAccept={acceptSuggestion}
        onDismiss={dismissSuggestion}
      />

      <ProductHero intent={intent} onSwatchClick={forceIntent} />

      {/* Ordre des sections change selon le profil */}
      {intent === 'expert' ? (
        <>
          <ProductSpecs intent={intent} />
          <ProductReviews intent={intent} />
        </>
      ) : (
        <>
          <ProductReviews intent={intent} />
          <ProductSpecs intent={intent} />
        </>
      )}
    </div>
  )
}
