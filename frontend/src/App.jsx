import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import CalendarTest from './pages/CalendarTest.jsx'
import Login from './pages/Login.jsx'
import JoinTeam from './pages/JoinTeam.jsx'
import CreateTeam from './pages/CreateTeam.jsx'
import NotFound from './pages/NotFound.jsx'
import Register from './pages/Register.jsx'
import CreateGroupFAB from './components/CreateGroupFAB.jsx'
import { GroupModalProvider } from './context/GroupModalContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { doSignOut } from './auth/auth.js'

const CREATE_GROUP_ROUTES = ['/calendartest']

function App() {
  const { pathname } = useLocation()
  const showCreateGroup = CREATE_GROUP_ROUTES.includes(pathname)

  const hideNav = pathname === "/login" || pathname === "/register"

  const { currentUser, authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return

    let active = true
    fetch(`http://localhost:3000/api/users/${encodeURIComponent(currentUser.uid)}`)
      .then(async (response) => {
        if (response.status === 404) return null
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

  return (
    <GroupModalProvider>
      <div className="content">
        {!hideNav && (
          <nav className="nav">
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/calendartest">Calendar</Link>
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
          <Route path="/calendartest" element={<CalendarTest onProfileSaved={setUserProfile} />} />
          <Route path="/join-team" element={<JoinTeam />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      {!hideNav && (
        <div className="footer">
          Made with ❤️ by ACM Hack Project Team 1
        </div>
      )}
      
      {showCreateGroup && <CreateGroupFAB />}
    </div>
    </GroupModalProvider>
  )
}

export default App