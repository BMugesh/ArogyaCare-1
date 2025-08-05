"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Fix for Leaflet marker icons in Next.js
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Custom icons for different types of markers
const UserIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

const HospitalIcon = L.divIcon({
  className: 'hospital-marker',
  html: '<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})

// Component to update map center when user location changes
function ChangeMapCenter({ center }: { center: [number, number] }) {
  const map = useMap()
  map.setView(center, 13)
  return null
}

interface HealthCenter {
  name: string
  address: string
  latitude: number
  longitude: number
  distance?: number
}

interface HealthCentersMapComponentProps {
  onHealthCentersUpdate?: (centers: HealthCenter[]) => void
}

export default function HealthCentersMapComponent({ onHealthCentersUpdate }: HealthCentersMapComponentProps) {
  const [userLocation, setUserLocation] = useState<[number, number]>([20.5937, 78.9629]) // Default to India center
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHealthCenters = async (latitude: number, longitude: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5000/health-centers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      })

      const data = await response.json()
      
      if (data.nearest_health_centers) {
        const centers = data.nearest_health_centers.map((center: any) => ({
          name: center.name,
          address: center.address,
          latitude: center.latitude,
          longitude: center.longitude,
          distance: getDistance(latitude, longitude, center.latitude, center.longitude)
        }))
        
        setHealthCenters(centers)
        onHealthCentersUpdate?.(centers)
      } else {
        setError('No health centers found nearby')
      }
    } catch (error) {
      console.error('Error fetching health centers:', error)
      setError('Failed to fetch health centers. Please check if the backend is running.')
    }
    setLoading(false)
  }

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          fetchHealthCenters(latitude, longitude)
        },
        (error) => {
          console.error('Geolocation error:', error)
          setError('Location access denied. Please enable location services.')
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-4 z-[1000] bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
          Loading nearby health centers...
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-4 z-[1000] bg-red-600 text-white px-3 py-2 rounded-lg max-w-xs">
          {error}
        </div>
      )}

      <MapContainer center={userLocation} zoom={13} className="w-full h-full rounded-lg shadow-lg">
        <ChangeMapCenter center={userLocation} />
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        {/* User's location */}
        <Marker position={userLocation} icon={UserIcon}>
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong><br />
              <small>Lat: {userLocation[0].toFixed(4)}, Lng: {userLocation[1].toFixed(4)}</small>
            </div>
          </Popup>
        </Marker>

        {/* Health centers */}
        {healthCenters.map((center, index) => (
          <Marker 
            key={index} 
            position={[center.latitude, center.longitude]} 
            icon={HospitalIcon}
          >
            <Popup>
              <div className="max-w-xs">
                <strong className="text-red-600">{center.name}</strong><br />
                <small className="text-gray-600">{center.address}</small><br />
                {center.distance && (
                  <small className="text-blue-600 font-medium">
                    {center.distance.toFixed(2)} km away
                  </small>
                )}
                <br />
                <a 
                  href={`https://www.openstreetmap.org/?mlat=${center.latitude}&mlon=${center.longitude}&zoom=16`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xs mt-1 inline-block"
                >
                  View on OpenStreetMap
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

