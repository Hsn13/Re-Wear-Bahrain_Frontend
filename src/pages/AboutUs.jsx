import { Link } from 'react-router'
import { useTranslation } from '../i18n'

export default function AboutUs() {
  const { t } = useTranslation()

  return (
    <div className="about-page">
      <section className="about-hero">
        <span className="section-eyebrow">{t('about.eyebrow')}</span>
        <h1>{t('about.title')}</h1>
        <p>{t('about.body')}</p>
      </section>

      <section className="values-section">
        <div className="section-heading">
          <span className="section-eyebrow">{t('about.valuesEyebrow')}</span>
          <h2>{t('about.valuesTitle')}</h2>
        </div>
        <div className="values-grid">
          {[1, 2, 3, 4].map(number => (
            <article className="value-card" key={number}>
              <span className="value-card-number">0{number}</span>
              <h3>{t(`about.value${number}Title`)}</h3>
              <p>{t(`about.value${number}Body`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-promise">
        <p>{t('policy.intro')}</p>
        <Link to="/guidelines" className="btn btn-secondary">{t('nav.guidelines')}</Link>
      </section>
    </div>
  )
}
