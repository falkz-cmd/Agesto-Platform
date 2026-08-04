/**
 * Placeholder de verificação do scaffold (web-01).
 * Prova que o pipeline Vite + Tailwind v4 + tokens do protótipo está de pé.
 * Será substituído pelo AppShell + roteamento na web-02.
 */
export default function App() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md rounded-card border border-line bg-surface p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-brand text-base font-extrabold text-white">
            A
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-ink">Agesto</h1>
            <p className="text-sm text-ink-3">Painel do Dono · scaffold</p>
          </div>
        </div>

        <p className="mt-5 text-sm text-ink-2">
          Ambiente web configurado — React + Vite + Tailwind v4 com os tokens do
          protótipo aprovado.
        </p>

        <p className="money mt-4 text-4xl text-brand-ink">R$ 18.420</p>

        <span className="mt-3 inline-block rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-ink">
          web-01 ✓
        </span>
      </div>
    </div>
  )
}
