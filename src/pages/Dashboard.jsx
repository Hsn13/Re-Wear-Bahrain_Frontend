import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import api from '../services/api'
import AccountVerification from '../components/AccountVerification'
import { useTranslation } from '../i18n'
import { localizedNeighborhood } from '../constants/neighborhoods'

function SwapCard({ swap, user, refresh }) {
  const { t, language } = useTranslation()
  const [messages, setMessages] = useState(swap.messages || [])
  const [messageText, setMessageText] = useState('')
  const [handoverCode, setHandoverCode] = useState('')
  const [enteredCode, setEnteredCode] = useState('')
  const [disputeReason, setDisputeReason] = useState('')
  const [showDispute, setShowDispute] = useState(false)
  const [review, setReview] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isOwner = String(swap.owner?._id) === String(user._id)
  const active = ['requested', 'approved', 'disputed'].includes(swap.status)
  const conversationOpen = !['completed', 'cancelled'].includes(swap.status)
  const item = swap.item
  const otherUser = isOwner ? swap.requester : swap.owner

  const loadMessages = useCallback(async () => {
    try {
      const response = await api.get(`/swaps/${swap._id}/messages`)
      setMessages(response.data.messages)
    } catch {
      setError(t('swap.messageLoadError'))
    }
  }, [swap._id, t])

  useEffect(() => {
    loadMessages()
    if (!conversationOpen) return undefined
    const timer = window.setInterval(loadMessages, 7000)
    return () => window.clearInterval(timer)
  }, [conversationOpen, loadMessages])

  useEffect(() => {
    if (swap.status !== 'completed') {
      setReviewLoading(false)
      return
    }
    api.get(`/swaps/${swap._id}/reviews`)
      .then(response => setReview(response.data))
      .catch(() => setError(t('swap.reviewLoadError')))
      .finally(() => setReviewLoading(false))
  }, [swap._id, swap.status, t])

  async function runAction(action, body = {}) {
    setError('')
    setBusy(true)
    try {
      const response = await api[action.method](action.path, body)
      if (response.data.handoverCode) setHandoverCode(response.data.handoverCode)
      await refresh()
      return response.data
    } catch (err) {
      setError(err.response?.data?.err || t('auth.error'))
      return null
    } finally {
      setBusy(false)
    }
  }

  async function sendMessage(event) {
    event.preventDefault()
    if (!messageText.trim()) return
    const response = await runAction({ method: 'post', path: `/swaps/${swap._id}/messages` }, { text: messageText.trim() })
    if (response?.message) {
      setMessages(previous => [...previous, response.message])
      setMessageText('')
    }
  }

  async function confirmHandover(event) {
    event.preventDefault()
    const response = await runAction(
      { method: 'post', path: `/swaps/${swap._id}/confirm-handover` },
      { code: enteredCode }
    )
    if (response) setEnteredCode('')
  }

  async function reportProblem(event) {
    event.preventDefault()
    const response = await runAction(
      { method: 'post', path: `/swaps/${swap._id}/dispute` },
      { reason: disputeReason }
    )
    if (response) setShowDispute(false)
  }

  async function submitReview(event) {
    event.preventDefault()
    const response = await runAction(
      { method: 'post', path: `/swaps/${swap._id}/reviews` },
      { rating, comment: reviewText }
    )
    if (response) setReview(response)
  }

  const dateLocale = language === 'ar' ? 'ar-BH' : 'en-BH'

  return (
    <article className={`swap-card swap-card-${swap.status}`}>
      <header className="swap-card-header">
        <div>
          <Link to={`/items/${item?._id}`} className="swap-card-title">{item?.title || t('swap.deletedItem')}</Link>
          <p className="swap-card-from">
            {isOwner ? t('swap.requestFrom', { name: otherUser?.username || '' })
              : t('swap.requestTo', { name: otherUser?.username || '' })}
          </p>
          <time className="swap-card-time" dateTime={swap.createdAt}>
            {new Date(swap.createdAt).toLocaleDateString(dateLocale)}
          </time>
        </div>
        <span className={`swap-status-badge swap-status-${swap.status}`}>{t(`swap.${swap.status}`)}</span>
      </header>

      {swap.status === 'disputed' && (
        <div className="swap-dispute-notice">
          <strong>{t('swap.disputeNotice')}</strong>
          {swap.disputeReason && <p>{swap.disputeReason}</p>}
        </div>
      )}

      {swap.status === 'approved' && item?.pickupLocation && (
        <section className="approved-pickup">
          <h3>{t('swap.pickupDetails')}</h3>
          <p><strong>{item.pickupLocation.address}</strong></p>
          {item.pickupLocation.instructions && <p>{item.pickupLocation.instructions}</p>}
          <p className="form-hint">{t('swap.pickupPrivate')}</p>
        </section>
      )}

      {swap.status === 'approved' && (
        <section className="handover-panel">
          <h3>{t('swap.handoverTitle')}</h3>
          {isOwner ? (
            <>
              <p>{t('swap.handoverOwner')}</p>
              {handoverCode
                ? <output className="handover-code" dir="ltr">{handoverCode}</output>
                : <button className="btn btn-secondary btn-sm" type="button"
                    onClick={() => runAction({ method: 'post', path: `/swaps/${swap._id}/refresh-handover-code` })} disabled={busy}>
                    {t('swap.refreshCode')}
                  </button>}
              {!swap.requesterConfirmedAt && <p className="form-hint">{t('swap.waitRequester')}</p>}
              <button className="btn btn-primary btn-sm" type="button"
                onClick={() => runAction({ method: 'post', path: `/swaps/${swap._id}/confirm-owner` })}
                disabled={busy || Boolean(swap.ownerConfirmedAt) || !swap.requesterConfirmedAt}>
                {swap.ownerConfirmedAt ? t('swap.confirmedByYou') : t('swap.confirmGiven')}
              </button>
            </>
          ) : (
            <>
              <p>{t('swap.handoverRequester')}</p>
              <form className="handover-code-form" onSubmit={confirmHandover}>
                <input className="form-input" dir="ltr" inputMode="numeric" autoComplete="one-time-code"
                  maxLength={8} pattern="[0-9]{8}" aria-label={t('swap.code')}
                  placeholder={t('swap.code')} value={enteredCode}
                  onChange={event => setEnteredCode(event.target.value.replace(/\D/g, ''))} required />
                <button className="btn btn-primary" type="submit" disabled={busy || enteredCode.length !== 8 || Boolean(swap.requesterConfirmedAt)}>
                  {swap.requesterConfirmedAt ? t('swap.confirmedByYou') : t('swap.confirmReceived')}
                </button>
              </form>
            </>
          )}
          {isOwner && swap.requesterConfirmedAt && <p className="form-hint">{t('swap.confirmedByOther')}</p>}
          {!isOwner && swap.ownerConfirmedAt && <p className="form-hint">{t('swap.confirmedByOther')}</p>}
        </section>
      )}

      {conversationOpen && (
        <section className="conversation-panel">
          <h3>{t('swap.conversation')}</h3>
          <div className="message-list" aria-live="polite">
            {messages.map((message, index) => (
              <article className={`conversation-message${String(message.sender?._id || message.sender) === String(user._id) ? ' message-mine' : ''}`}
                key={message._id || `${message.createdAt}-${index}`}>
                <span>{String(message.sender?._id || message.sender) === String(user._id) ? t('swap.you') : otherUser?.username}</span>
                <p>{message.text}</p>
                <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })}</time>
              </article>
            ))}
          </div>
          <form className="message-compose" onSubmit={sendMessage}>
            <textarea className="form-textarea" rows={2} maxLength={1000} value={messageText}
              onChange={event => setMessageText(event.target.value)} placeholder={t('swap.messagePlaceholder')} required />
            <button className="btn btn-primary btn-sm" type="submit" disabled={busy || !messageText.trim()}>{t('swap.send')}</button>
          </form>
        </section>
      )}

      {active && swap.status !== 'disputed' && (
        <div className="swap-actions">
          {isOwner && swap.status === 'requested' && (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => runAction({ method: 'patch', path: `/swaps/${swap._id}/approve` })} disabled={busy}>
                {t('swap.approve')}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => runAction({ method: 'post', path: `/swaps/${swap._id}/cancel` })} disabled={busy}>
                {t('swap.decline')}
              </button>
            </>
          )}
          {!isOwner && swap.status === 'requested' && (
            <button className="btn btn-ghost btn-sm" onClick={() => runAction({ method: 'post', path: `/swaps/${swap._id}/cancel` })} disabled={busy}>
              {t('swap.cancel')}
            </button>
          )}
          {swap.status === 'approved' && (
            <button className="btn btn-danger btn-sm" type="button" onClick={() => setShowDispute(previous => !previous)}>
              {t('swap.dispute')}
            </button>
          )}
        </div>
      )}

      {showDispute && (
        <form className="swap-inline-form" onSubmit={reportProblem}>
          <label className="form-label" htmlFor={`dispute-${swap._id}`}>{t('swap.disputeReason')}</label>
          <textarea id={`dispute-${swap._id}`} className="form-textarea" minLength={10} maxLength={1000}
            value={disputeReason} onChange={event => setDisputeReason(event.target.value)} required />
          <button className="btn btn-danger btn-sm" type="submit" disabled={busy || disputeReason.trim().length < 10}>
            {t('swap.submitDispute')}
          </button>
        </form>
      )}

      {swap.status === 'completed' && review && !reviewLoading && !review.myReview && (
        <form className="review-form" onSubmit={submitReview}>
          <h3>{t('swap.reviewTitle')}</h3>
          <p className="form-hint">{t('swap.reviewHint')}</p>
          <label className="form-label" htmlFor={`rating-${swap._id}`}>{t('swap.rating')}</label>
          <select id={`rating-${swap._id}`} className="form-select" value={rating}
            onChange={event => setRating(Number(event.target.value))}>
            {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} / 5</option>)}
          </select>
          <textarea className="form-textarea" rows={2} maxLength={500} value={reviewText}
            onChange={event => setReviewText(event.target.value)} placeholder={t('swap.reviewText')} />
          <button className="btn btn-secondary btn-sm" type="submit" disabled={busy}>{t('swap.submitReview')}</button>
        </form>
      )}
      {review?.pendingMutualReview && review.myReview && <p className="form-hint">{t('swap.reviewPending')}</p>}
      {review?.reviews?.length === 2 && (
        <div className="mutual-reviews">
          {review.reviews.map(entry => (
            <p key={entry._id}>★ {entry.rating}/5 · {entry.comment || t('swap.noReviewNote')}</p>
          ))}
        </div>
      )}

      {error && <p className="error-msg" role="alert">{error}</p>}
    </article>
  )
}

function ModeratorDisputes() {
  const { t } = useTranslation()
  const [disputes, setDisputes] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(() => api.get('/swaps/moderation/disputes')
    .then(response => setDisputes(response.data.swaps))
    .catch(err => setError(err.response?.data?.err || t('auth.error'))), [t])

  useEffect(() => { refresh() }, [refresh])

  async function resolve(id, action) {
    const note = window.prompt(t('moderation.resolutionNote'))
    if (!note || note.trim().length < 10) return
    setBusy(true)
    setError('')
    try {
      await api.post(`/swaps/moderation/disputes/${id}/resolve`, { action, note })
      await refresh()
    } catch (err) {
      setError(err.response?.data?.err || t('auth.error'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="dashboard-section moderation-section">
      <h2>{t('moderation.title')}</h2>
      {disputes.length === 0 && <p className="form-hint">{t('moderation.empty')}</p>}
      {disputes.map(swap => (
        <article className="swap-card" key={swap._id}>
          <h3>{swap.item?.title}</h3>
          <p>{swap.disputeReason}</p>
          <div className="swap-actions">
            <button className="btn btn-secondary btn-sm" disabled={busy} onClick={() => resolve(swap._id, 'refund')}>
              {t('moderation.refund')}
            </button>
            <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => resolve(swap._id, 'complete')}>
              {t('moderation.complete')}
            </button>
          </div>
        </article>
      ))}
      {error && <p className="error-msg" role="alert">{error}</p>}
    </section>
  )
}

export default function Dashboard({ user, onUserUpdate }) {
  const { t, language } = useTranslation()
  const [profile, setProfile] = useState(null)
  const [items, setItems] = useState([])
  const [swaps, setSwaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    const [profileResponse, swapsResponse] = await Promise.all([
      api.get('/users/me/profile'),
      api.get('/swaps/mine')
    ])
    return {
      ...profileResponse.data,
      swaps: swapsResponse.data.swaps
    }
  }, [])

  const refreshData = useCallback(async () => {
    const data = await loadData()
    setProfile({ ...data.user, isModerator: data.isModerator })
    setItems(data.items)
    setSwaps(data.swaps)
    return data
  }, [loadData])

  useEffect(() => {
    let active = true
    loadData()
      .then(data => {
        if (!active) return
        setProfile({ ...data.user, isModerator: data.isModerator })
        setItems(data.items)
        setSwaps(data.swaps)
      })
      .catch(err => setError(err.response?.data?.err || t('dashboard.loadError')))
      .finally(() => setLoading(false))
    return () => { active = false }
  }, [loadData, t])

  const updateUser = async updates => {
    onUserUpdate?.(updates)
    await refreshData()
  }

  if (loading) return <p className="loading-msg page-feedback">{t('status.loading')}</p>
  if (error && !profile) return <p className="error-msg page-feedback" role="alert">{error}</p>
  if (!profile) return null

  const activeSwaps = swaps.filter(swap => ['requested', 'approved', 'disputed'].includes(swap.status))
  const pastSwaps = swaps.filter(swap => ['completed', 'cancelled'].includes(swap.status))
  const area = localizedNeighborhood(profile.location?.customNeighborhood || profile.location?.neighborhood, language)

  return (
    <main className="page-container dashboard-page">
      <header className="dashboard-heading">
        <div>
          <span className="section-eyebrow">{t('dashboard.title')}</span>
          <h1>{t('dashboard.hello', { name: profile.username })}</h1>
          <p>{area}</p>
        </div>
        <Link to="/items/new" className="btn btn-primary">{t('nav.list')}</Link>
      </header>

      <AccountVerification user={profile} onUserUpdate={updateUser} />

      <section className="profile-card">
        <div className="profile-stat">
          <span className="profile-stat-label">{t('dashboard.credits')}</span>
          <strong>◈ {profile.ecoCredits}</strong>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-label">{t('dashboard.given')}</span>
          <strong>{profile.itemsGivenCount}</strong>
        </div>
        <div className="badge-list">
          {(profile.badges || []).map(badge => <span className="badge-chip" key={badge}>{badge}</span>)}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <h2>{t('dashboard.listings')}</h2><span className="section-count">{items.length}</span>
        </div>
        {items.length ? (
          <div className="items-grid items-grid-sm">
            {items.map(item => (
              <article className="item-card item-card-sm" key={item._id}>
                <Link to={`/items/${item._id}`} className="dashboard-item-link">
                  {item.images?.[0] ? <img src={item.images[0]} alt={item.title} className="item-card-img" loading="lazy" />
                    : <div className="item-card-placeholder">◌</div>}
                  <div className="item-card-body">
                    <p className="item-card-title">{item.title}</p>
                    <p className="item-card-meta">{t(`item.status.${item.status}`)}</p>
                  </div>
                </Link>
                {item.status === 'available' && !item.isDemo && (
                  <div className="item-card-actions">
                    <Link to={`/items/${item._id}/edit`} className="btn btn-ghost btn-sm">{t('item.edit')}</Link>
                  </div>
                )}
                {(item.isDemo || item.owner?.isDemo) && <span className="demo-listing-badge">{t('browse.demo')}</span>}
              </article>
            ))}
          </div>
        ) : <p className="no-items-msg">{t('dashboard.emptyListings')}</p>}
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <h2>{t('dashboard.swaps')}</h2><span className="section-count">{activeSwaps.length}</span>
        </div>
        {activeSwaps.length ? activeSwaps.map(swap =>
          <SwapCard key={swap._id} swap={swap} user={user} refresh={refreshData} />)
          : <p className="no-items-msg">{t('dashboard.emptySwaps')}</p>}
      </section>

      {pastSwaps.length > 0 && (
        <section className="dashboard-section">
          <div className="dashboard-section-heading"><h2>{t('dashboard.history')}</h2></div>
          {pastSwaps.map(swap => <SwapCard key={swap._id} swap={swap} user={user} refresh={refreshData} />)}
        </section>
      )}
      {profile.isModerator && <ModeratorDisputes />}
    </main>
  )
}
