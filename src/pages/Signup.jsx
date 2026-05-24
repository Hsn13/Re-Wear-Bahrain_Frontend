import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router'
import Logo from '../components/Logo'
import { NEIGHBORHOOD_GROUPS } from '../constants/neighborhoods'

function Signup() {
  const [formData, setFormData] = useState({
    username: '', password: '', neighborhood: '', customNeighborhood: ''
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
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
      if (!val.trim()) msg = 'Username is required'
      else if (val.length < 3) msg = 'Must be at least 3 characters'
      else if (val.length > 30) msg = 'Must be 30 characters or fewer'
      else if (!/^[a-zA-Z0-9_]+$/.test(val)) msg = 'Only letters, numbers and underscores'
    }
    if (name === 'password') {
      if (!val) msg = 'Password is required'
      else if (val.length < 6) msg = 'Must be at least 6 characters'
    }
    if (name === 'neighborhood') {
      if (!val) msg = 'Please select your neighbourhood'
    }
    if (name === 'customNeighborhood' && formData.neighborhood === 'Other') {
      if (!val.trim()) msg = 'Please enter your neighbourhood name'
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
    if (!validateAll()) return
    setSubmitting(true)
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/sign-up`, {
        username: formData.username.trim(),
        password: formData.password,
        neighborhood: formData.neighborhood,
        customNeighborhood: formData.neighborhood === 'Other' ? formData.customNeighborhood.trim() : undefined,
      })
      navigate('/sign-in')
    } catch (err) {
      setServerError(err.response?.data?.err || 'An error occurred during sign up')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Logo iconSize={44} textSize="lg" />
        </div>

        <h1>Create Account</h1>
        <p className="auth-subtitle">
          You'll receive <strong>100 Eco-Credits</strong> to get started!
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              className={`form-input${errors.username ? ' form-input-error' : ''}`}
              id="username" name="username" type="text"
              value={formData.username} onChange={handleChange}
              onBlur={() => validateField('username')}
              placeholder="e.g. ali_juffair"
              autoComplete="username"
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className={`form-input${errors.password ? ' form-input-error' : ''}`}
              id="password" name="password" type="password"
              value={formData.password} onChange={handleChange}
              onBlur={() => validateField('password')}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="neighborhood">Your Neighbourhood</label>
            <select
              className={`form-select${errors.neighborhood ? ' form-input-error' : ''}`}
              id="neighborhood" name="neighborhood"
              value={formData.neighborhood} onChange={handleChange}
              onBlur={() => validateField('neighborhood')}
            >
              <option value="">— Select your area —</option>
              {NEIGHBORHOOD_GROUPS.map(group => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </optgroup>
              ))}
              <option value="Other">Other (not listed)</option>
            </select>
            {errors.neighborhood && <span className="field-error">{errors.neighborhood}</span>}
          </div>

          {formData.neighborhood === 'Other' && (
            <div className="form-group">
              <label className="form-label" htmlFor="customNeighborhood">Enter Your Area</label>
              <input
                className={`form-input${errors.customNeighborhood ? ' form-input-error' : ''}`}
                id="customNeighborhood" name="customNeighborhood" type="text"
                value={formData.customNeighborhood} onChange={handleChange}
                onBlur={() => validateField('customNeighborhood')}
                placeholder="e.g. Al Markh"
              />
              {errors.customNeighborhood && (
                <span className="field-error">{errors.customNeighborhood}</span>
              )}
            </div>
          )}

          {serverError && <p className="error-msg" role="alert">{serverError}</p>}

          <button
            className="btn btn-primary btn-full" type="submit"
            disabled={submitting} style={{ marginTop: '0.5rem' }}
          >
            {submitting ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
