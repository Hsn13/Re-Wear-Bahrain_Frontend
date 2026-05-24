import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import api from '../services/api'

const BADGE_EMOJI = {
  'Eco Starter':         '🌱',
  'Green Giver':         '🌿',
  'Sustainability Hero': '🌍',
  'Bahrain Eco Champion':'🏆',
}

const SWAP_STATUS_LABEL = {
  requested: 'Pending approval',
  approved:  'Approved — arrange pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function Dashboard({ user }) {
  const [profile, setProfile] = useState(null)
  const [items, setItems]     = useState([])
  const [swaps, setSwaps]     = useState([])
  const [loading, setLoading] = useState(true)
  const [swapAction, setSwapAction] = useState('')

  async function refresh() {
    const [profileRes, swapsRes] = await Promise.all([
      api.get('/users/me/profile'),
      api.get('/swaps/mine'),
    ])
    setProfile(profileRes.data.user)
    setItems(profileRes.data.items)
    setSwaps(swapsRes.data.swaps)
  }

  useEffect(() => {
    refresh().catch(console.error).finally(() => setLoading(false))
  }, [])

  async function handleSwapAction(swapId, action) {
    setSwapAction(swapId + action)
    try {
      await api.patch(`/swaps/${swapId}/${action}`)
      await refresh()
    } catch (err) {
      alert(err.response?.data?.err || 'Action failed')
    } finally {
      setSwapAction('')
    }
  }

  if (loading) return <p className="dashboard-loading">Loading your profile…</p>
  if (!profile) return <p className="dashboard-loading">Could not load profile.</p>

  const incomingSwaps = swaps.filter(s => s.owner._id === user._id && s.status !== 'cancelled')
  const outgoingSwaps = swaps.filter(s => s.requester._id === user._id && s.status !== 'cancelled')
  const initial = profile.username?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="page-container">

      {/* ── Profile Card ── */}
      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-info">
          <p className="profile-username">{profile.username}</p>
          <p className="profile-location">📍 {profile.location?.neighborhood}</p>
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
                <span key={b} className="badge-chip">
                  {BADGE_EMOJI[b]} {b}
                </span>
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
            No listings yet.{' '}
            <Link to="/items/new">List your first item!</Link>
          </div>
        ) : (
          <div className="items-grid items-grid-sm">
            {items.map(item => (
              <Link key={item._id} to={`/items/${item._id}`} className="item-card item-card-sm">
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
            ))}
          </div>
        )}
      </div>

      {/* ── Incoming Swaps ── */}
      {incomingSwaps.length > 0 && (
        <div className="dashboard-section">
          <p className="section-title">
            Swap Requests on My Items <span className="section-count">{incomingSwaps.length}</span>
          </p>
          {incomingSwaps.map(swap => (
            <div key={swap._id} className="swap-card">
              <p className="swap-card-title">
                <strong>{swap.requester?.username}</strong> wants <strong>{swap.item?.title}</strong>
              </p>
              <p className="swap-card-status">{SWAP_STATUS_LABEL[swap.status]}</p>
              <div className="swap-actions">
                {swap.status === 'requested' && (
                  <>
                    <button className="btn btn-success btn-sm"
                      onClick={() => handleSwapAction(swap._id, 'approve')} disabled={!!swapAction}>
                      Approve
                    </button>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => handleSwapAction(swap._id, 'cancel')} disabled={!!swapAction}>
                      Decline
                    </button>
                  </>
                )}
                {swap.status === 'approved' && (
                  <button className="btn btn-primary btn-sm"
                    onClick={() => handleSwapAction(swap._id, 'complete')} disabled={!!swapAction}>
                    ✓ Mark as Picked Up (+{swap.creditsEarnedByOwner} credits)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Outgoing Swaps ── */}
      {outgoingSwaps.length > 0 && (
        <div className="dashboard-section">
          <p className="section-title">
            Items I've Requested <span className="section-count">{outgoingSwaps.length}</span>
          </p>
          {outgoingSwaps.map(swap => (
            <div key={swap._id} className="swap-card">
              <p className="swap-card-title">
                <strong>{swap.item?.title}</strong> from <strong>{swap.owner?.username}</strong>
              </p>
              <p className="swap-card-status">{SWAP_STATUS_LABEL[swap.status]}</p>
              <div className="swap-actions">
                {['requested', 'approved'].includes(swap.status) && (
                  <button className="btn btn-danger btn-sm"
                    onClick={() => handleSwapAction(swap._id, 'cancel')} disabled={!!swapAction}>
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
