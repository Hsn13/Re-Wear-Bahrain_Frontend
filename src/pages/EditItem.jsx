import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import api from '../services/api'
import ItemListingForm from '../components/ItemListingForm'
import { useTranslation } from '../i18n'

export default function EditItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [itemData, setItemData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/items/${id}`)
      .then(response => {
        const item = response.data.item
        setItemData({
          title: item.title || '',
          description: item.description || '',
          category: item.category || 'tops',
          size: item.size || 'M',
          condition: item.condition || 'good',
          imageUrl: item.images?.[0] || '',
          ecoCreditsPrice: item.ecoCreditsPrice ?? 5,
          pickupType: item.pickupLocation?.type || 'public',
          pickupAddress: item.pickupLocation?.address || '',
          pickupInstructions: item.pickupLocation?.instructions || '',
          pickupCoordinates: item.pickupLocation?.coordinates || null
        })
      })
      .catch(() => setError(t('auth.error')))
  }, [id, t])

  async function updateListing(data) {
    await api.patch(`/items/${id}`, data)
    navigate(`/items/${id}`)
  }

  if (error) return <p className="error-msg page-feedback" role="alert">{error}</p>
  if (!itemData) return <p className="loading-msg page-feedback">{t('status.loading')}</p>
  return <ItemListingForm key={id} initialData={itemData} isEdit onSubmit={updateListing} />
}
