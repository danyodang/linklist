import { Outlet } from 'react-router-dom'
import AppSidebar from '../layout/AppSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default function AppLayout() {
  return (
    <main className="md:flex min-h-screen">
      <label htmlFor="navCb" className="md:hidden ml-8 mt-4 p-4 rounded-md bg-white shadow inline-flex items-center gap-2 cursor-pointer">
        <FontAwesomeIcon icon={faBars} />
        <span>Open navigation</span>
      </label>
      <input id="navCb" type="checkbox" className="hidden" />
      <label htmlFor="navCb" className="hidden backdrop fixed inset-0 bg-black/80 z-10" />
      <aside className="bg-white w-48 p-4 pt-6 shadow fixed md:static -left-48 top-0 bottom-0 z-20 transition-all">
        <AppSidebar />
      </aside>
      <div className="grow">
        <Outlet />
      </div>
    </main>
  )
}