import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import CalendarTest from './pages/CalendarTest.jsx'
import Login from './pages/Login.jsx'
import JoinTeam from './pages/JoinTeam.jsx'
import CreateTeam from './pages/CreateTeam.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <div className="content">
      <nav className="nav">
        <span className="nav-spacer" />
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendartest">Test Calendar</Link>
        <Link to="/login" className="nav-login">Login</Link>
      </nav>
      <Routes className="body-content">
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/calendartest" element={<CalendarTest />} />
        <Route path="/join-team" element={<JoinTeam />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="footer">
        this is the footer
      </div>
    </div>
  )
}

export default App
