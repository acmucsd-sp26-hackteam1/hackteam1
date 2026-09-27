import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Calendar from './pages/Calendar.jsx'
import Login from './pages/Login.jsx'
import JoinTeam from './pages/JoinTeam.jsx'
import CreateTeam from './pages/CreateTeam.jsx'
import NotFound from './pages/NotFound.jsx'
import CreateGroupFAB from './components/CreateGroupFAB.jsx'
import LargeFooter from './components/layout/LargeFooter.jsx'
import SmallFooter from './components/layout/SmallFooter.jsx'
import { GroupModalProvider } from './context/GroupModalContext.jsx'

const CREATE_GROUP_ROUTES = ['/calendar']
const LARGE_FOOTER_ROUTES = ['/', '/about']

function App() {
  const { pathname } = useLocation()
  const showCreateGroup = CREATE_GROUP_ROUTES.includes(pathname)

  const hideNav = location.pathname === "/login"
  const showLargeFooter = LARGE_FOOTER_ROUTES.includes(pathname)

  return (
    <GroupModalProvider>
      <div className="content">
        {!hideNav && (
          <nav className="nav">
            <span className="nav-spacer" />
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/login" className="nav-login">Login</Link>
          </nav>
        )}
          
      <div className="body-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/join-team" element={<JoinTeam />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
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