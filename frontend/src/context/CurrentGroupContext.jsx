import { createContext, useContext, useState } from 'react'

const CurrentGroupContext = createContext(null)

export function CurrentGroupProvider({ children }) {
  const [currentGroupCode, setCurrentGroupCode] = useState(null)

  return (
    <CurrentGroupContext.Provider value={{ currentGroupCode, setCurrentGroupCode }}>
      {children}
    </CurrentGroupContext.Provider>
  )
}

export function useCurrentGroup() {
  const context = useContext(CurrentGroupContext)
  if (!context) {
    throw new Error('useCurrentGroup must be used within CurrentGroupProvider')
  }
  return context
}