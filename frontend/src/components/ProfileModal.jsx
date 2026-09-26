import { useEffect, useRef, useState } from 'react'
import { auth } from '../firebase.js'
import { apiErrorMessage, fetchProfile, fetchProfileByFirebaseUid, getStoredUserId, saveProfile, setStoredUserId } from '../api.js'

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/

const emptyProfile = {
  displayName: '',
  username: '',
  aboutMe: '',
  avatarDataUrl: '',
}

function ProfileModal({ isOpen, onClose }) {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [avatarDataUrl, setAvatarDataUrl] = useState('')
  const [friendId, setFriendId] = useState('')
  const [nameError, setNameError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const profile = { ...emptyProfile }
    setDisplayName(profile.displayName)
    setUsername(profile.username)
    setAboutMe(profile.aboutMe)
    setAvatarDataUrl(profile.avatarDataUrl)
    setFriendId('')
    setNameError('')
    setUsernameError('')
    setFormError('')

    const userId = getStoredUserId()
    const firebaseUser = auth.currentUser
    if (!userId && !firebaseUser?.uid) {
      const firebaseName = firebaseUser?.displayName || ''
      if (firebaseName) setDisplayName(firebaseName)
      return
    }

    let cancelled = false
    setIsLoading(true)
    const loadProfile = userId
      ? fetchProfile(userId)
      : fetchProfileByFirebaseUid(firebaseUser.uid)
    loadProfile
      .then((saved) => {
        if (cancelled) return
        setDisplayName(saved.displayName || '')
        setUsername(saved.username || '')
        setAboutMe(saved.aboutMe || '')
        setAvatarDataUrl(saved.avatarDataUrl || '')
        setFriendId(saved.friendId || '')
        setStoredUserId(saved.id)
      })
      .catch((error) => {
        if (cancelled) return
        if (error.response?.status === 404) {
          if (userId) setStoredUserId('')
          return
        }
        setFormError(apiErrorMessage(error, 'Could not load profile from the server.'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
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

  const handleSave = async (e) => {
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
    } else {
      setUsernameError('')
    }

    if (hasError) return

    setIsSaving(true)
    setFormError('')
    try {
      const saved = await saveProfile({
        id: getStoredUserId() || undefined,
        displayName: trimmedName,
        username: trimmedUsername,
        aboutMe: aboutMe.trim(),
        avatarDataUrl,
        firebaseUid: auth.currentUser?.uid || '',
      })
      setFriendId(saved.friendId || '')
      onClose()
    } catch (error) {
      const message = apiErrorMessage(error, 'Could not save profile.')
      if (error.response?.status === 409) {
        setUsernameError(message)
      } else {
        setFormError(message)
      }
    } finally {
      setIsSaving(false)
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
              disabled={isLoading || isSaving}
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
              disabled={isLoading || isSaving}
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
              disabled={isLoading || isSaving}
            />
          </label>

          {friendId && (
            <p className="create-group-hint">
              Your Friend ID is <strong>{friendId}</strong>. Share it so others can invite you to a group.
            </p>
          )}

          {formError && (
            <p className="create-group-error" role="alert">
              {formError}
            </p>
          )}

          <div className="create-group-actions">
            <button type="button" className="create-group-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-group-submit" disabled={isLoading || isSaving}>
              {isSaving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal