import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function Map({ coordinates, label }) {
  if (!coordinates || coordinates.length < 2) return null
  // GeoJSON stores [longitude, latitude]; Leaflet needs [latitude, longitude]
  const [lng, lat] = coordinates
  if (!lat || !lng) return null

  return (
    <div className="item-map-wrapper">
      <p className="item-map-label">📍 Approximate pickup area</p>
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        className="item-map"
        scrollWheelZoom={false}
        style={{ height: '260px', width: '100%', borderRadius: '10px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{label || 'Pickup area'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
