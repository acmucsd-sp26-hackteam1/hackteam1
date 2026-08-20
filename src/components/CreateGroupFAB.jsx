import { useState } from 'react'

const TABS = {
  CREATE: 'create',
  JOIN: 'join',
}

function CreateGroupFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(TABS.CREATE)
  const [groupName, setGroupName] = useState('')
  const [friendIds, setFriendIds] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [nameError, setNameError] = useState('')
  const [joinError, setJoinError] = useState('')

  const resetForm = () => {
    setActiveTab(TABS.CREATE)
    setGroupName('')
    setFriendIds('')
    setJoinCode('')
    setNameError('')
    setJoinError('')
  }

  const openModal = () => {
    setIsOpen(true)
    setNameError('')
    setJoinError('')
  }

  const closeModal = () => {
    setIsOpen(false)
    resetForm()
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    setNameError('')
    setJoinError('')
  }

  const handleCreateGroup = (e) => {
    e.preventDefault()
    const trimmedName = groupName.trim()
    if (!trimmedName) {
      setNameError('Group name is required.')
      return
    }
    setNameError('')
    const ids = friendIds
      .split(/[,\s]+/)
      .map((id) => id.trim())
      .filter((id) => /^\d+$/.test(id))
    console.log({ groupName: trimmedName, friendIds: ids })
    closeModal()
  }

  const handleJoinGroup = (e) => {
    e.preventDefault()
    const trimmedCode = joinCode.trim()
    if (!trimmedCode) {
      setJoinError('Group code is required.')
      return
    }
    setJoinError('')

    console.log({ groupCode: trimmedCode })
    closeModal()
  }

  const modalTitle = activeTab === TABS.CREATE ? 'Create Group' : 'Join Group'
  return (
    <>
      <button
        type="button"
        className="create-group-fab"
        onClick={openModal}
        aria-label="Create or join a group"
      >
        + Group
      </button>
      {isOpen && (
        <div
          className="create-group-overlay"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="create-group-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="create-group-title"
            aria-modal="true"
          >
            <h2 id="create-group-title">{modalTitle}</h2>

            <div className="create-group-tabs" role="tablist" aria-label="Group actions">
              <button
                type="button"
                role="tab"
                id="create-group-tab-create"
                aria-selected={activeTab === TABS.CREATE}
                aria-controls="create-group-panel-create"
                className={activeTab === TABS.CREATE ? 'active' : ''}
                onClick={() => switchTab(TABS.CREATE)}
              >
                Create
              </button>
              <button
                type="button"
                role="tab"
                id="create-group-tab-join"
                aria-selected={activeTab === TABS.JOIN}
                aria-controls="create-group-panel-join"
                className={activeTab === TABS.JOIN ? 'active' : ''}
                onClick={() => switchTab(TABS.JOIN)}
              >
                Join
              </button>
            </div>
            
              {activeTab === TABS.CREATE ? (
              <form
                onSubmit={handleCreateGroup}
                role="tabpanel"
                id="create-group-panel-create"
                aria-labelledby="create-group-tab-create"
              >
                <label className="create-group-field">
                  <span>Group name</span>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value)
                      if (nameError) setNameError('')
                    }}
                    placeholder="Enter group name"
                  />
                  {nameError && (
                    <p className="create-group-error" role="alert">
                      {nameError}
                    </p>
                  )}
                </label>

                <label className="create-group-field">
                  <span>Friend IDs to invite</span>
                  <textarea
                    value={friendIds}
                    onChange={(e) => setFriendIds(e.target.value)}
                    placeholder="e.g. 12345, 67890, 11111"
                    rows={3}
                  />
                  <span className="create-group-hint">
                    Enter one or more numeric IDs, separated by commas or spaces
                  </span>
                </label>

                <div className="create-group-actions">
                  <button type="button" className="create-group-cancel" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="create-group-submit">
                    Create Group
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleJoinGroup}
                role="tabpanel"
                id="create-group-panel-join"
                aria-labelledby="create-group-tab-join"
              >
                <label className="create-group-field">
                  <span>Group code</span>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value)
                      if (joinError) setJoinError('')
                    }}
                    placeholder="Enter group code"
                  />
                  {joinError && (
                    <p className="create-group-error" role="alert">
                      {joinError}
                    </p>
                  )}
                  <span className="create-group-hint">
                    Ask a group member for their invite code
                  </span>
                </label>

                <div className="create-group-actions">
                  <button type="button" className="create-group-cancel" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="create-group-submit">
                    Join Group
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default CreateGroupFAB