import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Logo from '../components/Logo'
import { NEIGHBORHOOD_GROUPS, localizedNeighborhood } from '../constants/neighborhoods'
import api from '../services/api'
import { useTranslation } from '../i18n'

function Signup() {
  const { t, language } = useTranslation()
  const [formData, setFormData] = useState({
    username: '', password: '', neighborhood: '', customNeighborhood: '',
    phoneNumber: '', code: '', phoneProof: ''
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [created, setCreated] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validateField(name) {
    const val = formData[name]
    let msg = ''
    if (name === 'username') {
      if (!val.trim()) msg = t('auth.usernameRequired')
      else if (val.length < 3) msg = t('auth.usernameMin')
      else if (val.length > 30) msg = t('auth.usernameMax')
      else if (!/^[a-zA-Z0-9_]+$/.test(val)) msg = t('auth.usernameChars')
    }
    if (name === 'password') {
      if (!val) msg = t('auth.passwordRequired')
      else if (val.length < 12) msg = t('auth.passwordHint')
    }
    if (name === 'neighborhood') {
      if (!val) msg = t('auth.selectArea')
    }
    if (name === 'customNeighborhood' && formData.neighborhood === 'Other') {
      if (!val.trim()) msg = t('auth.customAreaRequired')
    }
    setErrors(prev => ({ ...prev, [name]: msg }))
    return !msg
  }

  function validateAll() {
    const fields = ['username', 'password', 'neighborhood']
    if (formData.neighborhood === 'Other') fields.push('customNeighborhood')
    const results = fields.map(f => validateField(f))
    return results.every(Boolean)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    if (!validateAll() || !formData.phoneProof || !adultConfirmed) return
    setSubmitting(true)
    try {
      await api.post('/auth/sign-up', {
        username: formData.username.trim(),
        password: formData.password,
        neighborhood: formData.neighborhood,
        customNeighborhood: formData.neighborhood === 'Other' ? formData.customNeighborhood.trim() : undefined,
        phoneProof: formData.phoneProof,
        adultConfirmed
      })
      setCreated(true)
    } catch (err) {
      setServerError(err.response?.data?.err || t('auth.error'))
    } finally {
      setSubmitting(false)
    }
  }

  async function sendCode() {
    setServerError('')
    setSendingCode(true)
    try {
      await api.post('/auth/phone/send-code', { phoneNumber: formData.phoneNumber })
      setCodeSent(true)
    } catch (err) {
      setServerError(err.response?.data?.err || t('auth.error'))
    } finally {
      setSendingCode(false)
    }
  }

  async function verifyCode() {
    setServerError('')
    setVerifyingCode(true)
    try {
      const response = await api.post('/auth/phone/verify-code', {
        phoneNumber: formData.phoneNumber,
        code: formData.code
      })
      setFormData(previous => ({ ...previous, phoneProof: response.data.phoneProof }))
    } catch (err) {
      setServerError(err.response?.data?.err || t('auth.error'))
    } finally {
      setVerifyingCode(false)
    }
  }

  if (created) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <Logo iconSize={44} textSize="lg" />
          <h1>{t('auth.createdTitle')}</h1>
          <p className="auth-subtitle">{t('auth.createdBody')}</p>
          <button type="button" className="btn btn-primary btn-full" onClick={() => navigate('/sign-in')}>
            {t('auth.signin')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand"><Logo iconSize={44} textSize="lg" /></div>
        <h1>{t('auth.signupTitle')}</h1>
        <p className="auth-subtitle">{t('auth.signupBody')}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">{t('auth.username')}</label>
            <input
              className={`form-input${errors.username ? ' form-input-error' : ''}`}
              id="username" name="username" type="text"
              value={formData.username} onChange={handleChange}
              onBlur={() => validateField('username')}
              placeholder={t('auth.usernameExample')}
              autoComplete="username"
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">{t('auth.password')}</label>
            <input
              className={`form-input${errors.password ? ' form-input-error' : ''}`}
              id="password" name="password" type="password"
              value={formData.password} onChange={handleChange}
              onBlur={() => validateField('password')}
              placeholder={t('auth.passwordHint')}
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="phone-verification">
            <div className="form-group">
              <label className="form-label" htmlFor="phoneNumber">{t('auth.phone')}</label>
              <input className="form-input" id="phoneNumber" name="phoneNumber" type="tel"
                autoComplete="tel" inputMode="tel" dir="ltr" placeholder="+973 3XXX XXXX"
                value={formData.phoneNumber} onChange={handleChange} disabled={Boolean(formData.phoneProof)} required />
              <span className="form-hint">{t('auth.phoneHint')}</span>
            </div>
            {!formData.phoneProof && (
              <button type="button" className="btn btn-secondary btn-full" onClick={sendCode}
                disabled={sendingCode || !formData.phoneNumber}>
                {sendingCode ? t('auth.sendingCode') : t('auth.sendCode')}
              </button>
            )}
            {codeSent && !formData.phoneProof && (
              <div className="verification-code-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="code">{t('auth.code')}</label>
                  <input className="form-input" id="code" name="code" inputMode="numeric" autoComplete="one-time-code"
                    dir="ltr" value={formData.code} onChange={handleChange} required />
                </div>
                <button type="button" className="btn btn-primary" onClick={verifyCode}
                  disabled={verifyingCode || !formData.code}>
                  {verifyingCode ? t('auth.verifying') : t('auth.verifyCode')}
                </button>
              </div>
            )}
            {formData.phoneProof && <p className="verified-note">✓ {t('auth.phoneVerified')}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="neighborhood">{t('auth.neighborhood')}</label>
            <select
              className={`form-select${errors.neighborhood ? ' form-input-error' : ''}`}
              id="neighborhood" name="neighborhood"
              value={formData.neighborhood} onChange={handleChange}
              onBlur={() => validateField('neighborhood')}
            >
              <option value="">{t('auth.selectArea')}</option>
              {NEIGHBORHOOD_GROUPS.map(group => (
                <optgroup key={group.label} label={t(`governorate.${group.label.split(' ')[0].toLowerCase()}`)}>
                  {group.options.map(n => (
                    <option key={n} value={n}>{localizedNeighborhood(n, language)}</option>
                  ))}
                </optgroup>
              ))}
              <option value="Other">{t('auth.otherOption')}</option>
            </select>
            {errors.neighborhood && <span className="field-error">{errors.neighborhood}</span>}
          </div>

          {formData.neighborhood === 'Other' && (
            <div className="form-group">
              <label className="form-label" htmlFor="customNeighborhood">{t('auth.otherArea')}</label>
              <input
                className={`form-input${errors.customNeighborhood ? ' form-input-error' : ''}`}
                id="customNeighborhood" name="customNeighborhood" type="text"
                value={formData.customNeighborhood} onChange={handleChange}
                onBlur={() => validateField('customNeighborhood')}
                placeholder={t('auth.neighborhoodExample')}
              />
              {errors.customNeighborhood && (
                <span className="field-error">{errors.customNeighborhood}</span>
              )}
            </div>
          )}

          <label className="truth-confirmation auth-age-confirmation">
            <input type="checkbox" checked={adultConfirmed} onChange={event => setAdultConfirmed(event.target.checked)} />
            <span>{t('auth.adult')}</span>
          </label>
          {serverError && <p className="error-msg" role="alert">{serverError}</p>}

          <button
            className="btn btn-primary btn-full" type="submit"
            disabled={submitting || !formData.phoneProof || !adultConfirmed}
          >
            {submitting ? t('auth.creating') : t('auth.create')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth.haveAccount')} <Link to="/sign-in">{t('auth.signinLink')}</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
