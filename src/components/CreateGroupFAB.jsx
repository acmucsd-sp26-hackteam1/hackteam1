import { useState } from 'react'

function CreateGroupFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [friendIds, setFriendIds] = useState('')
  const [nameError, setNameError] = useState('')

  const openModal = () => {
    setIsOpen(true)
    setNameError('')
  }

  const closeModal = () => {
    setIsOpen(false)
    setNameError('')
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

    // TODO: wire up to backend when available
    console.log({ groupName: trimmedName, friendIds: ids })
    closeModal()
    setGroupName('')
    setFriendIds('')
  }

  return (
    <>
      <button
        type="button"
        className="create-group-fab"
        onClick={openModal}
        aria-label="Create a group"
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
            <h2 id="create-group-title">Create Group</h2>
            <form onSubmit={handleCreateGroup}>
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
          </div>
        </div>
      )}
    </>
  )
}

export default CreateGroupFAB
