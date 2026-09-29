import { useState } from 'react'
import { Link } from 'react-router-dom'
import FooterBottom from './FooterBottom.jsx'
import instagramIcon from '../../assets/icons/instagram.svg'
import googleIcon from '../../assets/icons/google.png'
import githubIcon from '../../assets/icons/github.png'

function LargeFooter() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (event) => {
    event.preventDefault()
    setEmail('')
  }

  return (
    <footer className="large-footer">
      <div className="large-footer-top">
        <div className="stay-connected">
          <h2>Stay Connected !</h2>
          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" aria-label="Subscribe" />
          </form>
          <div className="social-links">
            <a href="https://www.instagram.com/acm.at.ucsd/" target="_blank" rel="noreferrer">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="mailto:hackteam1@gmail.com">
              <img src={googleIcon} alt="Email us" />
            </a>
            <a href="https://github.com/acmucsd-sp26-hackteam1/hackteam1" target="_blank" rel="noreferrer">
              <img src={githubIcon} alt="GitHub" />
            </a>
          </div>
        </div>

        <div className="footer-navigate">
          <h3>Navigate</h3>
          <Link to="/calendartest">Calendar &gt;</Link>
          <Link to="/create-team">Create a Group &gt;</Link>
          <Link to="/join-team">Join a Group &gt;</Link>
        </div>
      </div>

      <FooterBottom />
    </footer>
  )
}

export default LargeFooter
