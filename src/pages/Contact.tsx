import { Link } from 'react-router-dom'

function Contact() {
  return (
    <div className="container">
      <h1>Contact</h1>

      <div className="contact-info">
        <p>Neem gerust contact met ons op!</p>
        <ul className="contact-list">
          <li>Email: info@example.com</li>
          <li>Telefoon: +31 6 12345678</li>
        </ul>
      </div>

      <nav className="nav-links">
        <Link to="/">Terug naar Home</Link>
      </nav>
    </div>
  )
}

export default Contact
