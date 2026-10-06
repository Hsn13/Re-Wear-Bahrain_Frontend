import { useState } from 'react'
import api from '../services/api'
import { useTranslation } from '../i18n'

export default function AccountVerification({ user, onUserUpdate }) {
  const { t } = useTranslation()
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function confirmAge() {
    setError('')
    setBusy(true)
    try {
      const response = await api.patch('/users/me/adult-confirmation', { confirmed: true })
      localStorage.setItem('token', response.data.token)
      onUserUpdate(response.data.user)
    } catch (err) {
      setError(err.response?.data?.err || t('auth.error'))
    } finally {
      setBusy(false)
    }
  }

  if (user.adultConfirmedAt) return null

  return (
    <section className="verification-panel">
      <div>
        <span className="section-eyebrow">{t('dashboard.safetyLabel')}</span>
        <h2>{t('dashboard.verificationTitle')}</h2>
        <p>{t('dashboard.adultRequired')}</p>
      </div>
      <div className="verification-actions">
        <label className="truth-confirmation">
          <input type="checkbox" checked={adultConfirmed} onChange={event => setAdultConfirmed(event.target.checked)} />
          <span>{t('auth.ageConfirm')}</span>
        </label>
        <button type="button" className="btn btn-primary" onClick={confirmAge} disabled={busy || !adultConfirmed}>
          {busy ? t('auth.creating') : t('auth.confirmAge')}
        </button>
      </div>
      {error && <p className="error-msg" role="alert">{error}</p>}
    </section>
  )
}
