import { Link, NavLink } from 'react-router'
import Logo from './Logo'
import { useTranslation } from '../i18n'

function Navbar({ user, setUser }) {
  const { t, language, setLanguage } = useTranslation()

  function logOut() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label={t('nav.main')}>
        <Link to="/" className="navbar-brand-link" aria-label={t('nav.home')}>
          <Logo iconSize={32} textSize="sm" />
        </Link>
        <div className="navbar-main-links">
          <NavLink className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`} to="/browse">
            {t('nav.browse')}
          </NavLink>
          <NavLink className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`} to="/guidelines">
            {t('nav.guidelines')}
          </NavLink>
          <NavLink className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`} to="/about">
            {t('nav.about')}
          </NavLink>
        </div>
        <div className="navbar-actions">
          <button
            type="button"
            className="language-toggle"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            aria-label={t('language.switchLabel')}
          >
            {t('language.switch')}
          </button>
          {user ? (
            <>
              <span className="eco-badge" aria-label={`${user.ecoCredits ?? 0} Eco-Credits`}>
                ◈ {user.ecoCredits ?? 0}
              </span>
              <Link className="navbar-link navbar-account" to="/dashboard">{t('nav.dashboard')}</Link>
              <Link className="btn btn-primary btn-sm" to="/items/new">{t('nav.list')}</Link>
              <button className="btn btn-ghost btn-sm navbar-logout" onClick={logOut}>{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link className="navbar-link navbar-account" to="/sign-in">{t('nav.signin')}</Link>
              <Link className="btn btn-primary btn-sm" to="/sign-up">{t('nav.signup')}</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
