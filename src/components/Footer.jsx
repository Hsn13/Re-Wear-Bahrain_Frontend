import { Link } from 'react-router'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo iconSize={34} textSize="sm" white />
          <p className="footer-tagline">
            Bahrain's circular fashion community.<br />
            Give clothes a second life. Zero BHD.
          </p>
          <p className="footer-inspired">Inspired by Omar</p>
        </div>

        <div className="footer-cols">
          <div>
            <p className="footer-col-heading">Explore</p>
            <nav className="footer-links">
              <Link to="/browse">Browse Items</Link>
              <Link to="/items/new">List an Item</Link>
              <Link to="/about">About Us</Link>
            </nav>
          </div>
          <div>
            <p className="footer-col-heading">Account</p>
            <nav className="footer-links">
              <Link to="/sign-up">Sign Up</Link>
              <Link to="/sign-in">Sign In</Link>
              <Link to="/dashboard">Dashboard</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Re-Wear BH · Made with 🌿 in Bahrain</p>
      </div>
    </footer>
  )
}
