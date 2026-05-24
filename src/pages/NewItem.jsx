import { useState } from 'react'
import { useNavigate } from 'react-router'
import api from '../services/api'

const CATEGORIES = ['tops', 'bottoms', 'dresses', 'outerwear', 'footwear', 'accessories', 'kids', 'other']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Kids']
const CONDITIONS = [
  { value: 'new',      label: 'New (with tags)' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good',     label: 'Good' },
  { value: 'fair',     label: 'Fair' },
]

function NewItem() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'tops',
    size: 'M', condition: 'good', imageUrl: '', ecoCreditsPrice: 10,
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/items', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        ecoCreditsPrice: Number(formData.ecoCreditsPrice),
        images: formData.imageUrl ? [formData.imageUrl] : [],
      })
      navigate(`/items/${res.data.item._id}`)
    } catch (err) {
      setError(err.response?.data?.err || 'Could not create listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container-sm form-page">
      <h1>List an Item</h1>
      <p className="form-subtitle">
        Give it away and earn <strong>30 Eco-Credits</strong> when someone picks it up!
      </p>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title *</label>
            <input className="form-input" id="title" name="title" type="text"
              value={formData.title} onChange={handleChange} required placeholder="e.g. Blue linen shirt" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea className="form-textarea" id="description" name="description" rows={3}
              value={formData.description} onChange={handleChange}
              placeholder="Brand, fit notes, any wear marks…" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select className="form-select" id="category" name="category"
                value={formData.category} onChange={handleChange} required>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="size">Size</label>
              <select className="form-select" id="size" name="size"
                value={formData.size} onChange={handleChange}>
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="condition">Condition *</label>
              <select className="form-select" id="condition" name="condition"
                value={formData.condition} onChange={handleChange} required>
                {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ecoCreditsPrice">Credits to Claim</label>
              <input className="form-input" id="ecoCreditsPrice" name="ecoCreditsPrice"
                type="number" min={0} max={50} value={formData.ecoCreditsPrice} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="imageUrl">Photo URL</label>
            <input className="form-input" id="imageUrl" name="imageUrl" type="url"
              value={formData.imageUrl} onChange={handleChange} placeholder="https://…" />
            <span className="form-hint">Paste a direct image link (Cloudinary, Imgur, etc.)</span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="btn btn-primary btn-full" type="submit" disabled={submitting}
            style={{ marginTop: '0.5rem' }}>
            {submitting ? 'Publishing…' : '🌿 Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewItem
