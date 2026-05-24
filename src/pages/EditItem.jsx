import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import api from '../services/api'
import PhotoUpload from '../components/PhotoUpload'

const CATEGORIES = ['tops', 'bottoms', 'dresses', 'outerwear', 'footwear', 'accessories', 'kids', 'other']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Kids']
const CONDITIONS = [
  { value: 'new',      label: 'New (with tags)' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good',     label: 'Good' },
  { value: 'fair',     label: 'Fair' },
]

export default function EditItem() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(null)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/items/${id}`)
      .then(res => {
        const item = res.data.item
        setFormData({
          title:           item.title || '',
          description:     item.description || '',
          category:        item.category || 'tops',
          size:            item.size || 'M',
          condition:       item.condition || 'good',
          imageUrl:        item.images?.[0] || '',
          ecoCreditsPrice: item.ecoCreditsPrice ?? 10,
        })
      })
      .catch(() => setServerError('Could not load item'))
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validateField(name) {
    const val = String(formData[name] ?? '')
    let msg = ''
    if (name === 'title') {
      if (!val.trim()) msg = 'Title is required'
      else if (val.trim().length < 3) msg = 'Title must be at least 3 characters'
      else if (val.trim().length > 100) msg = 'Title must be 100 characters or fewer'
    }
    if (name === 'ecoCreditsPrice') {
      const n = Number(val)
      if (isNaN(n) || n < 0 || n > 50) msg = 'Credits must be between 0 and 50'
    }
    if (name === 'imageUrl' && val && !/^https?:\/\/.+/.test(val)) {
      msg = 'Please enter a valid URL starting with http:// or https://'
    }
    setErrors(prev => ({ ...prev, [name]: msg }))
    return !msg
  }

  function validateAll() {
    return ['title', 'ecoCreditsPrice'].map(validateField).every(Boolean)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    if (!validateAll()) return
    setSubmitting(true)
    try {
      await api.patch(`/items/${id}`, {
        title:           formData.title.trim(),
        description:     formData.description.trim(),
        category:        formData.category,
        size:            formData.size,
        condition:       formData.condition,
        ecoCreditsPrice: Number(formData.ecoCreditsPrice),
        images:          formData.imageUrl ? [formData.imageUrl] : [],
      })
      navigate(`/items/${id}`)
    } catch (err) {
      setServerError(err.response?.data?.err || 'Could not save changes')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="loading-msg">Loading item…</p>
  if (!formData) return <p className="error-msg" style={{ margin: '2rem auto', maxWidth: 600 }}>{serverError || 'Item not found'}</p>

  return (
    <div className="page-container-sm form-page">
      <h1>Edit Listing</h1>
      <p className="form-subtitle">Update your item details below.</p>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title *</label>
            <input
              className={`form-input${errors.title ? ' form-input-error' : ''}`}
              id="title" name="title" type="text"
              value={formData.title} onChange={handleChange}
              onBlur={() => validateField('title')}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              className="form-textarea" id="description" name="description" rows={3}
              value={formData.description} onChange={handleChange}
              maxLength={500}
            />
            <span className="form-hint">{formData.description.length}/500 characters</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select className="form-select" id="category" name="category"
                value={formData.category} onChange={handleChange}>
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
                value={formData.condition} onChange={handleChange}>
                {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ecoCreditsPrice">Credits to Claim</label>
              <input
                className={`form-input${errors.ecoCreditsPrice ? ' form-input-error' : ''}`}
                id="ecoCreditsPrice" name="ecoCreditsPrice"
                type="number" min={0} max={50}
                value={formData.ecoCreditsPrice} onChange={handleChange}
                onBlur={() => validateField('ecoCreditsPrice')}
              />
              {errors.ecoCreditsPrice && (
                <span className="field-error">{errors.ecoCreditsPrice}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Photo</label>
            <PhotoUpload
              value={formData.imageUrl}
              onChange={url => setFormData(prev => ({ ...prev, imageUrl: url }))}
            />
          </div>

          {serverError && <p className="error-msg" role="alert">{serverError}</p>}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => navigate(`/items/${id}`)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
