import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router'
import Logo from '../components/Logo'

function SignIn({ setUser }) {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/sign-in`, formData)
      const token = res.data.token
      const userInfo = JSON.parse(atob(token.split('.')[1])).payload
      setUser(userInfo)
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch (err) {
      setErrorMessage(err.response?.data?.err || 'An error occurred during sign in')
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input className="form-input" id="username" name="username" type="text"
              value={formData.username} onChange={handleChange} required placeholder="Your username" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-input" id="password" name="password" type="password"
              value={formData.password} onChange={handleChange} required placeholder="Your password" />
          </div>

          {errorMessage && <p className="error-msg" role="alert">{errorMessage}</p>}

          <button className="btn btn-primary btn-full" type="submit" style={{ marginTop: '0.5rem' }}>
            Sign In
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
