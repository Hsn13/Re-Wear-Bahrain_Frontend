import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import api from '../services/api'

const BADGE_EMOJI = {
  'Eco Starter':         '🌱',
  'Green Giver':         '🌿',
  'Sustainability Hero': '🌍',
  'Bahrain Eco Champion':'🏆',
}

const STATUS_LABEL = {
  requested: 'Pending approval',
  approved:  'Approved — arrange pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function SwapBubble({ label, text, variant }) {
  if (!text) return null
  return (
    <div className={`swap-bubble swap-bubble-${variant}`}>
      <span className="swap-bubble-label">{label}</span>
      <p className="swap-bubble-text">{text}</p>
    </div>
  )
}

function IncomingSwapCard({ swap, onAction, onRefresh, busy }) {
  const [replyOpen, setReplyOpen]       = useState(false)
  const [replyText, setReplyText]       = useState('')
  const [declineOpen, setDeclineOpen]   = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [localBusy, setLocalBusy]       = useState(false)

  async function submitReply(e) {
    e.preventDefault()
    if (!replyText.trim()) return
    setLocalBusy(true)
    try {
      await api.patch(`/swaps/${swap._id}/respond`, { response: replyText.trim() })
      setReplyText('')
      setReplyOpen(false)
      onRefresh()
    } catch (err) {
      alert(err.response?.data?.err || 'Could not send reply')
    } finally {
      setLocalBusy(false)
    }
  }

  async function submitDecline(e) {
    e.preventDefault()
    setLocalBusy(true)
    try {
      await api.patch(`/swaps/${swap._id}/cancel`, { reason: declineReason.trim() })
      setDeclineOpen(false)
      onRefresh()
    } catch (err) {
      alert(err.response?.data?.err || 'Could not decline')
    } finally {
      setLocalBusy(false)
    }
  }

  const isActive = ['requested', 'approved'].includes(swap.status)

  return (
    <div className={`swap-card${isActive ? '' : ' swap-card-inactive'}`}>
      <div className="swap-card-header">
        <div>
          <p className="swap-card-title">
            <strong>{swap.requester?.username}</strong> wants{' '}
            <Link to={`/items/${swap.item?._id}`}><strong>{swap.item?.title}</strong></Link>
          </p>
          <p className="swap-card-from">
            📍 {swap.requester?.location?.neighborhood}
          </p>
        </div>
        <span className={`swap-status-badge swap-status-${swap.status}`}>
          {STATUS_LABEL[swap.status]}
        </span>
      </div>

      <SwapBubble
        label={`${swap.requester?.username} says:`}
        text={swap.pickupDetails?.notes}
        variant="requester"
      />
      <SwapBubble
        label="Your reply:"
        text={swap.ownerResponse}
        variant="owner"
      />

      {isActive && (
        <div className="swap-actions" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          {swap.status === 'requested' && !declineOpen && !replyOpen && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-success btn-sm"
                onClick={() => onAction('approve', swap._id)} disabled={busy || localBusy}>
                Approve
              </button>
              <button className="btn btn-danger btn-sm"
                onClick={() => setDeclineOpen(true)} disabled={busy || localBusy}>
                Decline
              </button>
              <button className="btn btn-ghost btn-sm"
                onClick={() => setReplyOpen(true)} disabled={busy || localBusy}>
                {swap.ownerResponse ? 'Edit Reply' : 'Reply'}
              </button>
            </div>
          )}

          {swap.status === 'approved' && !replyOpen && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-sm"
                onClick={() => onAction('complete', swap._id)} disabled={busy || localBusy}>
                ✓ Mark as Picked Up (+{swap.creditsEarnedByOwner} credits)
              </button>
              <button className="btn btn-ghost btn-sm"
                onClick={() => setReplyOpen(true)} disabled={busy || localBusy}>
                {swap.ownerResponse ? 'Edit Message' : 'Send Message'}
              </button>
            </div>
          )}

          {declineOpen && (
            <form className="swap-inline-form" onSubmit={submitDecline}>
              <p className="swap-inline-form-title">Reason for declining (optional):</p>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. Already given to someone else…"
                value={declineReason}
                onChange={e => setDeclineReason(e.target.value)}
                maxLength={300}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-danger btn-sm" type="submit" disabled={localBusy}>
                  {localBusy ? 'Declining…' : 'Confirm Decline'}
                </button>
                <button className="btn btn-ghost btn-sm" type="button"
                  onClick={() => setDeclineOpen(false)} disabled={localBusy}>
                  Back
                </button>
              </div>
            </form>
          )}

          {replyOpen && (
            <form className="swap-inline-form" onSubmit={submitReply}>
              <p className="swap-inline-form-title">
                {swap.status === 'approved'
                  ? 'Coordinate pickup details:'
                  : 'Reply to requester:'}
              </p>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder={
                  swap.status === 'approved'
                    ? 'e.g. Meet me at Seef Mall entrance Saturday 5pm…'
                    : 'Write a message…'
                }
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                maxLength={500}
                required
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" type="submit" disabled={localBusy}>
                  {localBusy ? 'Sending…' : 'Send'}
                </button>
                <button className="btn btn-ghost btn-sm" type="button"
                  onClick={() => setReplyOpen(false)} disabled={localBusy}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

function OutgoingSwapCard({ swap, onAction, busy }) {
  const isActive = ['requested', 'approved'].includes(swap.status)

  return (
    <div className={`swap-card${isActive ? '' : ' swap-card-inactive'}`}>
      <div className="swap-card-header">
        <div>
          <p className="swap-card-title">
            <Link to={`/items/${swap.item?._id}`}><strong>{swap.item?.title}</strong></Link>
            {' '}from <strong>{swap.owner?.username}</strong>
          </p>
          <p className="swap-card-from">
            📍 {swap.owner?.location?.neighborhood}
          </p>
        </div>
        <span className={`swap-status-badge swap-status-${swap.status}`}>
          {STATUS_LABEL[swap.status]}
        </span>
      </div>

      <SwapBubble
        label="Your message:"
        text={swap.pickupDetails?.notes}
        variant="requester"
      />
      <SwapBubble
        label={`${swap.owner?.username} replied:`}
        text={swap.ownerResponse}
        variant="owner"
      />

      {swap.status === 'cancelled' && swap.cancelledBy === 'owner' && (
        <div className="swap-decline-notice">
          <strong>Request declined by {swap.owner?.username}</strong>
          {swap.cancelReason && (
            <p className="swap-decline-reason">"{swap.cancelReason}"</p>
          )}
          <p className="swap-refund-note">
            🌿 Your {swap.creditsSpentByRequester} Eco-Credits have been refunded.
          </p>
        </div>
      )}

      {swap.status === 'cancelled' && swap.cancelledBy === 'requester' && (
        <div className="swap-cancel-notice">
          <p>You cancelled this request.</p>
          <p className="swap-refund-note">
            🌿 Your {swap.creditsSpentByRequester} Eco-Credits have been refunded.
          </p>
        </div>
      )}

      {isActive && (
        <div className="swap-actions" style={{ marginTop: '0.75rem' }}>
          {swap.status === 'requested' && (
            <p className="swap-waiting-note">
              ⏳ Waiting for {swap.owner?.username} to respond…
            </p>
          )}
          {swap.status === 'approved' && (
            <p className="swap-approved-note">
              ✅ Approved! Coordinate pickup with {swap.owner?.username}.
            </p>
          )}
          <button className="btn btn-danger btn-sm"
            onClick={() => onAction('cancel', swap._id)} disabled={busy}>
            Cancel Request
          </button>
        </div>
      )}
    </div>
  )
}

function Dashboard({ user, onUserUpdate }) {
  const [profile, setProfile] = useState(null)
  const [items, setItems]     = useState([])
  const [swaps, setSwaps]     = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy]       = useState(false)

  async function refreshData() {
    const [profileRes, swapsRes] = await Promise.all([
      api.get('/users/me/profile'),
      api.get('/swaps/mine'),
    ])
    setProfile(profileRes.data.user)
    setItems(profileRes.data.items)
    setSwaps(swapsRes.data.swaps)
    return profileRes.data.user
  }

  useEffect(() => {
    refreshData().catch(console.error).finally(() => setLoading(false))
  }, [])

  async function handleSwapAction(action, swapId) {
    setBusy(true)
    try {
      const res = await api.patch(`/swaps/${swapId}/${action}`)
      const freshProfile = await refreshData()
      if (action === 'complete' && onUserUpdate) {
        const credits = res.data.newEcoCredits ?? freshProfile.ecoCredits
        onUserUpdate({ ecoCredits: credits })
      }
    } catch (err) {
      alert(err.response?.data?.err || 'Action failed')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <p className="dashboard-loading">Loading your profile…</p>
  if (!profile) return <p className="dashboard-loading">Could not load profile.</p>

  const incoming = swaps.filter(s => s.owner._id === user._id && ['requested', 'approved'].includes(s.status))
  const outgoing = swaps.filter(s => s.requester._id === user._id && ['requested', 'approved'].includes(s.status))
  const history  = swaps.filter(s => ['completed', 'cancelled'].includes(s.status))
  const initial  = profile.username?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="page-container">

      {/* ── Profile Card ── */}
      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-info">
          <p className="profile-username">{profile.username}</p>
          <p className="profile-location">
            📍 {profile.location?.customNeighborhood || profile.location?.neighborhood}
          </p>
          <div className="profile-stats">
            <span className="stat-chip credits">
              🌿 <strong>{profile.ecoCredits}</strong> Eco-Credits
            </span>
            <span className="stat-chip">
              🎁 <strong>{profile.itemsGivenCount}</strong> items given
            </span>
          </div>
          {profile.badges.length > 0 && (
            <div className="badge-list">
              {profile.badges.map(b => (
                <span key={b} className="badge-chip">{BADGE_EMOJI[b]} {b}</span>
              ))}
            </div>
          )}
        </div>
        <div>
          <Link to="/items/new" className="btn btn-primary btn-sm">+ List an Item</Link>
        </div>
      </div>

      {/* ── My Listings ── */}
      <div className="dashboard-section">
        <p className="section-title">
          My Listings <span className="section-count">{items.length}</span>
        </p>
        {items.length === 0 ? (
          <div className="no-items-msg">
            No listings yet. <Link to="/items/new">List your first item!</Link>
          </div>
        ) : (
          <div className="items-grid items-grid-sm">
            {items.map(item => (
              <div key={item._id} className="item-card item-card-sm"
                style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to={`/items/${item._id}`}
                  style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  {item.images?.[0]
                    ? <img src={item.images[0]} alt={item.title} className="item-card-img" />
                    : <div className="item-card-placeholder"><span>👗</span></div>
                  }
                  <div className="item-card-body">
                    <p className="item-card-title">{item.title}</p>
                    <p className="item-card-meta">
                      <span className={`item-status-dot item-status-${item.status}`} />
                      {item.status}
                    </p>
                  </div>
                </Link>
                {item.status === 'available' && (
                  <div className="item-card-actions">
                    <Link to={`/items/${item._id}/edit`} className="btn btn-ghost btn-sm"
                      style={{ flex: 1 }}>
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Incoming Swap Requests ── */}
      {incoming.length > 0 && (
        <div className="dashboard-section">
          <p className="section-title">
            Requests on My Items <span className="section-count">{incoming.length}</span>
          </p>
          <p className="section-hint">
            Review messages from requesters, reply, then approve or decline.
          </p>
          {incoming.map(swap => (
            <IncomingSwapCard
              key={swap._id}
              swap={swap}
              onAction={handleSwapAction}
              onRefresh={refreshData}
              busy={busy}
            />
          ))}
        </div>
      )}

      {/* ── Outgoing Swap Requests ── */}
      {outgoing.length > 0 && (
        <div className="dashboard-section">
          <p className="section-title">
            Items I've Requested <span className="section-count">{outgoing.length}</span>
          </p>
          {outgoing.map(swap => (
            <OutgoingSwapCard
              key={swap._id}
              swap={swap}
              onAction={handleSwapAction}
              busy={busy}
            />
          ))}
        </div>
      )}

      {/* ── Swap History ── */}
      {history.length > 0 && (
        <div className="dashboard-section">
          <p className="section-title">
            Swap History <span className="section-count">{history.length}</span>
          </p>
          {history.map(swap => {
            const isOwner = swap.owner._id === user._id
            return (
              <div key={swap._id} className="swap-card swap-card-inactive">
                <div className="swap-card-header">
                  <p className="swap-card-title">
                    {isOwner ? (
                      <>
                        <strong>{swap.requester?.username}</strong>
                        {' — '}
                        <Link to={`/items/${swap.item?._id}`}>{swap.item?.title}</Link>
                      </>
                    ) : (
                      <>
                        <Link to={`/items/${swap.item?._id}`}>{swap.item?.title}</Link>
                        {' from '}
                        <strong>{swap.owner?.username}</strong>
                      </>
                    )}
                  </p>
                  <span className={`swap-status-badge swap-status-${swap.status}`}>
                    {STATUS_LABEL[swap.status]}
                  </span>
                </div>
                {swap.status === 'cancelled' && swap.cancelledBy === 'owner' && !isOwner && swap.cancelReason && (
                  <p className="swap-decline-reason" style={{ marginTop: '0.5rem' }}>
                    "{swap.cancelReason}"
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dashboard
