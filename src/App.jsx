import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AccountPage from './pages/AccountPage'
import AnalyticsPage from './pages/AnalyticsPage'
import PageLayout from './components/layouts/PageLayout'
import AppLayout from './components/layouts/AppLayout'
import UserPage from './pages/UserPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route path="/app" element={<AppLayout />}>
        <Route path="account" element={<AccountPage />} />
        <Route path="analytics" element={<AccountPage />} />
      </Route>
      <Route path="/:username" element={<UserPage />} />
    </Routes>
  )
}

export default App