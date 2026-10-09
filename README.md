# invisible-ui-demo

> PoC associé à l'article **"Chatbots are lazy design : Ce que les SLMs locaux, WebLLM et WebMCP changent à l'interface web"** par [Quentin Merle](https://dev.to/quentin_merle) / [Vibrisse Studio](https://vibrisse-studio.dev) (Beauce, Québec).
>
> 🚀 **Démo en ligne :** [https://invisible-ui-demo.vercel.app](https://invisible-ui-demo.vercel.app)

![Invisible UI Architecture Blueprint](public/cover.jpg)

Un SLM qui tourne directement dans votre navigateur via **WebGPU** observe vos micro-comportements (dwell time, survol du curseur, surlignage de texte) et adapte l'interface sans chatbot, sans serveur, et dans le respect total de votre vie privée.

---

## Démos interactives

| Route | Démo | Modèle par défaut | Pattern UX |
|---|---|---|---|
| `/` | **LiquidStore** — Page produit polymorphe | `SmolLM2-360M` via WebLLM | **Assentiment explicite** (Nudge toast poli, zéro saut d'écran involontaire) |
| `/checkout` | **Auto-Hydrating Form** — Formulaire auto-rempli | `SmolLM2-360M` via WebLLM | **Extraction JSON stricte** avec indices de confiance colorés |

---

## Démarrage rapide

```bash
# 1. Cloner et installer les dépendances
git clone https://github.com/QuentinMerle/invisible-ui-demo
cd invisible-ui-demo
npm install

# 2. Lancer le serveur de développement Vite
npm run dev

# 3. Ouvrir dans un navigateur compatible WebGPU (Chrome 113+, Edge, Brave)
# http://localhost:5173/
```

> **Note sur le premier chargement :** Le modèle par défaut (`SmolLM2-360M`, ~190 Mo de poids) est téléchargé et mis en cache dans IndexedDB. Les visites suivantes sont instantanées.

---

## Architecture & Code

```
invisible-ui-demo/
├── llms.txt                     # Index standardisé pour LLMs et agents autonomes
├── AGENTS.md                    # Guide technique approfondi pour développeurs et agents IA
├── src/
│   ├── config/
│   │   ├── intelligence.js      # Tiers (LOCAL / HYBRID / VISION) & schémas JSON
│   │   └── IntelligenceContext.jsx # Contexte React partagé
│   ├── lib/
│   │   └── useWebLLMEngine.js   # Singleton WebLLM chargé à la demande (Dynamic Import)
│   ├── hooks/
│   │   └── useImplicitIntent.js # IntersectionObserver + Pointer + Ticker 400ms + Assentiment
│   ├── components/
│   │   ├── ModeSwitcher.jsx     # Toggle 🔒 Local / ⚡ Hybride / ✨ Vision
│   │   ├── IntelligenceBanner.jsx # Bandeau dynamique d'architecture
│   │   ├── LiquidStore/         # Démo 1 : Fiche produit polymorphe + Nudge + Panel
│   │   └── CheckoutForm/        # Démo 2 : Formulaire de livraison hydraté par SLM
│   └── App.jsx                  # Routing React & Layout global
```

---

## Optimisations clés de la codebase

1. **Bundle initial ultra-léger (~200 kB) :** `@mlc-ai/web-llm` n'est pas chargé au démarrage. Il est importé dynamiquement via `await import('@mlc-ai/web-llm')` uniquement lorsque l'utilisateur déclenche le modèle local.
2. **Scoring haute performance sans saccade :** Le suivi de curseur et le dwell time utilisent des `useRef` avec un ticker échantillonné à 400ms, évitant tout re-render intempestif.
3. **Le pattern "Sommelier" (Assentiment explicite) :** L'UI ne se réorganise pas violemment sous les yeux de l'internaute. L'IA diagnostique l'intention et propose une transition douce via un toast interactif.

---

## Pour aller plus loin

- Consultez [`llms.txt`](llms.txt) pour une vue synthétique exploitable par vos outils IA.
- Consultez [`AGENTS.md`](AGENTS.md) pour les règles de contribution, le cycle de vie WebLLM et les pistes d'extension (WebMCP `navigator.modelContext`, parsing de PDF, etc.).

---

*🍁 Fièrement développé depuis la Beauce (Québec) par Vibrisse Studio Inc.*
