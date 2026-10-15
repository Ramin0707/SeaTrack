import './Header.css'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header" id="top">
      <div className="container header-container">

        <Link to="/" className="logo">
          Sea<span>Track</span>
        </Link>

        <nav className="main-nav">
          <Link to="/">Home</Link>

          <Link to="/services">
            Services
          </Link>

          <Link to="/tracking">
            Tracking
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/blog">
            Blog
          </Link>

          <Link to="/contacts">
            Contacts
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="login-link">
            Login
          </Link>

          <Link to="/register" className="header-button">
            Get Started
            <span>→</span>
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Header