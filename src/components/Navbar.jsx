import { Link, NavLink } from 'react-router'
import Logo from './Logo'

function Navbar({ user, setUser }) {
  function logOut() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Logo iconSize={30} textSize="sm" />
      </Link>

      <NavLink className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`} to="/" end>
        Home
      </NavLink>
      <NavLink className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`} to="/browse">
        Browse
      </NavLink>
      <NavLink className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`} to="/about">
        About
      </NavLink>

      <div className="navbar-spacer" />

      {user ? (
        <>
          <Link className="navbar-link list-link" to="/items/new">+ List Item</Link>
          <Link className="navbar-link" to="/dashboard">Dashboard</Link>
          <div className="navbar-divider" />
          <span className="eco-badge">🌿 {user.ecoCredits ?? '—'}</span>
          <span className="navbar-user">{user.username}</span>
          <button className="btn btn-ghost btn-sm" onClick={logOut}>Log Out</button>
        </>
      ) : (
        <>
          <Link className="navbar-link" to="/sign-up">Sign up</Link>
          <Link className="btn btn-primary btn-sm" to="/sign-in">Sign in</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar
