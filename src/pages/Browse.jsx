import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import api from '../services/api'
import { NEIGHBORHOOD_GROUPS } from '../constants/neighborhoods'

const CATEGORIES = ['', 'tops', 'bottoms', 'dresses', 'outerwear', 'footwear', 'accessories', 'kids', 'other']
const LIMIT = 12

function getPageNumbers(current, total) {
  const delta = 2
  const range = []
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }
  if (range[0] > 2) range.unshift('…')
  if (range[0] > 1) range.unshift(1)
  if (range[range.length - 1] < total - 1) range.push('…')
  if (range[range.length - 1] < total) range.push(total)
  return range
}

function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems]     = useState([])
  const [total, setTotal]     = useState(0)
  const [page, setPage]       = useState(Number(searchParams.get('page')) || 1)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [filters, setFilters] = useState({
    neighborhood: searchParams.get('neighborhood') || '',
    category:     searchParams.get('category')     || '',
  })

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))
  const from = total === 0 ? 0 : (page - 1) * LIMIT + 1
  const to   = Math.min(page * LIMIT, total)

  useEffect(() => {
    fetchItems()
  }, [filters, page])

  async function fetchItems() {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit: LIMIT }
      if (filters.neighborhood) params.neighborhood = filters.neighborhood
      if (filters.category)     params.category     = filters.category
      const res = await api.get('/items', { params })
      setItems(res.data.items)
      setTotal(res.data.total)
    } catch {
      setError('Could not load items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleFilter(e) {
    const { name, value } = e.target
    const next = { ...filters, [name]: value }
    setFilters(next)
    setPage(1)
    const params = {}
    if (next.neighborhood) params.neighborhood = next.neighborhood
    if (next.category)     params.category = next.category
    setSearchParams(params)
  }

  function clearFilters() {
    setFilters({ neighborhood: '', category: '' })
    setPage(1)
    setSearchParams({})
  }

  function goToPage(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFilters = filters.neighborhood || filters.category

  return (
    <div className="page-container browse-page">
      <h1>Browse Items</h1>

      {/* ── Filters ── */}
      <div className="browse-filters">
        <div className="filter-group">
          <label htmlFor="neighborhood">Area</label>
          <select id="neighborhood" name="neighborhood"
            value={filters.neighborhood} onChange={handleFilter}>
            <option value="">All areas</option>
            {NEIGHBORHOOD_GROUPS.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </optgroup>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category"
            value={filters.category} onChange={handleFilter}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All categories'}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            Clear filters
          </button>
        )}

        {!loading && (
          <span className="filter-results">
            {total === 0 ? 'No items' : `${total} available`}
          </span>
        )}
      </div>

      {/* ── States ── */}
      {loading && <p className="loading-msg">Loading items…</p>}
      {error   && <p className="error-msg">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">👗</div>
          <p>No items found. Try a different filter or{' '}
            <Link to="/items/new">list one yourself!</Link>
          </p>
        </div>
      )}

      {/* ── Grid ── */}
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
              <p className="item-card-meta">
                {item.category} · {item.size || '—'} · {item.condition}
              </p>
              <div className="item-card-footer">
                <span className="item-card-location">
                  📍 {item.location?.customNeighborhood || item.location?.neighborhood}
                </span>
                <span className="item-card-credits">🌿 {item.ecoCreditsPrice}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <p className="pagination-info">
            Showing {from}–{to} of {total} items
          </p>
          <div className="pagination-controls">
            <button className="page-btn page-btn-nav"
              onClick={() => goToPage(page - 1)} disabled={page === 1}>
              ← Prev
            </button>

            {getPageNumbers(page, totalPages).map((p, i) =>
              p === '…'
                ? <span key={`e${i}`} className="page-ellipsis">…</span>
                : (
                  <button
                    key={p}
                    className={`page-btn${page === p ? ' page-btn-active' : ''}`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                )
            )}

            <button className="page-btn page-btn-nav"
              onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Browse
