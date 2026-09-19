import { useState } from 'react'
import { GROUP_MODAL_TABS, useGroupModal } from '../context/GroupModalContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrentGroup } from '../context/CurrentGroupContext.jsx'

const TABS = {
  CREATE: 'create',
  JOIN: 'join',
}

function CreateGroupFAB() {
  const { isOpen, activeTab, setActiveTab, openGroupModal, closeGroupModal } = useGroupModal()
  const [groupName, setGroupName] = useState('')
  const [friendIds, setFriendIds] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [nameError, setNameError] = useState('')
  const [joinError, setJoinError] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const { currentUser } = useAuth()
  const { setCurrentGroupCode } = useCurrentGroup()

  const resetForm = () => {
    setGroupName('')
    setFriendIds('')
    setJoinCode('')
    setNameError('')
    setJoinError('')
    setCreatedCode('')
  }

  const closeModal = () => {
    closeGroupModal()
    resetForm()
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    setNameError('')
    setJoinError('')
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      console.error('Must be logged in to create/join a group')
      return
    }
    const trimmedName = groupName.trim()
    if (!trimmedName) {
      setNameError('Group name is required.')
      return
    }
    setNameError('')

    try {
      const res = await fetch('http://localhost:3000/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, userId: currentUser?.uid }),
      })
      const data = await res.json()
      console.log('Group created:', data)
      setCreatedCode(data.code)
      setCurrentGroupCode(data.code)
    } catch (err) {
      console.error('Create group failed:', err)
    }
    // don't closeModal() yet — want to show the code first
  }

  const handleJoinGroup = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      console.error('Must be logged in to create/join a group')
      return
    }
    const trimmedCode = joinCode.trim()
    if (!trimmedCode) {
      setJoinError('Group code is required.')
      return
    }
    setJoinError('')

    try {
      const res = await fetch(`http://localhost:3000/api/groups/${trimmedCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.uid }),
      })
      const data = await res.json()
      console.log('Joined group:', data)
      setCurrentGroupCode(data.code)
    } catch (err) {
      console.error('Join group failed:', err)
    }

    closeModal()
  }

  const modalTitle = activeTab === GROUP_MODAL_TABS.CREATE ? 'Create Group' : 'Join Group'
  return (
    <>
      <button
        type="button"
        className="create-group-fab"
        onClick={() => openGroupModal(GROUP_MODAL_TABS.CREATE)}
        aria-label="Create or join a group"
      >
        Create | Join
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
                aria-selected={activeTab === GROUP_MODAL_TABS.CREATE}
                aria-controls="create-group-panel-create"
                className={activeTab === GROUP_MODAL_TABS.CREATE ? 'active' : ''}
                onClick={() => switchTab(GROUP_MODAL_TABS.CREATE)}
              >
                Create
              </button>
              <button
                type="button"
                role="tab"
                id="create-group-tab-join"
                aria-selected={activeTab === GROUP_MODAL_TABS.JOIN}
                aria-controls="create-group-panel-join"
                className={activeTab === GROUP_MODAL_TABS.JOIN ? 'active' : ''}
                onClick={() => switchTab(GROUP_MODAL_TABS.JOIN)}
              >
                Join
              </button>
            </div>
            {activeTab === GROUP_MODAL_TABS.CREATE ? (
              createdCode ? (
                <div className="create-group-success">
                  <p>Group created! Your group code:</p>
                  <p><strong>{createdCode}</strong></p>
                  <button type="button" onClick={closeModal}>Done</button>
                </div>
              ) : (
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
              )
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