import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="content-container">
      <h1>404</h1>
      <p>Page not found. <Link to="/">Go home</Link></p>
    </section>
  )
}

export default NotFound
