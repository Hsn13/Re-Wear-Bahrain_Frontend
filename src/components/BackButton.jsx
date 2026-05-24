import { useNavigate } from 'react-router'

export default function BackButton({ fallback = '/', label = '← Back' }) {
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
      {label}
    </button>
  )
}
