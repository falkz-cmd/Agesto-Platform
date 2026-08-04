import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Placeholder } from './pages/Placeholder'
import { ClientesPage } from './features/clientes/ClientesPage'
import { ProdutosPage } from './features/produtos/ProdutosPage'
import { ServicosPage } from './features/servicos/ServicosPage'
import { AgendaPage } from './features/agenda/AgendaPage'
import { OrcamentosPage } from './features/orcamentos/OrcamentosPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="atendimentos" element={<Placeholder title="Atendimentos" />} />
          <Route path="orcamentos" element={<OrcamentosPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="produtos" element={<ProdutosPage />} />
          <Route path="servicos" element={<ServicosPage />} />
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
