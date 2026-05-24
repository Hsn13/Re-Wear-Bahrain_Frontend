import { useEffect } from 'react'
import { Link } from 'react-router'
import Logo from '../components/Logo'
import { ALL_NEIGHBORHOODS } from '../constants/neighborhoods'

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function Homepage() {
  useScrollReveal()

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-animate">
          <Logo iconSize={60} textSize="lg" />
        </div>
        <span className="hero-eyebrow hero-animate hero-animate-1">
          🇧🇭 Bahrain's Circular Fashion Community
        </span>
        <h1 className="hero-animate hero-animate-2">
          Give clothes a <span>second life</span>.<br />Earn while you give.
        </h1>
        <p className="hero-sub hero-animate hero-animate-3">
          Re-Wear BH connects Bahrain neighbours to pass on unwanted clothes for free.
          List an item, earn Eco-Credits, unlock badges — zero waste, zero BHD.
        </p>
        <div className="hero-actions hero-animate hero-animate-4">
          <Link to="/browse" className="btn btn-primary btn-lg">Browse Items</Link>
          <Link to="/sign-up" className="btn btn-secondary btn-lg">Join the Community</Link>
        </div>
        <div className="hero-scroll-hint hero-animate hero-animate-4" aria-hidden="true">↓</div>
      </section>

      {/* ── Stats strip ── */}
      <div className="stats-strip">
        <div className="stat-item reveal">
          <span className="stat-number">100</span>
          <span className="stat-label">Starting Eco-Credits</span>
        </div>
        <div className="stat-item reveal reveal-delay-1">
          <span className="stat-number">30</span>
          <span className="stat-label">Credits earned per give</span>
        </div>
        <div className="stat-item reveal reveal-delay-2">
          <span className="stat-number">40+</span>
          <span className="stat-label">Neighbourhoods covered</span>
        </div>
        <div className="stat-item reveal reveal-delay-3">
          <span className="stat-number">0 BHD</span>
          <span className="stat-label">Cost to list any item</span>
        </div>
      </div>

      {/* ── How it works ── */}
      <section className="how-it-works">
        <span className="section-eyebrow reveal">Simple by design</span>
        <h2 className="reveal reveal-delay-1">How Re-Wear BH works</h2>
        <div className="steps-grid">
          <div className="step-card reveal">
            <div className="step-number">1</div>
            <div className="step-icon">📸</div>
            <h3>List Your Item</h3>
            <p>Upload a photo, pick a category, describe the condition. Your item goes live to the entire Bahrain community in minutes.</p>
          </div>
          <div className="step-card reveal reveal-delay-1">
            <div className="step-number">2</div>
            <div className="step-icon">🌿</div>
            <h3>Someone Claims It</h3>
            <p>A neighbour spends Eco-Credits to request your item. You review and approve — no money changes hands, ever.</p>
          </div>
          <div className="step-card reveal reveal-delay-2">
            <div className="step-number">3</div>
            <div className="step-icon">🤝</div>
            <h3>Meet &amp; Hand Over</h3>
            <p>Agree on a local pickup, hand it over. You earn 30 Eco-Credits and move closer to your next badge.</p>
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <div className="features">
        <div className="feature-card reveal">
          <div className="feature-icon">👗</div>
          <h3>List for Free</h3>
          <p>Upload unwanted clothes in seconds. Your item goes live to the whole Bahrain community.</p>
        </div>
        <div className="feature-card reveal reveal-delay-1">
          <div className="feature-icon">🌿</div>
          <h3>Earn Eco-Credits</h3>
          <p>Get 30 Eco-Credits every time someone picks up your item. Start with 100 on signup.</p>
        </div>
        <div className="feature-card reveal reveal-delay-2">
          <div className="feature-icon">🏆</div>
          <h3>Unlock Badges</h3>
          <p>From Eco Starter to Bahrain Eco Champion — grow your impact and your reputation.</p>
        </div>
        <div className="feature-card reveal reveal-delay-3">
          <div className="feature-icon">📍</div>
          <h3>Local Pickup</h3>
          <p>Browse by neighbourhood — Juffair, Riffa, Seef and more. Meet up, pick up, done.</p>
        </div>
      </div>

      {/* ── Neighbourhoods ── */}
      <section className="neighborhoods-section">
        <span className="section-eyebrow reveal" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
          Across the Kingdom
        </span>
        <h2 className="reveal reveal-delay-1" style={{ color: 'white' }}>
          Serving every corner of Bahrain
        </h2>
        <p className="reveal reveal-delay-2" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '480px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
          From Amwaj Islands to Durrat Al Bahrain — find items in your area or share with your community.
        </p>
        <div className="neighborhoods-cloud reveal reveal-delay-2">
          {ALL_NEIGHBORHOODS.map(n => (
            <Link key={n} to={`/browse?neighborhood=${encodeURIComponent(n)}`} className="neighborhood-pill">
              {n}
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section reveal">
        <span className="section-eyebrow" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>
          Zero BHD · Zero waste
        </span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', marginBottom: '1rem' }}>
          Ready to give your wardrobe a second life?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
          Join hundreds of Bahrainis already passing clothes forward — not into the bin.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/sign-up" className="btn btn-primary btn-lg">Join Re-Wear BH — It's Free</Link>
          <Link to="/browse" className="btn btn-secondary btn-lg">Browse First</Link>
        </div>
      </section>
    </>
  )
}
