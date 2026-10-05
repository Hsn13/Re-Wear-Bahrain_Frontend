import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Logo from '../components/Logo'
import api from '../services/api'
import { useTranslation } from '../i18n'

function SignIn({ setUser }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    setSubmitting(true)
    try {
      const response = await api.post('/auth/sign-in', formData)
      const token = response.data.token
      const user = JSON.parse(atob(token.split('.')[1])).payload
      localStorage.setItem('token', token)
      setUser(user)
      navigate('/dashboard')
    } catch (error) {
      setServerError(error.response?.data?.err || t('auth.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand"><Logo iconSize={44} textSize="lg" /></div>
        <h1>{t('auth.signinTitle')}</h1>
        <p className="auth-subtitle">{t('auth.signinBody')}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">{t('auth.username')}</label>
            <input className="form-input" id="username" name="username" autoComplete="username"
              value={formData.username} onChange={event => setFormData(previous => ({ ...previous, username: event.target.value }))}
              required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">{t('auth.password')}</label>
            <input className="form-input" id="password" name="password" type="password" autoComplete="current-password"
              value={formData.password} onChange={event => setFormData(previous => ({ ...previous, password: event.target.value }))}
              required />
          </div>
          {serverError && <p className="error-msg" role="alert">{serverError}</p>}
          <button className="btn btn-primary btn-full form-submit" type="submit" disabled={submitting}>
            {submitting ? t('auth.signingin') : t('auth.signin')}
          </button>
        </form>
        <p className="auth-footer">{t('auth.noAccount')} <Link to="/sign-up">{t('auth.signupLink')}</Link></p>
      </div>
    </div>
  )
}

export default SignIn
