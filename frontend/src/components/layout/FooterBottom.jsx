const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=9500+Gilman+Dr,+La+Jolla,+CA+92093'

function FooterBottom() {
  return (
    <div className="footer-bottom">
      <p className="footer-contact">
        Contact: hackteam1@gmail.com &nbsp;|&nbsp; 9500 Gilman Dr, La Jolla, 92093 &nbsp;|&nbsp; (619) 123-4567
      </p>
      <div className="footer-small-links">
        <span>Privacy Policy</span>
        <a href={MAP_URL} target="_blank" rel="noreferrer">Map</a>
        <span>@ ACM Hack Projects</span>
      </div>
    </div>
  )
}

export default FooterBottom
