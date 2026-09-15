import { useEffect, useRef, useState } from 'react'

const PROFILE_KEY = 'hackteam1.profile'
const USERNAMES_KEY = 'hackteam1.usernames'
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/

const emptyProfile = {
  displayName: '',
  username: '',
  aboutMe: '',
  avatarDataUrl: '',
}

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY))
    return stored ? { ...emptyProfile, ...stored } : { ...emptyProfile }
  } catch {
    return { ...emptyProfile }
  }
}

function loadTakenUsernames() {
  try {
    const stored = JSON.parse(localStorage.getItem(USERNAMES_KEY))
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function isUsernameTaken(username, currentUsername) {
  const normalized = username.toLowerCase()
  const current = currentUsername?.toLowerCase() ?? ''
  return loadTakenUsernames().some(
    (taken) => taken.toLowerCase() === normalized && taken.toLowerCase() !== current,
  )
}

function saveProfile(profile, previousUsername) {
  const taken = loadTakenUsernames().filter(
    (name) => name.toLowerCase() !== previousUsername?.toLowerCase(),
  )
  if (!taken.some((name) => name.toLowerCase() === profile.username.toLowerCase())) {
    taken.push(profile.username)
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  localStorage.setItem(USERNAMES_KEY, JSON.stringify(taken))
}

function ProfileModal({ isOpen, onClose }) {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [avatarDataUrl, setAvatarDataUrl] = useState('')
  const [savedUsername, setSavedUsername] = useState('')
  const [nameError, setNameError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const profile = loadProfile()
    setDisplayName(profile.displayName)
    setUsername(profile.username)
    setAboutMe(profile.aboutMe)
    setAvatarDataUrl(profile.avatarDataUrl)
    setSavedUsername(profile.username)
    setNameError('')
    setUsernameError('')
  }, [isOpen])

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

  const handleSave = (e) => {
    e.preventDefault()
    const trimmedName = displayName.trim()
    const trimmedUsername = username.trim()
    let hasError = false
    if (!trimmedName) {
      setNameError('Name is required.')
      hasError = true
    } else {
      setNameError('')
    }

    if (!trimmedUsername) {
      setUsernameError('Username is required.')
      hasError = true
    } else if (!USERNAME_PATTERN.test(trimmedUsername)) {
      setUsernameError('Use 3–20 letters, numbers, or underscores.')
      hasError = true
    } else if (isUsernameTaken(trimmedUsername, savedUsername)) {
      setUsernameError('That username is already taken.')
      hasError = true
    } else {
      setUsernameError('')
    }

    if (hasError) return

    const profile = {
      displayName: trimmedName,
      username: trimmedUsername,
      aboutMe: aboutMe.trim(),
      avatarDataUrl,
    }
    saveProfile(profile, savedUsername)
    onClose()
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
              It must be unique (3–20 letters, numbers, and/or underscores).
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