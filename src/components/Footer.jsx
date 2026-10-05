import { Link } from 'react-router'
import Logo from './Logo'
import { useTranslation } from '../i18n'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo iconSize={34} textSize="sm" white />
          <p className="footer-tagline">{t('footer.tagline')}</p>
        </div>

        <div className="footer-cols">
          <div>
            <p className="footer-col-heading">{t('footer.explore')}</p>
            <nav className="footer-links">
              <Link to="/browse">{t('nav.browse')}</Link>
              <Link to="/guidelines">{t('nav.guidelines')}</Link>
              <Link to="/about">{t('nav.about')}</Link>
            </nav>
          </div>
          <div>
            <p className="footer-col-heading">{t('footer.community')}</p>
            <nav className="footer-links">
              <Link to="/sign-up">{t('nav.signup')}</Link>
              <Link to="/sign-in">{t('nav.signin')}</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Re-Wear BH · {t('footer.copyright')}</p>
      </div>
    </footer>
  )
}
