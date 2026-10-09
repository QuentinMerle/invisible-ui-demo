# invisible-ui-demo

> Exploratory PoC accompanying the article **["Chatbots are lazy design: What In-Browser SLMs, WebLLM, and WebMCP Mean for the Modern Web Interface"](https://www.vibrisse-studio.dev/articles/chatbots-are-lazy-design)** by [Quentin Merle](https://github.com/QuentinMerle) / [Vibrisse Studio](https://www.vibrisse-studio.dev) (Beauce, Quebec).
>
> 🚀 **Live Demo:** [https://invisible-ui-demo.vercel.app](https://invisible-ui-demo.vercel.app)

![Invisible UI Architecture Blueprint](public/cover.jpg)

An in-browser Small Language Model (SLM) executing on-device via **WebGPU** observes user micro-behavior (dwell time, cursor trajectories, text selections) and dynamically adapts the interface—without intrusive chatbots, without backend servers, and with absolute client-side data privacy.

---

## Interactive Demos

| Route | Demo | Default Model | UX Pattern |
|---|---|---|---|
| `/` | **LiquidStore** — Polymorphic Product Page | `SmolLM2-360M` via WebLLM | **Explicit Assent** (Polite toast suggestion, zero abrupt layout shift) |
| `/checkout` | **Auto-Hydrating Form** — Self-Populating Form | `SmolLM2-360M` via WebLLM | **Strict JSON Extraction** with self-reported confidence indicators |

---

## Quick Start

```bash
# 1. Clone the repository and install dependencies
git clone https://github.com/QuentinMerle/invisible-ui-demo
cd invisible-ui-demo
npm install

# 2. Start the Vite local development server
npm run dev

# 3. Open in a WebGPU-compatible browser (Chrome 113+, Edge, Brave, or Safari 18+)
# http://localhost:5173/
```

> **Note on First Load:** The default model weights (`SmolLM2-360M`, ~190 MB) are downloaded once and cached locally inside IndexedDB / Cache API. Subsequent visits load instantaneously with zero network overhead.

---

## Architecture & Codebase Overview

```
invisible-ui-demo/
├── llms.txt                     # Standardized index for LLMs and autonomous agents
├── AGENTS.md                    # In-depth architectural playbook for developers & AI agents
├── vercel.json                  # SPA routing and COOP/COEP headers for WebGPU deployment
├── src/
│   ├── config/
│   │   ├── intelligence.js      # Tiers (LOCAL / HYBRID / VISION) & JSON schemas
│   │   └── IntelligenceContext.jsx # Shared React intelligence context
│   ├── lib/
│   │   └── useWebLLMEngine.js   # Module-level WebLLM singleton loaded via dynamic import
│   ├── hooks/
│   │   └── useImplicitIntent.js # Headless telemetry: IntersectionObserver + Pointer + Selection + Assent
│   ├── components/
│   │   ├── ModeSwitcher.jsx     # Toggle 🔒 Local / ⚡ Hybrid / ✨ Vision
│   │   ├── IntelligenceBanner.jsx # Architecture status banner
│   │   ├── LiquidStore/         # Demo 1: Polymorphic product page + Nudge + Debug dock
│   │   └── CheckoutForm/        # Demo 2: Zero-friction shipping checkout form
│   └── App.jsx                  # React Router & global layout
```

---

## Key Engineering Highlights

1. **Ultra-lightweight initial bundle (~210 kB):** `@mlc-ai/web-llm` is never loaded up-front. It is loaded on-demand via `await import('@mlc-ai/web-llm')` only when the user requests local AI processing.
2. **Jank-free, high-performance telemetry:** Cursor tracking and dwell-time calculations use mutable `useRef` accumulators sampled by a 400ms ticker, preventing gratuitous React render thrashing.
3. **The "Sommelier" UX Pattern (Explicit Assent):** The UI never morphs abruptly under the user's gaze (*Uncanny Valley*). The AI diagnoses intent behind the scenes and surfaces a discrete contextual toast, allowing the user to validate the transition.
4. **Zero-knowledge data privacy:** Customer information pasted into the checkout form (names, physical addresses, direct phone numbers) is parsed entirely inside client VRAM via WebGPU and never touches any server.

---

## Further Reading & Resources

- Read the full technical article: [Chatbots are lazy design (Vibrisse Studio)](https://www.vibrisse-studio.dev/articles/chatbots-are-lazy-design)
- Consult [`llms.txt`](llms.txt) for an LLM-digestible architectural summary.
- Consult [`AGENTS.md`](AGENTS.md) for contribution rules, WebLLM lifecycle patterns, and extension points (WebMCP `navigator.modelContext`, PDF ingestion, etc.).

---

*🍁 Proudly engineered from the Beauce region (Quebec) by [Vibrisse Studio Inc.](https://www.vibrisse-studio.dev)*
