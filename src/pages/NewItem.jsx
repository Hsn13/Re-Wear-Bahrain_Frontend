import { useNavigate } from 'react-router'
import api from '../services/api'
import ItemListingForm from '../components/ItemListingForm'

export default function NewItem() {
  const navigate = useNavigate()

  async function createListing(data) {
    const response = await api.post('/items', data)
    navigate(`/items/${response.data.item._id}`)
  }

  return <ItemListingForm onSubmit={createListing} />
}
