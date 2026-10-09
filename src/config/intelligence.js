/**
 * INTELLIGENCE_TIERS
 * Définit les trois niveaux d'intelligence disponibles dans la démo.
 * Le ModeSwitcher laisse l'utilisateur basculer entre eux.
 */
export const AVAILABLE_LOCAL_MODELS = [
  {
    id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
    name: 'SmolLM2 360M (Recommandé)',
    description: 'Poids ~190 Mo · Démarre en quelques secondes sur WebGPU',
    vram: '376 Mo',
  },
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 1B',
    description: 'Poids ~600 Mo · Excellent compromis vitesse/précision',
    vram: '880 Mo',
  },
  {
    id: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
    name: 'Phi-3.5 Mini 3.8B',
    description: 'Poids ~2.2 Go · Modèle de référence de l\'article',
    vram: '2.5 Go',
  },
]

export const DEFAULT_LOCAL_MODEL = 'SmolLM2-360M-Instruct-q4f16_1-MLC'

export const INTELLIGENCE_TIERS = {
  LOCAL: {
    id: 'LOCAL',
    label: '🔒 Local',
    description: 'WebLLM (WebGPU) — dans votre navigateur. Aucune donnée envoyée.',
    // Modèles utilisés selon la tâche
    intentModel: DEFAULT_LOCAL_MODEL,
    formModel: DEFAULT_LOCAL_MODEL,
    privacy: 'total',
    requiresApiKey: false,
  },
  HYBRID: {
    id: 'HYBRID',
    label: '⚡ Hybride',
    description: 'Local pour les données sensibles. OpenRouter (Claude/Gemini) pour le contexte long.',
    intentModel: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
    formModel: 'anthropic/claude-3-5-haiku', // via OpenRouter
    privacy: 'partial',
    requiresApiKey: true,
  },
  VISION: {
    id: 'VISION',
    label: '✨ Vision',
    description: 'Simulé. Illustre ce que permettrait un modèle machine-native (Jev / System One).',
    intentModel: null,
    formModel: null,
    privacy: 'simulated',
    requiresApiKey: false,
  },
}

// Seuil heuristique : delta de score au-dessus duquel on ne consulte pas le modèle
export const INTENT_SCORE_THRESHOLD = 1.5

// Intervalle (ms) entre deux envois de scores au modèle (debounce)
export const INTENT_DEBOUNCE_MS = 2000

// Schéma JSON pour FunctionGemma (Auto-Hydrating Form)
export const SHIPPING_FORM_TOOL = {
  name: 'fill_shipping_form',
  description: 'Extraire les informations de livraison depuis un texte brut (signature email, carte de visite, facture).',
  parameters: {
    type: 'object',
    properties: {
      prenom:          { type: 'string', description: 'Prénom' },
      nom:             { type: 'string', description: 'Nom de famille' },
      entreprise:      { type: 'string', description: 'Nom de l\'entreprise (si présent)' },
      adresse_ligne1:  { type: 'string', description: 'Numéro et nom de rue' },
      adresse_ligne2:  { type: 'string', description: 'Bâtiment, appartement, étage (si présent)' },
      code_postal:     { type: 'string', description: 'Code postal' },
      ville:           { type: 'string', description: 'Ville' },
      pays:            { type: 'string', description: 'Pays', default: 'Canada' },
      _confidence: {
        type: 'object',
        description: 'Niveau de certitude par champ ambigu',
        properties: {
          adresse_ligne1: { type: 'string', enum: ['high', 'medium', 'low'] },
          adresse_ligne2: { type: 'string', enum: ['high', 'medium', 'low'] },
          code_postal:    { type: 'string', enum: ['high', 'medium', 'low'] },
          ville:          { type: 'string', enum: ['high', 'medium', 'low'] },
        },
      },
    },
    required: ['prenom', 'nom'],
  },
}
