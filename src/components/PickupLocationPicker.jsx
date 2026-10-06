import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { useTranslation } from '../i18n'
import 'leaflet/dist/leaflet.css'

const BAHRAIN_CENTER = [26.07, 50.55]

function PinSelector({ coordinates, onChange }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng
      if (lng < 50.2 || lng > 50.9 || lat < 25.5 || lat > 26.5) return
      onChange([lng, lat])
    }
  })

  return isValidCoordinates(coordinates)
    ? <Marker position={[Number(coordinates[1]), Number(coordinates[0])]} />
    : null
}

function isValidCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) return false
  const [longitude, latitude] = coordinates.map(Number)
  return Number.isFinite(longitude) && Number.isFinite(latitude) &&
    longitude >= 50.2 && longitude <= 50.9 && latitude >= 25.5 && latitude <= 26.5
}

export default function PickupLocationPicker({ coordinates, onChange }) {
  const { t } = useTranslation()
  const hasValidCoordinates = isValidCoordinates(coordinates)
  const center = hasValidCoordinates
    ? [Number(coordinates[1]), Number(coordinates[0])]
    : BAHRAIN_CENTER

  return (
    <div className="pickup-map">
      <MapContainer center={center} zoom={hasValidCoordinates ? 15 : 10} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PinSelector coordinates={coordinates} onChange={onChange} />
      </MapContainer>
      <p className="form-hint">{t('list.pinHint')}</p>
    </div>
  )
}
