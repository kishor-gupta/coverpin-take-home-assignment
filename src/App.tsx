import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { UserProvider } from './context/UserContext'
import { CatalogPage } from './pages/CatalogPage'
import { DashboardPage } from './pages/DashboardPage'
import { NewOrderPage } from './pages/NewOrderPage'
import { WizardPage } from './pages/WizardPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<CatalogPage />} />
            <Route path="orders" element={<DashboardPage />} />
            <Route path="orders/new/:typeKey" element={<NewOrderPage />} />
            <Route path="orders/:id" element={<WizardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}
