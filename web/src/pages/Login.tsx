import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { Button } from '../components/ui'
import { ApiError } from '../lib/api'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USING_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

type LocationState = { from?: string }

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    if (!EMAIL_RE.test(email)) {
      setFieldError('Informe um email válido.')
      return
    }
    if (senha.length < 8) {
      setFieldError('A senha deve ter no mínimo 8 caracteres.')
      return
    }
    setFieldError(null)

    setLoading(true)
    try {
      await login(email, senha)
      navigate(from, { replace: true })
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : 'Não foi possível entrar. Tente novamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-bg p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-[11px] bg-gradient-to-br from-brand to-brand-ink text-lg font-extrabold text-white">
            A
          </div>
          <div>
            <b className="block text-lg tracking-tight text-ink">Agesto</b>
            <span className="block text-[12px] text-ink-4">Painel do Dono</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6 shadow-card"
        >
          <div>
            <h1 className="text-[17px] font-semibold text-ink">Entrar</h1>
            <p className="mt-0.5 text-[12.5px] text-ink-3">
              Acesse o painel de gestão do seu negócio.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-semibold text-ink-2">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink outline-none focus:border-brand"
              placeholder="voce@empresa.com"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-semibold text-ink-2">Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink outline-none focus:border-brand"
              placeholder="••••••••"
            />
          </label>

          {fieldError && <p className="text-[12.5px] text-bad">{fieldError}</p>}
          {submitError && (
            <p className="rounded-sm bg-bad-soft px-3 py-2 text-[12.5px] font-medium text-bad">
              {submitError}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-1 w-full">
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>

          {USING_MOCKS && (
            <p className="text-center text-[11.5px] text-ink-4">
              Demo (mock): <b>dono@agesto.app</b> / <b>agesto123</b>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
