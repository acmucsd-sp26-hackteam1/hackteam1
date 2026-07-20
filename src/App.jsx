import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import CalendarTest from './pages/CalendarTest.jsx'
import Login from './pages/Login.jsx'
import JoinTeam from './pages/JoinTeam.jsx'
import CreateTeam from './pages/CreateTeam.jsx'
import NotFound from './pages/NotFound.jsx'
import CreateGroupFAB from './components/CreateGroupFAB.jsx'

const CREATE_GROUP_ROUTES = ['/calendartest']

function App() {
  const { pathname } = useLocation()
  const showCreateGroup = CREATE_GROUP_ROUTES.includes(pathname)

  return (
    <div className="content">
      <nav className="nav">
        <span className="nav-spacer" />
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendartest">Test Calendar</Link>
        <Link to="/login" className="nav-login">Login</Link>
      </nav>
      <div className="body-content">
        <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/calendartest" element={<CalendarTest />} />
        <Route path="/join-team" element={<JoinTeam />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <div className="footer">
        Made with ❤️ by ACM Hack Project Team 1
      </div>
      {showCreateGroup && <CreateGroupFAB />}
    </div>
  )
}

export default App
