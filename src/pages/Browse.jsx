import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router'
import api from '../services/api'
import { NEIGHBORHOOD_GROUPS, localizedNeighborhood } from '../constants/neighborhoods'
import { useTranslation } from '../i18n'

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
  const { t, language } = useTranslation()
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

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit: LIMIT }
      if (filters.neighborhood) params.neighborhood = filters.neighborhood
      if (filters.category)     params.category     = filters.category
      const res = await api.get('/items', { params })
      setItems(res.data.items)
      setTotal(res.data.total)
    } catch (error) {
      setError(error.response?.data?.err || t('browse.error'))
    } finally {
      setLoading(false)
    }
  }, [filters, page, t])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

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
      <header className="browse-heading">
        <div>
          <span className="section-eyebrow">{t('browse.eyebrow')}</span>
          <h1>{t('browse.title')}</h1>
          <p>{t('browse.subtitle')}</p>
        </div>
        {!loading && <span className="browse-result-count">{t('browse.available', { count: total })}</span>}
      </header>

      {/* ── Filters ── */}
      <div className="browse-filters">
        <div className="filter-group">
          <label htmlFor="neighborhood">{t('browse.area')}</label>
          <select id="neighborhood" name="neighborhood"
            value={filters.neighborhood} onChange={handleFilter}>
            <option value="">{t('browse.allAreas')}</option>
            {NEIGHBORHOOD_GROUPS.map(group => (
              <optgroup key={group.label} label={t(`governorate.${group.label.split(' ')[0].toLowerCase()}`)}>
                {group.options.map(n => (
                  <option key={n} value={n}>{localizedNeighborhood(n, language)}</option>
                ))}
              </optgroup>
            ))}
            <option value="Other">{localizedNeighborhood('Other', language)}</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category">{t('browse.category')}</label>
          <select id="category" name="category"
            value={filters.category} onChange={handleFilter}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c ? t(`category.${c}`) : t('browse.allCategories')}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            {t('browse.clear')}
          </button>
        )}

        {!loading && (
          <span className="filter-results">
            {total}
          </span>
        )}
      </div>

      {/* ── States ── */}
      {loading && <p className="loading-msg" role="status">{t('browse.loading')}</p>}
      {error   && <p className="error-msg">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">◌</div>
          <p>{t('browse.none')} <Link to="/items/new">{t('nav.list')}</Link></p>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="items-grid">
        {items.map(item => (
          <Link key={item._id} to={`/items/${item._id}`} className="item-card">
            {item.images?.[0]
              ? <img src={item.images[0]} alt={item.title} className="item-card-img" loading="lazy" />
              : (
                <div className="item-card-placeholder">
                  <span aria-hidden="true">◌</span>
                  <span>{t('item.noPhoto')}</span>
                </div>
              )
            }
            <div className="item-card-body">
              <p className="item-card-title">{item.title}</p>
              <p className="item-card-meta">
                {t(`category.${item.category}`)} · {item.size || '—'} · {t(`condition.${item.condition}`)}
              </p>
              <div className="item-card-footer">
                <span className="item-card-location">
                  {localizedNeighborhood(item.location?.customNeighborhood || item.location?.neighborhood, language)}
                </span>
                <span className="item-card-credits">◈ {t('item.credits', { count: item.ecoCreditsPrice })}</span>
              </div>
              {(item.isDemo || item.owner?.isDemo) && <span className="demo-listing-badge">{t('browse.demo')}</span>}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <p className="pagination-info">
            {from}–{to} / {total}
          </p>
          <div className="pagination-controls">
            <button className="page-btn page-btn-nav"
              onClick={() => goToPage(page - 1)} disabled={page === 1}>
              {t('browse.previous')}
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
              {t('browse.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Browse
