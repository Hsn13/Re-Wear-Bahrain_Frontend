import { useState } from 'react'
import api from '../services/api'
import { useTranslation } from '../i18n'

export default function AccountVerification({ user, onUserUpdate }) {
  const { t } = useTranslation()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function sendCode() {
    setError('')
    setBusy(true)
    try {
      await api.post('/auth/phone/send-code', { phoneNumber })
      setCodeSent(true)
    } catch (err) {
      setError(err.response?.data?.err || t('auth.error'))
    } finally {
      setBusy(false)
    }
  }

  async function verifyPhone() {
    setError('')
    setBusy(true)
    try {
      const response = await api.post('/auth/phone/verify-code', { phoneNumber, code })
      localStorage.setItem('token', response.data.token)
      onUserUpdate(response.data.user)
    } catch (err) {
      setError(err.response?.data?.err || t('auth.error'))
    } finally {
      setBusy(false)
    }
  }

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

  if (user.phoneVerifiedAt && user.adultConfirmedAt) return null

  return (
    <section className="verification-panel">
      <div>
        <span className="section-eyebrow">{t('dashboard.safetyLabel')}</span>
        <h2>{t('dashboard.verificationTitle')}</h2>
        <p>{t('dashboard.phoneRequired')}</p>
      </div>
      {!user.phoneVerifiedAt && (
        <div className="verification-actions">
          <label className="form-group">
            <span className="form-label">{t('auth.phone')}</span>
            <input className="form-input" type="tel" dir="ltr" inputMode="tel" autoComplete="tel"
              placeholder="+973 3XXX XXXX" value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} />
          </label>
          {!codeSent && <button type="button" className="btn btn-secondary" onClick={sendCode} disabled={busy || !phoneNumber}>
            {busy ? t('auth.sendingCode') : t('auth.sendCode')}
          </button>}
          {codeSent && (
            <div className="verification-code-row">
              <label className="form-group">
                <span className="form-label">{t('auth.code')}</span>
                <input className="form-input" dir="ltr" inputMode="numeric" autoComplete="one-time-code"
                  value={code} onChange={event => setCode(event.target.value)} />
              </label>
              <button type="button" className="btn btn-primary" onClick={verifyPhone} disabled={busy || !code}>
                {busy ? t('auth.verifying') : t('auth.verifyCode')}
              </button>
            </div>
          )}
        </div>
      )}
      {user.phoneVerifiedAt && !user.adultConfirmedAt && (
        <div className="verification-actions">
          <label className="truth-confirmation">
            <input type="checkbox" checked={adultConfirmed} onChange={event => setAdultConfirmed(event.target.checked)} />
            <span>{t('auth.ageConfirm')}</span>
          </label>
          <button type="button" className="btn btn-primary" onClick={confirmAge} disabled={busy || !adultConfirmed}>
            {t('auth.confirmAge')}
          </button>
        </div>
      )}
      {error && <p className="error-msg" role="alert">{error}</p>}
    </section>
  )
}
