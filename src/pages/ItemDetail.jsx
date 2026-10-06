import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import api from '../services/api'
import BackButton from '../components/BackButton'
import { localizedNeighborhood } from '../constants/neighborhoods'
import { useTranslation } from '../i18n'

const Map = lazy(() => import('../components/Map'))

function ItemDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, language } = useTranslation()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [pickupNotes, setPickupNotes] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/items/${id}`)
      .then(response => setItem(response.data.item))
      .catch(error => setError(error.response?.data?.err || t('browse.error')))
      .finally(() => setLoading(false))
  }, [id, t])

  async function handleRequest(event) {
    event.preventDefault()
    setError('')
    setRequesting(true)
    try {
      await api.post('/swaps', { itemId: id, pickupNotes })
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.err || t('auth.error'))
    } finally {
      setRequesting(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(t('item.deleteConfirm'))) return
    setError('')
    try {
      await api.delete(`/items/${id}`)
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.err || t('auth.error'))
    }
  }

  if (loading) return <p className="loading-msg page-feedback">{t('status.loading')}</p>
  if (error && !item) return <p className="error-msg page-feedback" role="alert">{error}</p>
  if (!item) return null

  const isOwner = Boolean(user && item.owner?._id === user._id)
  const isDemo = Boolean(item.isDemo || item.owner?.isDemo)
  const canRequest = Boolean(user && user.adultConfirmedAt && !isOwner && item.status === 'available' && !isDemo)
  const privatePickup = item.pickupLocation
  const pickupCoordinates = privatePickup?.coordinates || item.location?.coordinates
  const pickupLabel = privatePickup
    ? `${t('item.exactPickup')} · ${privatePickup.address}`
    : t('item.pickupArea')

  return (
    <main className="page-container item-detail">
      <BackButton fallback="/browse" />
      <article className="item-detail-card">
        <div className="item-detail-media">
          {item.images?.[0]
            ? <img src={item.images[0]} alt={item.title} className="item-detail-img" />
            : <div className="item-detail-placeholder" aria-hidden="true">◌</div>}
          {(isDemo || item.owner?.isDemo) && <span className="demo-listing-badge">{t('browse.demo')}</span>}
        </div>

        <div className="item-detail-content">
          <div className="item-detail-topline">
            <span className={`item-status-badge status-${item.status}`}>{t(`item.status.${item.status}`)}</span>
            <span className="item-detail-location">
              {localizedNeighborhood(item.location?.neighborhood, language)}
            </span>
          </div>
          <h1>{item.title}</h1>
          <div className="item-pills">
            <span className="pill pill-neutral">{t(`category.${item.category}`)}</span>
            {item.size && <span className="pill pill-neutral">{t('item.size')} {item.size}</span>}
            <span className="pill pill-neutral">{t(`condition.${item.condition}`)}</span>
          </div>
          <div className="item-credits-banner">
            <span className="credits-number">◈ {item.ecoCreditsPrice}</span>
            <span className="credits-label">{t('list.credits')}</span>
          </div>
          {item.description && <p className="item-description">{item.description}</p>}
          <p className="item-owner-line">{t('item.owner', { name: item.owner?.username || t('item.member') })}</p>

          {isDemo && <p className="demo-notice">{t('item.demoNotice')}</p>}
          {pickupCoordinates && (
            <Suspense fallback={<p className="loading-msg">{t('status.loading')}</p>}>
              <Map coordinates={pickupCoordinates} label={pickupLabel} />
            </Suspense>
          )}
          {!privatePickup && <p className="privacy-note">{t('item.privateUntilApproval')}</p>}

          {error && <p className="error-msg" role="alert">{error}</p>}
          {canRequest && (
            <section className="request-form">
              <h2>{t('item.request')}</h2>
              <p className="form-hint">{t('item.requestHint')}</p>
              <form onSubmit={handleRequest}>
                <div className="form-group">
                  <label className="form-label" htmlFor="pickupNotes">{t('item.message')}</label>
                  <textarea id="pickupNotes" className="form-textarea" rows={3} minLength={10}
                    maxLength={500} value={pickupNotes} onChange={event => setPickupNotes(event.target.value)}
                    placeholder={t('item.messagePlaceholder')} required />
                </div>
                <button className="btn btn-primary" type="submit" disabled={requesting || pickupNotes.trim().length < 10}>
                  {requesting ? t('item.requesting') : t('item.requestButton', { count: item.ecoCreditsPrice })}
                </button>
              </form>
            </section>
          )}

          {!user && item.status === 'available' && !isDemo && (
            <p className="privacy-note"><Link to="/sign-in">{t('item.signinToRequest')}</Link></p>
          )}
          {user && !isOwner && item.status === 'available' && !user.adultConfirmedAt && (
            <p className="privacy-note">{t('dashboard.adultRequired')} <Link to="/dashboard">{t('dashboard.confirmAge')}</Link></p>
          )}
          {isOwner && (
            <div className="owner-actions">
              <span className="owner-label">{t('item.yourListing')}</span>
              <div className="owner-action-buttons">
                {item.status === 'available' && <Link className="btn btn-secondary btn-sm" to={`/items/${id}/edit`}>{t('item.edit')}</Link>}
                {item.status === 'available' && <button className="btn btn-ghost btn-sm" onClick={handleDelete}>{t('item.delete')}</button>}
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  )
}

export default ItemDetail
