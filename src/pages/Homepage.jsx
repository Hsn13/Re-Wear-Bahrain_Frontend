import { Link } from 'react-router'
import Logo from '../components/Logo'

function Homepage() {
  return (
    <>
      <section className="hero">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Logo iconSize={56} textSize="lg" />
        </div>
        <span className="hero-eyebrow">🇧🇭 Bahrain's Circular Fashion Community</span>
        <h1>Give clothes a <span>second life</span>.<br />Earn while you give.</h1>
        <p className="hero-sub">
          Re-Wear BH connects Bahrain neighbours to pass on unwanted clothes for free.
          List an item, earn Eco-Credits, unlock badges — zero waste, zero BHD.
        </p>
        <div className="hero-actions">
          <Link to="/browse" className="btn btn-primary btn-lg">Browse Items</Link>
          <Link to="/sign-up" className="btn btn-secondary btn-lg">Join the Community</Link>
        </div>
      </section>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">👗</div>
          <h3>List for Free</h3>
          <p>Upload unwanted clothes in seconds. Your item goes live to the whole Bahrain community.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌿</div>
          <h3>Earn Eco-Credits</h3>
          <p>Get 30 Eco-Credits every time someone picks up your item. Start with 100 on signup.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Unlock Badges</h3>
          <p>From Eco Starter to Bahrain Eco Champion — grow your impact and your reputation.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📍</div>
          <h3>Local Pickup</h3>
          <p>Browse by neighbourhood — Juffair, Riffa, Seef and more. Meet up, pick up, done.</p>
        </div>
      </div>
    </>
  )
}

export default Homepage
