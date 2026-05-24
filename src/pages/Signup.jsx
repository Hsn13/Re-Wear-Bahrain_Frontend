import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router'
import Logo from '../components/Logo'

const NEIGHBORHOODS = [
  'Manama', 'Juffair', 'Adliya', 'Seef', 'Sanabis', 'Tubli',
  'Muharraq', 'Hidd', 'Amwaj Islands',
  'Riffa', 'Isa Town', 'Hamad Town', 'Saar', 'Budaiya',
  "Zinj", "Salmaniya", "A'ali", 'Sitra', 'Other'
]

function Signup() {
  const [formData, setFormData] = useState({ username: '', password: '', neighborhood: 'Manama' })
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/sign-up`, formData)
      navigate('/sign-in')
    } catch (err) {
      setErrorMessage(err.response?.data?.err || 'An error occurred during sign up')
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input className="form-input" id="username" name="username" type="text"
              value={formData.username} onChange={handleChange} required placeholder="e.g. ali_juffair" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-input" id="password" name="password" type="password"
              value={formData.password} onChange={handleChange} required placeholder="Min. 6 characters" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="neighborhood">Your Neighbourhood</label>
            <select className="form-select" id="neighborhood" name="neighborhood"
              value={formData.neighborhood} onChange={handleChange} required>
              {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {errorMessage && <p className="error-msg" role="alert">{errorMessage}</p>}

          <button className="btn btn-primary btn-full" type="submit" style={{ marginTop: '0.5rem' }}>
            Sign Up
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
