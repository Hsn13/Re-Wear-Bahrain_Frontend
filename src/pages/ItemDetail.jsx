import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import api from '../services/api'

const CONDITION_LABEL = { 'new': 'New', 'like-new': 'Like New', 'good': 'Good', 'fair': 'Fair' }

function ItemDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [pickupNotes, setPickupNotes] = useState('')

  useEffect(() => {
    api.get(`/items/${id}`)
      .then(res => setItem(res.data.item))
      .catch(() => setError('Item not found'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleRequest(e) {
    e.preventDefault()
    setRequesting(true)
    setError('')
    try {
      await api.post('/swaps', { itemId: id, pickupNotes })
      setRequestSuccess(true)
      setItem(prev => ({ ...prev, status: 'pending' }))
    } catch (err) {
      setError(err.response?.data?.err || 'Could not submit request')
    } finally {
      setRequesting(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this listing?')) return
    try {
      await api.delete(`/items/${id}`)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.err || 'Could not delete item')
    }
  }

  if (loading) return <p className="loading-msg">Loading...</p>
  if (error && !item) return <p className="error-msg" style={{ margin: '2rem auto', maxWidth: 600 }}>{error}</p>
  if (!item) return null

  const isOwner  = user && item.owner._id === user._id
  const canRequest = user && !isOwner && item.status === 'available'
  const statusClass = `item-status-badge status-${item.status}`

  return (
    <div className="page-container item-detail">
      {item.images?.[0] && (
        <img src={item.images[0]} alt={item.title} className="item-detail-img" />
      )}

      <div className="item-detail-header">
        <h1>{item.title}</h1>

        <div className="item-pills">
          <span className="pill pill-neutral">{item.category}</span>
          {item.size && <span className="pill pill-neutral">Size {item.size}</span>}
          <span className="pill pill-neutral">{CONDITION_LABEL[item.condition]}</span>
          <span className="pill pill-green">📍 {item.location?.neighborhood}</span>
        </div>
      </div>

      <div className="item-credits-banner">
        <span className="credits-number">🌿 {item.ecoCreditsPrice}</span>
        <span className="credits-label">Eco-Credits to claim this item</span>
      </div>

      {item.description && <p className="item-description">{item.description}</p>}

      <p className="item-owner-line">
        Listed by <strong>{item.owner?.username}</strong> · {item.owner?.location?.neighborhood}
      </p>

      <span className={statusClass}>{item.status}</span>

      {error && <p className="error-msg">{error}</p>}

      {requestSuccess && (
        <p className="success-msg">
          Request sent! The owner will approve a pickup time. Check your <Link to="/dashboard">Dashboard</Link>.
        </p>
      )}

      {canRequest && !requestSuccess && (
        <div className="request-form">
          <h3>Request this item</h3>
          <form onSubmit={handleRequest}>
            <div className="form-group">
              <label className="form-label" htmlFor="pickupNotes">Message to owner</label>
              <textarea
                className="form-textarea"
                id="pickupNotes"
                rows={3}
                value={pickupNotes}
                onChange={e => setPickupNotes(e.target.value)}
                placeholder="e.g. I'm free on weekends near Juffair…"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={requesting}>
              {requesting ? 'Sending…' : `Request Item · costs ${item.ecoCreditsPrice} credits`}
            </button>
          </form>
        </div>
      )}

      {!user && item.status === 'available' && (
        <p className="success-msg" style={{ marginTop: '1.5rem' }}>
          <Link to="/sign-in">Sign in</Link> to request this item.
        </p>
      )}

      {isOwner && (
        <div className="owner-actions">
          <span className="owner-label">This is your listing</span>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete Listing</button>
        </div>
      )}
    </div>
  )
}

export default ItemDetail
