import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import CalendarTest from './pages/CalendarTest.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <div className="content">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendartest">Test Calendar</Link>
      </nav>
      <div className="body-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calendartest" element={<CalendarTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <div className="footer">
        Made with ❤️ by ACM Hack Project Team 1
      </div>
    </div>
  )
}

export default App
