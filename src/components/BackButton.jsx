import { useNavigate } from 'react-router'
import { useTranslation } from '../i18n'

export default function BackButton({ fallback = '/', label }) {
  const { t, language } = useTranslation()
  const navigate = useNavigate()
  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }
  return (
    <button className="back-btn" onClick={handleBack} type="button">
      {label || `${language === 'ar' ? '→' : '←'} ${t('back')}`}
    </button>
  )
}
