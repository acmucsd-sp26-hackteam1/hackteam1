import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Calendar from './pages/Calendar.jsx'
import Login from './pages/Login.jsx'
import JoinTeam from './pages/JoinTeam.jsx'
import CreateTeam from './pages/CreateTeam.jsx'
import NotFound from './pages/NotFound.jsx'
import Register from './pages/Register.jsx'
import CreateGroupFAB from './components/CreateGroupFAB.jsx'
import LargeFooter from './components/layout/LargeFooter.jsx'
import SmallFooter from './components/layout/SmallFooter.jsx'
import { GroupModalProvider } from './context/GroupModalContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { doSignOut } from './auth/auth.js'

const CREATE_GROUP_ROUTES = ['/calendar']
const LARGE_FOOTER_ROUTES = ['/', '/about']

function App() {
  const { pathname } = useLocation()
  const showCreateGroup = CREATE_GROUP_ROUTES.includes(pathname)

  const hideNav = pathname === "/login" || pathname === "/register"
  const showLargeFooter = LARGE_FOOTER_ROUTES.includes(pathname)

  const { currentUser, authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return

    let active = true
    fetch(`http://localhost:3000/api/users/${encodeURIComponent(currentUser.uid)}`)
      .then(async (response) => {
        if (response.status === 404) {
          const createResponse = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: currentUser.uid,
              displayName: currentUser.displayName || '',
              email: currentUser.email || '',
              avatar: currentUser.photoURL || '',
            }),
          })
          if (!createResponse.ok) throw new Error('Could not create account profile.')
          return createResponse.json()
        }
        const profile = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(profile.error || 'Could not load profile.')
        return profile
      })
      .then((profile) => {
        if (active) setUserProfile(profile)
      })
      .catch((error) => console.error('Could not load account profile:', error))

    return () => {
      active = false
    }
  }, [currentUser])

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  }

  const displayedProfile = userProfile?.uid === currentUser?.uid ? userProfile : null
  const currentUserAvatar = displayedProfile?.avatar || currentUser?.photoURL

  return (
    <GroupModalProvider>
      <div className="content">
        {!hideNav && (
          <nav className="nav">
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/calendar">Calendar</Link>
            </div>

            <div className="nav-account">
              {authLoading ? null : currentUser ? (
                <>
                  <span className="nav-user">
                    {(displayedProfile?.avatar || currentUser.photoURL) && (
                      <img src={displayedProfile?.avatar || currentUser.photoURL} alt="" />
                    )}
                    <span>Logged in as <strong>{displayedProfile?.username || displayedProfile?.displayName || currentUser.displayName || currentUser.email}</strong></span>
                  </span>
                  <button onClick={handleSignOut} className="nav-login logout-btn">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="nav-login">Login</Link>
              )}
            </div>

          </nav>
        )}
          
      <div className="body-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calendar" element={<Calendar onProfileSaved={setUserProfile} currentUserAvatar={currentUserAvatar} />} />
          <Route path="/join-team" element={<JoinTeam />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      {!hideNav && (
        <div className="footer">
          {showLargeFooter ? <LargeFooter /> : <SmallFooter />}
        </div>
      )}
      
      {showCreateGroup && <CreateGroupFAB />}
    </div>
    </GroupModalProvider>
  )
}

export default App