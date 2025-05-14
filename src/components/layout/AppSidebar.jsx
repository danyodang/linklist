import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft, faChartLine } from '@fortawesome/free-solid-svg-icons'
import LogoutButton from '../buttons/LogoutButton'

export default function AppSidebar() {
  const location = useLocation()
  const path = location.pathname

  return (
    <nav className="inline-flex mx-auto flex-col text-center mt-8 gap-2 text-gray-500">
      <Link
        to="/app/account"
        className={
          "flex gap-4 p-2 "
          + (path === '/app/account' ? 'text-blue-500' : '')
        }>
        <FontAwesomeIcon
          fixedWidth={true}
          icon={faFileLines}
          className="w-6 h-6"
        />
        <span>My Page</span>
      </Link>
      <Link
        to="/app/analytics"
        className={
          "flex gap-4 p-2 "
          + (path === '/app/analytics' ? 'text-blue-500' : '')
        }>
        <FontAwesomeIcon
          fixedWidth={true}
          icon={faChartLine}
          className="w-6 h-6"
        />
        <span>Analytics</span>
      </Link>
      <LogoutButton
        iconLeft={true}
        className="flex gap-4 items-center text-gray-500 p-2"
        iconClasses="w-6 h-6"
      />
      <Link to="/" className="flex items-center gap-2 text-xs text-gray-500 border-t pt-4">
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
        <span>Back to website</span>
      </Link>
    </nav>
  )
}