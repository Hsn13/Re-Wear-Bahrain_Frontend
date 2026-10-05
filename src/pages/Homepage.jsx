import { useEffect } from 'react'
import { Link } from 'react-router'
import { useTranslation } from '../i18n'

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('revealed'))
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

export default function Homepage() {
  const { t } = useTranslation()
  useScrollReveal()

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow hero-animate">{t('home.eyebrow')}</span>
          <h1 className="hero-animate hero-animate-1">{t('home.title')}</h1>
          <p className="hero-sub hero-animate hero-animate-2">{t('home.subtitle')}</p>
          <div className="hero-actions hero-animate hero-animate-3">
            <Link to="/browse" className="btn btn-primary btn-lg">{t('home.discover')}</Link>
            <Link to="/sign-up" className="btn btn-secondary btn-lg">{t('home.join')}</Link>
          </div>
        </div>
        <div className="hero-art hero-animate hero-animate-2" aria-hidden="true">
          <div className="hero-art-orbit orbit-one" />
          <div className="hero-art-orbit orbit-two" />
          <div className="hero-art-sun" />
          <div className="hero-garment">
            <span className="garment-label">{t('home.garmentLabel')}</span>
            <span className="garment-stitch" />
          </div>
          <div className="hero-art-caption">{t('home.artCaption')}</div>
        </div>
        <div className="hero-footnote">
          <span className="hero-footnote-mark">BH</span>
          <span>{t('home.trust')}</span>
        </div>
      </section>

      <section className="editorial-section community-intro">
        <div className="editorial-index reveal">01 / {t('home.communityLabel')}</div>
        <div className="editorial-content reveal reveal-delay-1">
          <h2>{t('home.communityTitle')}</h2>
          <p>{t('home.communityBody')}</p>
          <Link className="text-link" to="/about">{t('nav.about')} <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="community-stamp reveal reveal-delay-2" aria-hidden="true">
          <span>{t('home.stampLabel')}</span>
          <span>{t('home.stampSub')}</span>
          <b>R</b>
        </div>
      </section>

      <section className="exchange-section">
        <div className="section-heading reveal">
          <span className="section-eyebrow">{t('home.exchangeLabel')}</span>
          <h2>{t('home.exchangeTitle')}</h2>
          <p>{t('home.exchangeBody')}</p>
        </div>
        <div className="steps-grid">
          {[1, 2, 3].map((number, index) => (
            <article className={`step-card reveal reveal-delay-${index + 1}`} key={number}>
              <span className="step-number">0{number}</span>
              <div className="step-rule" />
              <h3>{t(`home.step${number}Title`)}</h3>
              <p>{t(`home.step${number}Body`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-heading reveal">
          <span className="section-eyebrow">{t('home.trustLabel')}</span>
          <h2>{t('home.trustTitle')}</h2>
        </div>
        <div className="trust-grid">
          {[1, 2, 3].map((number, index) => (
            <article className={`trust-card reveal reveal-delay-${index + 1}`} key={number}>
              <span className="trust-card-number">0{number}</span>
              <h3>{t(`home.trust${number}Title`)}</h3>
              <p>{t(`home.trust${number}Body`)}</p>
            </article>
          ))}
        </div>
        <Link className="trust-policy-link" to="/guidelines">{t('nav.guidelines')} <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="bahrain-section">
        <div className="bahrain-copy reveal">
          <span className="section-eyebrow">{t('home.bahrainEyebrow')}</span>
          <h2>{t('home.areaTitle')}</h2>
          <p>{t('home.areaBody')}</p>
          <Link to="/browse" className="btn btn-light">{t('home.discover')}</Link>
        </div>
        <div className="bahrain-mark" aria-hidden="true">{t('home.bahrainMark')}<br /><span>BAHRAIN</span></div>
      </section>

      <section className="cta-section reveal">
        <span className="section-eyebrow">{t('home.finalEyebrow')}</span>
        <h2>{t('home.finalTitle')}</h2>
        <p>{t('home.finalBody')}</p>
        <div className="hero-actions">
          <Link to="/sign-up" className="btn btn-primary btn-lg">{t('home.join')}</Link>
          <Link to="/browse" className="btn btn-secondary btn-lg">{t('home.discover')}</Link>
        </div>
      </section>
    </div>
  )
}
