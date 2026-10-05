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

  return coordinates ? <Marker position={[coordinates[1], coordinates[0]]} /> : null
}

export default function PickupLocationPicker({ coordinates, onChange }) {
  const { t } = useTranslation()
  const center = coordinates
    ? [Number(coordinates[1]), Number(coordinates[0])]
    : BAHRAIN_CENTER

  return (
    <div className="pickup-map">
      <MapContainer center={center} zoom={coordinates ? 15 : 10} scrollWheelZoom={false}>
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
