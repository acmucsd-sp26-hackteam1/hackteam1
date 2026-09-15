import { createContext, useContext, useState, useCallback } from 'react'
export const GROUP_MODAL_TABS = {
  CREATE: 'create',
  JOIN: 'join',
}
const GroupModalContext = createContext(null)
export function GroupModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(GROUP_MODAL_TABS.CREATE)
  const openGroupModal = useCallback((tab = GROUP_MODAL_TABS.CREATE) => {
    setActiveTab(tab)
    setIsOpen(true)
  }, [])
  const closeGroupModal = useCallback(() => {
    setIsOpen(false)
    setActiveTab(GROUP_MODAL_TABS.CREATE)
  }, [])
  return (
    <GroupModalContext.Provider
      value={{
        isOpen,
        activeTab,
        setActiveTab,
        openGroupModal,
        closeGroupModal,
      }}
    >
      {children}
    </GroupModalContext.Provider>
  )
}
export function useGroupModal() {
  const context = useContext(GroupModalContext)
  if (!context) {
    throw new Error('useGroupModal must be used within GroupModalProvider')
  }
  return context
}