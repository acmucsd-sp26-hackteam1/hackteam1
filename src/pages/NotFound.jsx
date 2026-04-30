import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section class="content-container">
      <h1>404</h1>
      <p>Page not found. <Link to="/">Go home</Link></p>
    </section>
  )
}

export default NotFound
