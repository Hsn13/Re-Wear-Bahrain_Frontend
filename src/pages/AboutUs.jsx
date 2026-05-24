import { useEffect } from 'react'
import { Link } from 'react-router'
import Logo from '../components/Logo'
import BackButton from '../components/BackButton'

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

export default function AboutUs() {
  useScrollReveal()

  return (
    <>
      <div style={{ padding: '1rem 1.5rem 0' }}>
        <BackButton fallback="/" />
      </div>
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="hero-animate" style={{ marginBottom: '1.5rem' }}>
          <Logo iconSize={52} textSize="lg" white />
        </div>
        <span className="hero-eyebrow hero-animate hero-animate-1"
          style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
          Our Story
        </span>
        <h1 className="hero-animate hero-animate-2">Who We Are</h1>
        <p className="hero-animate hero-animate-3">
          Re-Wear BH is a community-driven platform built to keep good clothes in use
          and out of landfill — one neighbour at a time.
        </p>
      </section>

      {/* ── Inspired by Omar ── */}
      <section className="story-section">
        <div className="story-card reveal">
          <span className="story-quote">"</span>
          <p className="story-text">
            The idea started simply: wardrobes in Bahrain are full of clothes that are barely worn,
            perfectly good, but forgotten. Meanwhile, people are buying new things they don't really
            need. Re-Wear BH exists to close that loop — to make it as easy to give a shirt a new
            home as it is to throw it away. No money. No hassle. Just community.
          </p>
          <p className="story-credit">— Inspired by Omar</p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="mission-section">
        <span className="section-eyebrow reveal">Why we exist</span>
        <h2 className="reveal reveal-delay-1">Our Mission</h2>
        <p className="mission-text reveal reveal-delay-2">
          To build Bahrain's circular fashion economy — where every unwanted item finds a new owner,
          every giver earns recognition, and every neighbourhood participates in reducing fashion waste.
        </p>
      </section>

      {/* ── Values ── */}
      <section className="values-section">
        <div style={{ textAlign: 'center' }}>
          <span className="section-eyebrow reveal">What drives us</span>
          <h2 className="reveal reveal-delay-1">Our Values</h2>
        </div>
        <div className="values-grid">
          <div className="value-card reveal">
            <div className="value-icon">♻️</div>
            <h3>Sustainability</h3>
            <p>Every item passed on is one less item in landfill. We measure success in clothes saved, not sold.</p>
          </div>
          <div className="value-card reveal reveal-delay-1">
            <div className="value-icon">🤝</div>
            <h3>Community First</h3>
            <p>Re-Wear BH works because neighbours trust neighbours. We keep it local, personal, and human.</p>
          </div>
          <div className="value-card reveal reveal-delay-2">
            <div className="value-icon">💚</div>
            <h3>Zero Barriers</h3>
            <p>No money changes hands. No sign-up fee. No catch. Giving should be as frictionless as possible.</p>
          </div>
          <div className="value-card reveal reveal-delay-3">
            <div className="value-icon">🇧🇭</div>
            <h3>Locally Rooted</h3>
            <p>Built in Bahrain, for Bahrain. Every neighbourhood from Muharraq to Riffa is part of this story.</p>
          </div>
        </div>
      </section>

      {/* ── How it works (detailed) ── */}
      <section className="how-it-works" style={{ background: 'var(--neutral-50)' }}>
        <span className="section-eyebrow reveal">The platform</span>
        <h2 className="reveal reveal-delay-1">How Re-Wear BH works</h2>
        <div className="steps-grid" style={{ marginTop: '2.5rem' }}>
          <div className="step-card reveal">
            <div className="step-number">1</div>
            <div className="step-icon">📸</div>
            <h3>List for Free</h3>
            <p>Sign up, get 100 Eco-Credits instantly. List any item — photo, category, condition, done. Your community can see it immediately.</p>
          </div>
          <div className="step-card reveal reveal-delay-1">
            <div className="step-number">2</div>
            <div className="step-icon">🌿</div>
            <h3>Earn Eco-Credits</h3>
            <p>Every time someone successfully picks up your item, you earn 30 Eco-Credits. Use them to claim items from others.</p>
          </div>
          <div className="step-card reveal reveal-delay-2">
            <div className="step-number">3</div>
            <div className="step-icon">🏆</div>
            <h3>Unlock Badges</h3>
            <p>Give enough and earn badges — Eco Starter, Green Giver, Sustainability Hero, and the ultimate: Bahrain Eco Champion.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section reveal">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', marginBottom: '1rem' }}>
          Be part of the movement
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          Join the growing community of Bahrainis choosing circular fashion over fast fashion.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/sign-up" className="btn btn-primary btn-lg">Join Re-Wear BH — Free</Link>
          <Link to="/browse" className="btn btn-secondary btn-lg">Browse Items</Link>
        </div>
      </section>
    </>
  )
}
