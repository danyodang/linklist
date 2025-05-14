import { Outlet } from 'react-router-dom'
import Header from '../Header'

export default function PageLayout() {
  return (
    <main>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <Outlet />
      </div>
    </main>
  )
}