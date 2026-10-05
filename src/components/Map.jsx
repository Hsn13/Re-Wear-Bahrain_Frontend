import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

export default function Map({ coordinates, label }) {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) return null
  // GeoJSON stores [longitude, latitude]; Leaflet needs [latitude, longitude]
  const [lng, lat] = coordinates.map(Number)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  return (
    <div className="item-map-wrapper">
      {label && <p className="item-map-label">{label}</p>}
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        className="item-map"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          {label && <Popup>{label}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  )
}
