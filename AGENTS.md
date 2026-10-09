# AI Agents & Developer Playbook (`AGENTS.md`)

> **Repository:** `invisible-ui-demo`  
> **Author:** Quentin Merle ([Vibrisse Studio Inc.](https://www.vibrisse-studio.dev), Beauce, Québec)  
> **Core Focus:** Client-side Small Language Models (SLMs), WebGPU on-device inference, and Invisible/Zero-Chatbot UI.

---

## 1. Project Philosophy & Core Thesis

1. **"Chatbots are lazy design":** Conversational sidebars interrupt the user's reading flow, force manual prompt engineering, and add unnecessary latency.
2. **Invisible UI:** The browser's client-side runtime observes micro-behaviors (cursor hover, dwell time, reading pauses, text selections) and quietly adapts the experience without roundtrips to OpenAI or Anthropic.
3. **The "Sommelier" UX Pattern:** Never mutate the viewport under the user's eyes without permission (*Uncanny Valley*). An interface should diagnose intent implicitly, but ask for explicit assent via polite toast suggestions before shifting layouts.
4. **Privacy-First:** Zero user data (identities, addresses, reading habits) leaves the client machine. Everything runs directly on the user's hardware via WebGPU.

---

## 2. Technical Stack & Key Constraints

- **Framework:** React 18 (`src/main.jsx`, `src/App.jsx`), Vite 5, TailwindCSS 3.
- **Client AI Engine:** `@mlc-ai/web-llm` running via WebGPU.
- **Default SLM:** `SmolLM2-360M-Instruct-q4f16_1-MLC` (~190 MB weights downloaded to IndexedDB cache; consumes ~376 MB VRAM).
- **Alternative SLMs:** `Llama-3.2-1B-Instruct-q4f16_1-MLC` (~600 MB) or `Phi-3.5-mini-instruct-q4f16_1-MLC` (~2.2 GB).
- **Bundle Optimization:** `@mlc-ai/web-llm` is **dynamically imported** inside `loadEngine()` in `src/lib/useWebLLMEngine.js`. The initial application bundle remains under **210 kB** (66 kB gzip). Never import `@mlc-ai/web-llm` statically at top-level.

---

## 3. Architecture & Data Flow

### A. Implicit Intent Engine (`src/hooks/useImplicitIntent.js`)

```
[DOM: data-profile="expert|lifestyle"]
   │
   ├─► Macro Signal: IntersectionObserver (presence in viewport, weight: 0.35)
   ├─► Micro Signal: pointerover (cursor dwell over specific spec, weight: 0.95)
   └─► High-Intent Signal: selectionchange (user highlights text, boost: +1.2)
   │
   ▼
[Ref-based Accumulator: scoresRef (zero render thrash)]
   │
   ▼ (every 400ms tick, paused during SLM download)
[Observation Window: 6.0 seconds]
   │
   ▼ (at 6.0s lock-in)
[Arbitration: Heuristic fast-path OR local SmolLM2 WebGPU inference]
   │
   ▼
[ExplicitAssentNudge: Polite Toast ("Voulez-vous charger la vue Expert ?")]
   │
   ├─► User clicks "Oui"  ──► Profile commits, DOM updates smoothly
   └─► User clicks "Non"  ──► Standard view preserved, zero layout shift
```

### B. Auto-Hydrating Form Engine (`src/components/CheckoutForm/CheckoutPage.jsx`)

```
[User pastes unstructured raw text: email signature, invoice header, note]
   │
   ▼
[Local WebLLM: extractShippingData()]
   │
   ▼ (Single prompt instructing strict JSON schema + field-level confidence)
[Strict JSON payload with _confidence: { adresse_ligne1: "high", code_postal: "medium" }]
   │
   ▼
```

### C. Cloud / API Alternative & FinOps Guidelines

If porting or integrating this engine into non-WebGPU environments:
- **Banned Anti-pattern:** Calling frontier models (GPT-4o, Claude 3.5 Sonnet, GPT-6). These cost \$2.50-\$15/1M tokens, add 800-2500ms of latency, and represent an economic disaster for high-traffic e-commerce.
- **Recommended Cloud Pattern:** Use an Edge Worker (Cloudflare Worker or Vercel Edge) proxying to a fast sub-1B or 8B model via structured outputs:
  - `gemini-2.0-flash-lite` (~$0.075 / 1M tokens, ~100ms TTFT)
  - `claude-3-5-haiku` (~$0.80 / 1M tokens)
  - `llama-3.1-8b-instant` on Groq / Cerebras (<80ms, fractions of a cent)
- Local WebGPU remains the gold standard for zero recurring hosting cost and total GDPR compliance.

---

## 4. Key Files Directory

| Path | Purpose |
|---|---|
| `src/lib/useWebLLMEngine.js` | Module-level singleton managing WebLLM lifecycle, WebGPU capabilities, model downloads, and inference routines (`arbitrateIntent`, `extractShippingData`). |
| `src/hooks/useImplicitIntent.js` | Headless interaction engine combining DOM observers, cursor tracking, debouncing, and state machine transitions. |
| `src/components/LiquidStore/LiquidStorePage.jsx` | Polymorphic e-commerce product page (Démo 1). |
| `src/components/LiquidStore/ExplicitAssentNudge.jsx` | Floating assent toast for graceful layout transitions. |
| `src/components/LiquidStore/IntentDebugPanel.jsx` | Developer instrumentation panel (bipolar attention gauge, timer, WebGPU status, simulation buttons). |
| `src/components/CheckoutForm/CheckoutPage.jsx` | Auto-hydrating checkout form page (Démo 2). |
| `src/config/intelligence.js` | Declaration of intelligence tiers (`LOCAL`, `HYBRID`, `VISION`) and JSON extraction schemas. |

---

## 5. Guidelines for AI Agents Modifying This Codebase

When reading or modifying this repository:

1. **Preserve Performance & Memory:**
   - Never register DOM event listeners inside hot render loops. Use `useRef` for tracking and flush to React state via debounced tickers.
   - Always return cleanup functions in `useEffect` for `IntersectionObserver`, `setInterval`, and event listeners.
   - Keep `@mlc-ai/web-llm` in lazy dynamic imports.

2. **Respect the UX Heuristics:**
   - Do NOT remove `requireAssent` or force automatic viewport reshuffling while the user is actively reading. Sudden mutations violate Nielsen's predictability heuristic.
   - Any layout changes should happen via user assent, inter-page navigation, or below the fold.

3. **WebMCP Integration (`navigator.modelContext`):**
   - The codebase has preliminary hooks for Chrome 149's WebMCP origin trial (`navigator.modelContext.register`).
   - If extending WebMCP, expose tool definitions that external browser agents can invoke to query current intent or trigger actions safely.

4. **Testing & Validation:**
   - To verify Vite builds without errors: `npm run build`.
   - Dev server runs on `http://localhost:5173/`.
