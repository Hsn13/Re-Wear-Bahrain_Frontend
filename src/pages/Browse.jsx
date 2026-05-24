import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import api from '../services/api'

const NEIGHBORHOODS = [
  '', 'Manama', 'Juffair', 'Adliya', 'Seef', 'Sanabis', 'Tubli',
  'Muharraq', 'Hidd', 'Amwaj Islands',
  'Riffa', 'Isa Town', 'Hamad Town', 'Saar', 'Budaiya',
  "Zinj", "Salmaniya", "A'ali", 'Sitra', 'Other'
]
const CATEGORIES = ['', 'tops', 'bottoms', 'dresses', 'outerwear', 'footwear', 'accessories', 'kids', 'other']

function Browse() {
  const [items, setItems]   = useState([])
  const [total, setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [filters, setFilters] = useState({ neighborhood: '', category: '' })

  useEffect(() => { fetchItems() }, [filters])

  async function fetchItems() {
    setLoading(true)
    try {
      const params = {}
      if (filters.neighborhood) params.neighborhood = filters.neighborhood
      if (filters.category)     params.category     = filters.category
      const res = await api.get('/items', { params })
      setItems(res.data.items)
      setTotal(res.data.total)
    } catch {
      setError('Could not load items')
    } finally {
      setLoading(false)
    }
  }

  function handleFilter(e) {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="page-container browse-page">
      <h1>Browse Items</h1>

      <div className="browse-filters">
        <div className="filter-group">
          <label htmlFor="neighborhood">Area</label>
          <select id="neighborhood" name="neighborhood" value={filters.neighborhood} onChange={handleFilter}>
            {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n || 'All areas'}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={filters.category} onChange={handleFilter}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All categories'}</option>)}
          </select>
        </div>
        <span className="filter-results">{total} available</span>
      </div>

      {loading && <p className="loading-msg">Loading items...</p>}
      {error   && <p className="error-msg">{error}</p>}

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👗</div>
          <p>No items found. Try a different filter or{' '}
            <Link to="/items/new">list one yourself!</Link>
          </p>
        </div>
      )}

      <div className="items-grid">
        {items.map(item => (
          <Link key={item._id} to={`/items/${item._id}`} className="item-card">
            {item.images?.[0]
              ? <img src={item.images[0]} alt={item.title} className="item-card-img" />
              : (
                <div className="item-card-placeholder">
                  <span>👗</span>
                  <span>No photo</span>
                </div>
              )
            }
            <div className="item-card-body">
              <p className="item-card-title">{item.title}</p>
              <p className="item-card-meta">{item.category} · {item.size || '—'} · {item.condition}</p>
              <div className="item-card-footer">
                <span className="item-card-location">📍 {item.location?.neighborhood}</span>
                <span className="item-card-credits">🌿 {item.ecoCreditsPrice}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Browse
