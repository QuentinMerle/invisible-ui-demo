import { useState } from 'react'

/**
 * HydratedForm
 * Affiche le formulaire pré-rempli par le modèle local.
 * Les champs à confidence 'low'/'medium' ont une surbrillance dorée.
 * Les champs à confidence 'high' ont un marqueur vert.
 * Intègre un inspecteur développeur (Entrée brute vs JSON extrait).
 */
const FIELDS = [
  { key: 'prenom',         label: 'Prénom',       type: 'text' },
  { key: 'nom',            label: 'Nom',           type: 'text' },
  { key: 'entreprise',     label: 'Entreprise',    type: 'text' },
  { key: 'adresse_ligne1', label: 'Adresse',       type: 'text' },
  { key: 'adresse_ligne2', label: 'Complément',    type: 'text' },
  { key: 'code_postal',    label: 'Code postal',   type: 'text' },
  { key: 'ville',          label: 'Ville',         type: 'text' },
  { key: 'pays',           label: 'Pays',          type: 'text' },
]

function getFieldStyle(confidence) {
  if (!confidence) return 'border-zinc-200 bg-white text-zinc-900 focus:border-zinc-800'
  if (confidence === 'high') return 'border-emerald-300 bg-emerald-50/20 text-zinc-950 focus:border-emerald-500'
  if (confidence === 'medium') return 'border-amber-400 bg-amber-50/30 text-zinc-950 focus:border-amber-500'
  return 'border-rose-300 bg-rose-50/30 text-zinc-950 focus:border-rose-500'
}

function ConfidenceBadge({ confidence }) {
  if (!confidence) return null
  if (confidence === 'high') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
        ✓ Sûr
      </span>
    )
  }
  if (confidence === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded animate-pulse">
        ✨ À vérifier
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
      ⚠ Doute
    </span>
  )
}

export default function HydratedForm({ data, meta = {}, onReset }) {
  const [showInspector, setShowInspector] = useState(false)
  const { _confidence = {}, ...fields } = data

  const uncertainCount = Object.values(_confidence).filter(c => c !== 'high').length
  const isWebLLM = meta?.source === 'webllm'

  return (
    <div className="flex flex-col gap-6">
      {/* Bandeau d'état d'extraction */}
      <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isWebLLM ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
            <p className="font-bold text-sm text-zinc-900 font-mono">
              {isWebLLM
                ? `Extraction locale WebLLM (${meta.latencyMs || '~400'}ms · On-Device GPU)`
                : 'Schéma hydraté par analyse heuristique'}
            </p>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isWebLLM
              ? `Le modèle local a analysé le texte directement sur votre matériel. Zéro octet transmis.`
              : (uncertainCount > 0
                ? `${uncertainCount} champ nécessite une vérification avant validation.`
                : 'Tous les champs sensibles ont été extraits avec un score de certitude maximal.')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowInspector(!showInspector)}
            className="rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>🔍</span>
            <span>{showInspector ? 'Masquer inspecteur' : 'Inspecter payload dev'}</span>
          </button>

          {uncertainCount > 0 && (
            <span className="text-xs font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-xl">
              ✨ {uncertainCount} à confirmer
            </span>
          )}
        </div>
      </div>

      {/* Inspecteur Développeur : Comparatif Entrée Brute vs JSON Extrait */}
      {showInspector && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-200 p-5 shadow-xl font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-base">🧪</span>
              <span className="font-bold text-white text-sm">Inspecteur Développeur · Jugement du traitement IA</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">
                Source : {meta.source === 'webllm' ? 'WebLLM (WebGPU)' : 'Heuristique'}
              </span>
              <span className="rounded bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 font-bold">
                ⚡ {meta.latencyMs || 0} ms
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colonne 1 : Entrée Brute avec bruit */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="font-semibold text-amber-300">1. ENTRÉE BRUTE (UNSTRUCTURED TEXT)</span>
                <span>{meta.rawInput?.length || 0} caractères</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-300 text-[11px] whitespace-pre-wrap font-mono leading-relaxed border border-zinc-800/90 h-64 overflow-y-auto">
                {meta.rawInput || 'Aucun texte brut trouvé'}
              </pre>
              <div className="text-[10px] text-zinc-400 font-sans leading-normal">
                💡 <strong>Analyse :</strong> Le modèle a isolé les informations utiles (adresse, ville, code postal) en ignorant délibérément le bruit (TVA, numéro de téléphone, signature, civilités).
              </div>
            </div>

            {/* Colonne 2 : Sortie JSON Structurée avec confiance */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="font-semibold text-emerald-400">2. JSON EXTRAIT (STRICT SCHEMA)</span>
                <span className="text-zinc-500 font-sans">Grammaire xgrammar</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-zinc-900 text-emerald-300 text-[11px] whitespace-pre font-mono leading-relaxed border border-zinc-800/90 h-64 overflow-y-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
              <div className="text-[10px] text-zinc-400 font-sans leading-normal">
                ✨ <strong>Confiance :</strong> Regardez l'objet <code className="text-zinc-300">_confidence</code> — c'est lui qui pilote les liserés dorés <span className="text-amber-400">✨ À vérifier</span> dans le formulaire.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire pré-rempli */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          alert('Commande confirmée avec succès ! (Simulation)')
        }}
        className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map(({ key, label, type }) => {
            const confidence = _confidence[key]
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-700">
                    {label}
                  </label>
                  <ConfidenceBadge confidence={confidence} />
                </div>
                <input
                  type={type}
                  defaultValue={fields[key] || ''}
                  className={`rounded-xl border px-3.5 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all ${getFieldStyle(confidence)}`}
                />
              </div>
            )
          })}
        </div>

        <div className="border-t border-zinc-100 pt-5 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-500 block">Total de la commande</span>
            <span className="text-xl font-bold font-mono text-zinc-900">899 $ TTC</span>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-zinc-950 px-8 py-3.5 font-semibold text-white hover:bg-zinc-800 transition-all text-sm cursor-pointer shadow-sm hover:shadow"
          >
            Confirmer et payer la Lumina 9000 →
          </button>
        </div>
      </form>

      <button
        type="button"
        onClick={onReset}
        className="text-center text-xs text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
      >
        ← Recommencer avec une autre signature ou texte
      </button>
    </div>
  )
}
