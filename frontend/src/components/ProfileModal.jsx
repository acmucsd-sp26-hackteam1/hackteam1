import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/

function ProfileModal({ isOpen, onClose }) {
  const { currentUser } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [avatarDataUrl, setAvatarDataUrl] = useState('')
  const [nameError, setNameError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [saveError, setSaveError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !currentUser) return
    setDisplayName(currentUser.displayName || '')
    setUsername('')
    setAboutMe('')
    setAvatarDataUrl(currentUser.photoURL || '')
    setNameError('')
    setUsernameError('')
    setSaveError('')
  }, [isOpen, currentUser])

  if (!isOpen) return null

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarDataUrl(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      setSaveError('You must be logged in to save a profile.')
      return
    }

    const trimmedName = displayName.trim()
    const trimmedUsername = username.trim()
    let hasError = false
    if (!trimmedName) {
      setNameError('Name is required.')
      hasError = true
    } else {
      setNameError('')
    }

    if (trimmedUsername && !USERNAME_PATTERN.test(trimmedUsername)) {
      setUsernameError('Use 3–20 letters, numbers, or underscores.')
      hasError = true
    } else {
      setUsernameError('')
    }

    if (hasError) return

    try {
      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: currentUser.uid,
          displayName: trimmedName,
          email: currentUser.email,
          avatar: avatarDataUrl,
        }),
      })
      const data = await res.json()
      console.log('Profile saved:', data)
      setSaveError('')
      onClose()
    } catch (err) {
      console.error('Save profile failed:', err)
      setSaveError('Failed to save profile. Try again.')
    }
  }

  return (
    <div className="profile-overlay" onClick={onClose} role="presentation">
      <div
        className="profile-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="profile-modal-title"
        aria-modal="true"
      >
        <h2 id="profile-modal-title">Create Profile</h2>
        <form onSubmit={handleSave}>
          <div className="profile-avatar-field">
            <span>Avatar</span>
            <div className="profile-avatar-row">
              <div className="profile-avatar-preview" aria-hidden={!avatarDataUrl}>
                {avatarDataUrl ? (
                  <img src={avatarDataUrl} alt="Profile avatar preview" />
                ) : (
                  <span>{displayName.trim().charAt(0).toUpperCase() || '?'}</span>
                )}
              </div>
              <div className="profile-avatar-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  hidden
                />
                <button
                  type="button"
                  className="profile-avatar-upload"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload photo
                </button>
                {avatarDataUrl && (
                  <button
                    type="button"
                    className="create-group-cancel"
                    onClick={() => {
                      setAvatarDataUrl('')
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <label className="create-group-field">
            <span>Name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value)
                if (nameError) setNameError('')
              }}
              placeholder="Your full name"
              autoComplete="name"
            />
            {nameError && (
              <p className="create-group-error" role="alert">
                {nameError}
              </p>
            )}
          </label>

          <label className="create-group-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (usernameError) setUsernameError('')
              }}
              placeholder="Type username here"
              autoComplete="username"
            />
            {usernameError && (
              <p className="create-group-error" role="alert">
                {usernameError}
              </p>
            )}
            <span className="create-group-hint">
              3–20 letters, numbers, and/or underscores.
            </span>
          </label>

          <label className="create-group-field">
            <span>About me</span>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Introduce yourself!"
              rows={4}
            />
          </label>

          {saveError && (
            <p className="create-group-error" role="alert">
              {saveError}
            </p>
          )}

          <div className="create-group-actions">
            <button type="button" className="create-group-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-group-submit">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal