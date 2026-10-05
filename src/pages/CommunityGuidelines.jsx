import { useEffect, useState } from 'react'
import api from '../services/api'
import { useTranslation } from '../i18n'

const groups = ['apparel', 'footwear', 'accessories', 'kids', 'other']
const conditions = ['fair', 'good', 'like-new', 'new']

function CommunityGuidelines() {
  const { t } = useTranslation()
  const [bands, setBands] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/policy/credits')
      .then(response => setBands(response.data.bands))
      .catch(() => setError(t('guidelines.loadError')))
  }, [t])

  return (
    <main className="guidelines-page">
      <header className="guidelines-hero">
        <span className="section-eyebrow">{t('policy.eyebrow')}</span>
        <h1>{t('policy.title')}</h1>
        <p>{t('policy.intro')}</p>
      </header>

      <div className="guidelines-content">
        <section className="guideline-section">
          <span className="guideline-index">01</span>
          <div>
            <h2>{t('policy.listTitle')}</h2>
            <ul>
              {[1, 2, 3, 4].map(number => <li key={number}>{t(`policy.list${number}`)}</li>)}
            </ul>
          </div>
        </section>

        <section className="guideline-section">
          <span className="guideline-index">02</span>
          <div>
            <h2>{t('policy.swapTitle')}</h2>
            <ul>
              {[1, 2, 3, 4].map(number => <li key={number}>{t(`policy.swap${number}`)}</li>)}
            </ul>
          </div>
        </section>

        <section className="guideline-section">
          <span className="guideline-index">03</span>
          <div>
            <h2>{t('policy.reportTitle')}</h2>
            <p>{t('policy.reportBody')}</p>
          </div>
        </section>

        <section className="guideline-section credit-policy-section">
          <span className="guideline-index">04</span>
          <div>
            <h2>{t('policy.creditsTitle')}</h2>
            <p>{t('policy.creditsIntro')}</p>
            {error && <p className="error-msg" role="alert">{error}</p>}
            {!bands && !error && <p className="loading-msg">{t('status.loading')}</p>}
            {bands && (
              <div className="credit-band-grid">
                {groups.map(group => (
                  <article className="credit-band-card" key={group}>
                    <h3>{t(`creditGroup.${group}`)}</h3>
                    {conditions.map(condition => (
                      <p key={condition}>
                        <span>{t(`condition.${condition}`)}</span>
                        <strong>{bands[group][condition][0]}–{bands[group][condition][1]} ◈</strong>
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            )}
            <p className="policy-note">{t('policy.creditsNote')}</p>
          </div>
        </section>

        <section className="guideline-legal-note">
          <span className="guideline-index">05</span>
          <div>
            <h2>{t('policy.termsTitle')}</h2>
            <p>{t('policy.termsBody')}</p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default CommunityGuidelines
