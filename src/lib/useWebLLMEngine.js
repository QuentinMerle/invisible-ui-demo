/**
 * useWebLLMEngine
 *
 * Singleton WebLLM : charge le modèle local (@mlc-ai/web-llm) dans le navigateur via WebGPU.
 * Expose l'instance MLCEngine, la progression de téléchargement/compilation,
 * et les helpers (arbitrage d'intention, extraction JSON pour formulaire de commande).
 */
import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_LOCAL_MODEL } from '../config/intelligence.js'

// État global partagé (module-level singleton)
let engineInstance = null
let currentModelId = null
let engineState = {
  status: 'idle', // 'idle' | 'checking' | 'downloading' | 'ready' | 'error' | 'unsupported'
  progress: 0,
  progressText: '',
  error: null,
  modelId: DEFAULT_LOCAL_MODEL,
}

let listeners = []

function notify() {
  listeners.forEach(fn => fn({ ...engineState }))
}

export function useWebLLMEngine(initialModelId) {
  const targetModel = initialModelId || engineState.modelId || DEFAULT_LOCAL_MODEL
  const [state, setState] = useState({ ...engineState })

  useEffect(() => {
    const handler = (s) => setState(s)
    listeners.push(handler)
    return () => {
      listeners = listeners.filter(l => l !== handler)
    }
  }, [])

  const loadEngine = useCallback(async (modelToLoad = targetModel) => {
    if (engineInstance && currentModelId === modelToLoad && engineState.status === 'ready') {
      return engineInstance
    }

    if (engineState.status === 'downloading' || engineState.status === 'checking') {
      return
    }

    // Vérification de compatibilité WebGPU
    if (typeof navigator === 'undefined' || !navigator.gpu) {
      engineState = {
        ...engineState,
        status: 'unsupported',
        error: "WebGPU n'est pas disponible dans ce navigateur. Utilisez Chrome ou Edge récent.",
      }
      notify()
      return null
    }

    engineState = {
      ...engineState,
      status: 'checking',
      progress: 0.05,
      progressText: 'Initialisation du moteur WebGPU...',
      error: null,
      modelId: modelToLoad,
    }
    notify()

    try {
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm')

      engineState = {
        ...engineState,
        status: 'downloading',
        progress: 0.1,
        progressText: 'Connexion au cache et téléchargement des poids...',
      }
      notify()

      const engine = await CreateMLCEngine(modelToLoad, {
        initProgressCallback: (report) => {
          engineState = {
            ...engineState,
            status: 'downloading',
            progress: report.progress,
            progressText: report.text,
          }
          notify()
        },
      })

      engineInstance = engine
      currentModelId = modelToLoad
      engineState = {
        ...engineState,
        status: 'ready',
        progress: 1.0,
        progressText: 'Modèle actif en mémoire WebGPU',
        error: null,
      }
      notify()
      return engine
    } catch (err) {
      console.error('[WebLLM] Échec du chargement :', err)
      engineState = {
        ...engineState,
        status: 'error',
        error: err.message || 'Erreur lors du chargement du modèle WebLLM',
        progressText: 'Erreur WebLLM',
      }
      notify()
      return null
    }
  }, [targetModel])

  /**
   * Arbitrage d'intention UX par le modèle local
   */
  const arbitrateIntent = useCallback(async (scores) => {
    if (!engineInstance || engineState.status !== 'ready') {
      throw new Error('Moteur WebLLM non initialisé ou non prêt')
    }

    if (scores.expert < 0.2 && scores.lifestyle < 0.2) {
      return { winner: 'general', raw: 'general', latencyMs: 0 }
    }

    const start = performance.now()
    const prompt = `Tu es un arbitre d'intention UX pour une boutique e-commerce de machines à café haut de gamme.
Voici les scores comportementaux observés :
- Specs techniques & bars de pression (Expert) : ${scores.expert.toFixed(2)}
- Design, finitions & silence acoustique (Lifestyle) : ${scores.lifestyle.toFixed(2)}

L'utilisateur a exploré la page. Tu dois trancher en faveur de sa tendance dominante.
Réponds STRICTEMENT par l'un de ces deux mots en minuscules : "expert" ou "lifestyle".`

    const response = await engineInstance.chat.completions.create({
      messages: [
        { role: 'system', content: 'Tu es un classificateur binaire strict. Tu réponds uniquement par "expert" ou "lifestyle".' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 10,
    })

    const latencyMs = Math.round(performance.now() - start)
    const raw = response.choices?.[0]?.message?.content?.trim().toLowerCase() || ''

    let winner = scores.expert >= scores.lifestyle ? 'expert' : 'lifestyle'
    if (raw.includes('expert')) winner = 'expert'
    else if (raw.includes('lifestyle')) winner = 'lifestyle'

    return { winner, raw, latencyMs }
  }, [])

  /**
   * Extraction des données de livraison depuis du texte brut
   */
  const extractShippingData = useCallback(async (rawText) => {
    if (!engineInstance || engineState.status !== 'ready') {
      throw new Error('Moteur WebLLM non initialisé ou non prêt')
    }

    const start = performance.now()
    const prompt = `Analyse ce texte brut (signature email, facture, contact) et extrait les champs de livraison sous forme de JSON strict.

Champs attendus :
- "prenom": string
- "nom": string
- "entreprise": string (vide si absent)
- "adresse_ligne1": string (numéro et rue)
- "adresse_ligne2": string (complément: bâtiment, bureau, étage, ou vide)
- "code_postal": string
- "ville": string
- "pays": string (ex: "Canada" ou "France")
- "_confidence": {"adresse_ligne1": "high"|"medium"|"low", "code_postal": "high"|"medium"|"low"}

Texte à analyser :
"""
${rawText}
"""

Réponds STRICTEMENT avec l'objet JSON valide, sans texte d'introduction ni balises Markdown.`

    const response = await engineInstance.chat.completions.create({
      messages: [
        { role: 'system', content: 'Tu es un extracteur JSON strict. Aucun bavardage, que du JSON valide.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 450,
    })

    const latencyMs = Math.round(performance.now() - start)
    const content = response.choices?.[0]?.message?.content?.trim() || '{}'
    const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Réponse JSON non analysable')
      }
    }

    return { data: parsed, latencyMs }
  }, [])

  return {
    engine: engineInstance,
    status: state.status,
    progress: state.progress,
    progressText: state.progressText,
    error: state.error,
    modelId: state.modelId,
    loadEngine,
    arbitrateIntent,
    extractShippingData,
  }
}
