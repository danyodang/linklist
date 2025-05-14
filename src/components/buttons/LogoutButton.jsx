import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function LogoutButton({
  className = 'flex items-center gap-2 border p-2 px-4 shadow',
  iconLeft = false,
  iconClasses = '',
}) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <button
      className={className}
      onClick={handleSignOut}>
      {iconLeft && (
        <FontAwesomeIcon icon={faRightFromBracket} className={iconClasses} />
      )}
      <span>Logout</span>
      {!iconLeft && (
        <FontAwesomeIcon icon={faRightFromBracket} className={iconClasses} />
      )}
    </button>
  )
}