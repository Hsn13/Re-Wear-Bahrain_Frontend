import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router'
import Logo from '../components/Logo'

function SignIn({ setUser }) {
  const [formData, setFormData] = useState({ username: '', password: '' })
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
    if (name === 'username' && !val.trim()) msg = 'Username is required'
    if (name === 'password' && !val) msg = 'Password is required'
    setErrors(prev => ({ ...prev, [name]: msg }))
    return !msg
  }

  function validateAll() {
    const u = validateField('username')
    const p = validateField('password')
    return u && p
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setServerError('')
    if (!validateAll()) return
    setSubmitting(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/sign-in`, {
        username: formData.username.trim(),
        password: formData.password,
      })
      const token = res.data.token
      const userInfo = JSON.parse(atob(token.split('.')[1])).payload
      setUser(userInfo)
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.err || 'An error occurred during sign in')
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

        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Re-Wear BH account</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              className={`form-input${errors.username ? ' form-input-error' : ''}`}
              id="username" name="username" type="text"
              value={formData.username} onChange={handleChange}
              onBlur={() => validateField('username')}
              placeholder="Your username"
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
              placeholder="Your password"
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {serverError && <p className="error-msg" role="alert">{serverError}</p>}

          <button
            className="btn btn-primary btn-full" type="submit"
            disabled={submitting} style={{ marginTop: '0.5rem' }}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/sign-up">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
