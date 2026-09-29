import beachImage from '../assets/about/beach.png'
import acmLogo from '../assets/about/acm.png'
import hackLogo from '../assets/about/hack.png'
import ucsdSeal from '../assets/about/ucsd-seal.png'

const FEATURES = [
  'Organize and create your own calendar!',
  'Easily share your calendar with friends',
  'Find and schedule time with others with calendars that update in real-time',
]

const ORGANIZATIONS = [
  {
    image: acmLogo,
    imageAlt: 'ACM logo',
    text: "ACM at UCSD is the Association for Computing Machinery at UC San Diego, which is the campus's largest student-run computing organization",
  },
  {
    image: hackLogo,
    imageAlt: 'ACM Hack logo',
    text: 'ACM Projects, is a quarter-long hands-on program where students collaborate in tight-knit teams to build real-world technical applications outside of the classroom',
  },
  {
    image: ucsdSeal,
    imageAlt: 'UC San Diego seal',
    text: 'While open to all majors, ACM acts as a primary social hub for students in the Computer Science and Engineering department and the Halıcıoğlu Data Science Institute',
  },
]

function About() {
  return (
    <>
      <section className="about-intro">
        <img src={beachImage} alt="" className="about-background" />
        <div className="about-intro-content">
          <h1 className="hand-title about-title">About UCSDTime!</h1>
          <p className="hand-title about-tagline">
            UCSDTime allows students to create personalized calendars and easily share them.
          </p>
          <div className="about-features">
            {FEATURES.map((feature) => (
              <p key={feature} className="about-feature-card">{feature}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="about-organizations">
        {ORGANIZATIONS.map((organization) => (
          <div key={organization.imageAlt} className="organization-card">
            <img src={organization.image} alt={organization.imageAlt} />
            <p>{organization.text}</p>
          </div>
        ))}
      </section>
    </>
  )
}

export default About
