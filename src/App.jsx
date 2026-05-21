import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import CalendarTest from './pages/CalendarTest.jsx'
import NotFound from './pages/NotFound.jsx'
import CreateGroupFAB from './components/CreateGroupFAB.jsx'

const CREATE_GROUP_ROUTES = ['/', '/calendartest']

function App() {
  const { pathname } = useLocation()
  const showCreateGroup = CREATE_GROUP_ROUTES.includes(pathname)

  return (
    <div className="content">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendartest">Test Calendar</Link>
      </nav>
      <Routes className="body-content">
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/calendartest" element={<CalendarTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="footer">
        this is the footer
      </div>
      {showCreateGroup && <CreateGroupFAB />}
    </div>
  )
}

export default App
