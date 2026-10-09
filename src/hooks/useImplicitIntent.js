/**
 * useImplicitIntent
 *
 * Observe le comportement de l'utilisateur sur la page via IntersectionObserver
 * et retourne une intention déduite : 'expert' | 'lifestyle' | 'general'
 *
 * Pattern :
 *  1. Scoring JS pur (instantané, 0 latence)
 *  2. Si signal ambigu → arbitrage par le modèle local (WebLLM)
 *
 * Usage :
 *  const { intent, scores } = useImplicitIntent()
 *  // Attacher data-profile="expert" ou data-profile="lifestyle" aux sections DOM
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useWebLLMEngine } from '../lib/useWebLLMEngine.js'
import { INTENT_SCORE_THRESHOLD, INTENT_DEBOUNCE_MS } from '../config/intelligence.js'

const OBSERVATION_WINDOW_SECONDS = 6.0 // Durée de la fenêtre d'analyse active
const EARLY_LOCK_THRESHOLD = 2.8 // Seuil de certitude écrasante pour verrouillage anticipé

export function useImplicitIntent() {
  const [intent, setIntent] = useState('general')
  const [scores, setScores] = useState({ expert: 0, lifestyle: 0 })
  const [activeProfileInView, setActiveProfileInView] = useState(null)
  const [hoveredProfile, setHoveredProfile] = useState(null)
  const [isLocked, setIsLocked] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Mode "Assentiment explicite" : si true, l'IA suggère au lieu de muter unilatéralement
  const [requireAssent, setRequireAssent] = useState(true)
  const [suggestedProfile, setSuggestedProfile] = useState(null)
  const [arbitrationSource, setArbitrationSource] = useState('heuristic')
  const [arbitrationLatency, setArbitrationLatency] = useState(null)
  const [isArbitrating, setIsArbitrating] = useState(false)

  const {
    engine,
    status: engineStatus,
    progress: engineProgress,
    progressText: engineProgressText,
    modelId: engineModelId,
    loadEngine,
    arbitrateIntent,
  } = useWebLLMEngine()

  const debounceRef = useRef(null)
  const scoresRef = useRef({ expert: 0, lifestyle: 0 })
  const visibleElementsRef = useRef(new Map())
  const hoveredProfileRef = useRef(null)
  const lastActivityTimeRef = useRef(Date.now())
  const isLockedRef = useRef(false)
  const elapsedRef = useRef(0)
  const requireAssentRef = useRef(true)

  useEffect(() => {
    requireAssentRef.current = requireAssent
  }, [requireAssent])

  // Détection d'inactivité : si pas de mouvement depuis > 10s, on arrête l'accumulation
  const isUserActive = useCallback(() => {
    return !document.hidden && (Date.now() - lastActivityTimeRef.current < 10000)
  }, [])

  const commitLockIn = useCallback(async (finalScores) => {
    isLockedRef.current = true
    setIsLocked(true)

    const { expert, lifestyle } = finalScores
    const delta = expert - lifestyle

    let winner = expert >= lifestyle ? 'expert' : 'lifestyle'
    if (expert < 0.2 && lifestyle < 0.2) {
      winner = 'general'
    }

    // Si WebLLM est actif et le signal mérite arbitrage, on délègue au modèle local
    if (engineStatus === 'ready' && Math.abs(delta) < 1.0 && (expert > 0.2 || lifestyle > 0.2)) {
      setIsArbitrating(true)
      try {
        const res = await arbitrateIntent(finalScores)
        setArbitrationSource('webllm')
        setArbitrationLatency(res.latencyMs)
        winner = res.winner || winner
      } catch (err) {
        console.warn('[useImplicitIntent] Échec arbitrage WebLLM, repli heuristique :', err)
        setArbitrationSource('heuristic')
        setArbitrationLatency(0)
      } finally {
        setIsArbitrating(false)
      }
    } else {
      setArbitrationSource('heuristic')
      setArbitrationLatency(0)
    }

    if (requireAssentRef.current) {
      // PATTERN ASSENTIMENT EXPLICITE :
      // On ne touche pas à l'écran ! On prépare la suggestion pour l'utilisateur
      if (winner !== 'general') {
        setSuggestedProfile(winner)
      } else {
        setIntent('general')
      }
    } else {
      // PATTERN MORPHING DIRECT (Brutal)
      setIntent(winner)
    }
  }, [engineStatus, arbitrateIntent])

  const triggerWebLLMArbitration = useCallback(async () => {
    let currentEng = engine
    if (engineStatus !== 'ready') {
      currentEng = await loadEngine()
      if (!currentEng) return
    }

    setIsArbitrating(true)
    try {
      let s = scoresRef.current
      if (s.expert < 0.2 && s.lifestyle < 0.2) {
        s = { expert: 2.8, lifestyle: 2.1 }
        scoresRef.current = s
        setScores({ ...s })
      }

      const res = await arbitrateIntent(s)
      setArbitrationSource('webllm')
      setArbitrationLatency(res.latencyMs)
      const winner = res.winner || (s.expert >= s.lifestyle ? 'expert' : 'lifestyle')

      isLockedRef.current = true
      setIsLocked(true)

      if (requireAssentRef.current) {
        setSuggestedProfile(winner)
      } else {
        setIntent(winner)
      }
    } catch (err) {
      console.warn('[useImplicitIntent] Erreur arbitrage direct WebLLM :', err)
    } finally {
      setIsArbitrating(false)
    }
  }, [engine, engineStatus, loadEngine, arbitrateIntent])

  const simulateProfile = useCallback((profile) => {
    isLockedRef.current = true
    setIsLocked(true)
    if (profile === 'expert') {
      scoresRef.current = { expert: 3.2, lifestyle: 0.6 }
    } else if (profile === 'lifestyle') {
      scoresRef.current = { expert: 0.5, lifestyle: 3.4 }
    } else {
      scoresRef.current = { expert: 0, lifestyle: 0 }
    }
    setScores({ ...scoresRef.current })

    if (requireAssentRef.current) {
      setSuggestedProfile(profile)
    } else {
      setIntent(profile)
    }
  }, [])

  const acceptSuggestion = useCallback(() => {
    if (suggestedProfile) {
      setIntent(suggestedProfile)
      setSuggestedProfile(null)
    }
  }, [suggestedProfile])

  const dismissSuggestion = useCallback(() => {
    setSuggestedProfile(null)
  }, [])

  const evaluateIntent = useCallback((currentScores) => {
    if (isLockedRef.current) return

    const { expert, lifestyle } = currentScores
    const delta = expert - lifestyle

    // Verrouillage anticipé si signal écrasant (>= 2.8)
    if (Math.abs(delta) >= EARLY_LOCK_THRESHOLD) {
      commitLockIn(currentScores)
      return
    }

    // En mode direct sans assentiment, mise à jour dynamique
    if (!requireAssentRef.current) {
      if (delta > INTENT_SCORE_THRESHOLD) {
        setIntent('expert')
        return
      }
      if (delta < -INTENT_SCORE_THRESHOLD) {
        setIntent('lifestyle')
        return
      }
      if (expert + lifestyle < 0.4) {
        setIntent('general')
      }
    }
  }, [commitLockIn])

  const resetScores = useCallback(() => {
    isLockedRef.current = false
    setIsLocked(false)
    setSuggestedProfile(null)
    elapsedRef.current = 0
    setElapsedSeconds(0)
    scoresRef.current = { expert: 0, lifestyle: 0 }
    setScores({ expert: 0, lifestyle: 0 })
    setIntent('general')
  }, [])

  const forceIntent = useCallback((newIntent) => {
    isLockedRef.current = true
    setIsLocked(true)
    setSuggestedProfile(null)
    setIntent(newIntent)
    if (newIntent === 'expert') {
      scoresRef.current = { expert: 3.5, lifestyle: 0 }
    } else if (newIntent === 'lifestyle') {
      scoresRef.current = { expert: 0, lifestyle: 3.5 }
    } else {
      scoresRef.current = { expert: 0, lifestyle: 0 }
    }
    setScores({ ...scoresRef.current })
  }, [])

  useEffect(() => {
    const onUserAction = () => { lastActivityTimeRef.current = Date.now() }
    
    // TRACKING MICRO : Position du curseur (Hover / Gaze proxy)
    const onPointerOver = (e) => {
      lastActivityTimeRef.current = Date.now()
      const profileElement = e.target.closest('[data-profile]')
      const profile = profileElement?.dataset?.profile
      if (profile && profile !== 'general') {
        hoveredProfileRef.current = profile
        setHoveredProfile(profile)
      } else {
        hoveredProfileRef.current = null
        setHoveredProfile(null)
      }
    }

    // TRACKING MICRO : Surlignage de texte (Intérêt analytique explicite)
    const onSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) return
      const anchorNode = selection.anchorNode
      const element = anchorNode?.nodeType === Node.ELEMENT_NODE ? anchorNode : anchorNode?.parentElement
      const profileElement = element?.closest('[data-profile]')
      const profile = profileElement?.dataset?.profile
      if (profile && profile !== 'general') {
        // Boost direct immédiat pour avoir surligné un texte
        scoresRef.current[profile] = (scoresRef.current[profile] || 0) + 1.2
        setScores({ ...scoresRef.current })
        evaluateIntent(scoresRef.current)
      }
    }

    window.addEventListener('mousemove', onUserAction)
    window.addEventListener('scroll', onUserAction)
    window.addEventListener('click', onUserAction)
    window.addEventListener('pointerover', onPointerOver)
    document.addEventListener('selectionchange', onSelectionChange)
    document.addEventListener('visibilitychange', onUserAction)

    // TRACKING MACRO : IntersectionObserver (Viewport presence)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const profile = entry.target.dataset.profile
        if (!profile || profile === 'general') return

        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          visibleElementsRef.current.set(entry.target, {
            profile,
            ratio: entry.intersectionRatio,
          })
        } else {
          visibleElementsRef.current.delete(entry.target)
        }
      })

      // Profil le plus visible à l'écran
      let highestRatio = 0
      let topProfile = null
      visibleElementsRef.current.forEach(({ profile, ratio }) => {
        if (ratio > highestRatio) {
          highestRatio = ratio
          topProfile = profile
        }
      })
      setActiveProfileInView(topProfile)
    }, {
      threshold: [0.1, 0.25, 0.5, 0.75, 1.0],
    })

    const attachObserver = () => {
      document.querySelectorAll('[data-profile]').forEach(el => observer.observe(el))
    }
    attachObserver()

    // TICKER FUSIONNÉ (MACRO SCROLL + MICRO CURSEUR + FENÊTRE DE VERROUILLAGE) :
    // Analyse pendant OBSERVATION_WINDOW_SECONDS (6s), puis verrouille la décision.
    const interval = setInterval(() => {
      if (isLockedRef.current || !isUserActive()) return

      // PAUSE si le moteur WebLLM est en cours de chargement/téléchargement
      if (engineStatus === 'checking' || engineStatus === 'downloading') return

      let hasChanged = false

      // 1. Poids Macro : Ce qui est affiché à l'écran (fond passif)
      visibleElementsRef.current.forEach(({ profile, ratio }) => {
        const macroWeight = ratio * 0.35
        scoresRef.current[profile] = (scoresRef.current[profile] || 0) + macroWeight
        hasChanged = true
      })

      // 2. Poids Micro : Là où le curseur se trouve réellement (attention active)
      if (hoveredProfileRef.current) {
        const microWeight = 0.95 // Impact décisif de l'attention du curseur
        scoresRef.current[hoveredProfileRef.current] =
          (scoresRef.current[hoveredProfileRef.current] || 0) + microWeight
        hasChanged = true
      }

      if (hasChanged) {
        setScores({ ...scoresRef.current })
      }

      // Progression du chronomètre d'observation :
      // On ne compte que si l'utilisateur a commencé à explorer (score total >= 0.25 ou survol)
      const totalScore = scoresRef.current.expert + scoresRef.current.lifestyle
      if (totalScore >= 0.25 || hoveredProfileRef.current) {
        elapsedRef.current += 0.4
        const currentElapsed = Math.min(OBSERVATION_WINDOW_SECONDS, elapsedRef.current)
        setElapsedSeconds(Number(currentElapsed.toFixed(1)))

        // Fin de la fenêtre d'observation : on tranche et on propose/verrouille
        if (elapsedRef.current >= OBSERVATION_WINDOW_SECONDS) {
          commitLockIn(scoresRef.current)
          return
        }

        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          evaluateIntent(scoresRef.current)
        }, 400)
      }
    }, 400)

    return () => {
      observer.disconnect()
      clearInterval(interval)
      clearTimeout(debounceRef.current)
      window.removeEventListener('mousemove', onUserAction)
      window.removeEventListener('scroll', onUserAction)
      window.removeEventListener('click', onUserAction)
      window.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('selectionchange', onSelectionChange)
      document.removeEventListener('visibilitychange', onUserAction)
    }
  }, [evaluateIntent, isUserActive, commitLockIn, engineStatus])

  return {
    intent,
    scores,
    activeProfileInView,
    hoveredProfile,
    isLocked,
    elapsedSeconds,
    totalWindowSeconds: OBSERVATION_WINDOW_SECONDS,
    suggestedProfile,
    acceptSuggestion,
    dismissSuggestion,
    requireAssent,
    setRequireAssent,
    resetScores,
    forceIntent,
    simulateProfile,
    // WebLLM Local Intelligence
    engineStatus,
    engineProgress,
    engineProgressText,
    engineModelId,
    loadEngine,
    triggerWebLLMArbitration,
    arbitrationSource,
    arbitrationLatency,
    isArbitrating,
  }
}
