import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GROUP_MODAL_TABS, useGroupModal } from '../context/GroupModalContext.jsx'

function JoinTeam() {
  const navigate = useNavigate()
  const { openGroupModal } = useGroupModal()
  useEffect(() => {
    openGroupModal(GROUP_MODAL_TABS.JOIN)
    navigate('/calendartest', { replace: true })
  }, [navigate, openGroupModal])
  return null
}

export default JoinTeam