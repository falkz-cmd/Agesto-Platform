import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Placeholder } from './pages/Placeholder'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="atendimentos" element={<Placeholder title="Atendimentos" />} />
          <Route path="orcamentos" element={<Placeholder title="Orçamentos" />} />
          <Route path="agenda" element={<Placeholder title="Agenda" />} />
          <Route path="clientes" element={<Placeholder title="Clientes" />} />
          <Route path="produtos" element={<Placeholder title="Produtos" />} />
          <Route path="servicos" element={<Placeholder title="Serviços" />} />
          <Route path="relatorios" element={<Placeholder title="Relatórios" />} />
          <Route
            path="parametrizacao"
            element={<Placeholder title="Parametrização" />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
