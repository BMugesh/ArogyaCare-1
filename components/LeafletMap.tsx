"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface HealthCenter {
  name: string
  vicinity: string
  lat: number
  lng: number
  distance?: number
}

interface LeafletMapProps {
  latitude: number
  longitude: number
  healthCenters: HealthCenter[]
  className?: string
}

export default function LeafletMap({ latitude, longitude, healthCenters, className }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([latitude, longitude], 13)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Add user location marker
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })

    L.marker([latitude, longitude], { icon: userIcon })
      .addTo(map)
      .bindPopup(`
        <div class="text-center">
          <strong>Your Location</strong><br />
          <small>Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}</small>
        </div>
      `)

    // Add health center markers
    healthCenters.forEach((center) => {
      const hospitalIcon = L.divIcon({
        className: 'hospital-marker',
        html: '<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })

      // Determine facility type for different colored markers
      const facilityType = center.type || 'medical'
      const markerColor = {
        hospital: '#ef4444',
        clinic: '#3b82f6', 
        doctor: '#10b981',
        pharmacy: '#f59e0b',
        emergency: '#dc2626',
        medical: '#6b7280'
      }[facilityType] || '#6b7280'

      const facilityIcon = L.divIcon({
        className: 'hospital-marker',
        html: `<div style="background-color: ${markerColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })

      L.marker([center.lat, center.lng], { icon: facilityIcon })
        .addTo(map)
        .bindPopup(`
          <div class="max-w-xs">
            <div class="flex items-center gap-2 mb-2">
              <strong class="text-red-600">${center.name}</strong>
              <span class="px-2 py-1 text-xs bg-gray-100 rounded-full">
                ${facilityType === 'hospital' ? '🏥' : 
                  facilityType === 'clinic' ? '🏢' :
                  facilityType === 'doctor' ? '👨‍⚕️' :
                  facilityType === 'pharmacy' ? '💊' :
                  facilityType === 'emergency' ? '🚨' : '⚕️'} ${facilityType}
              </span>
            </div>
            <small class="text-gray-600">${center.vicinity}</small><br>
            <small class="text-blue-600 font-medium">📍 ${center.distance ? center.distance.toFixed(2) + ' km away' : ''}</small><br>
            <a href="https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}&zoom=16" 
               target="_blank" rel="noopener noreferrer" 
               class="text-blue-500 hover:underline text-xs mt-1 inline-block">
              🗺️ View on OpenStreetMap
            </a>
          </div>
        `)
    })

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, healthCenters])

  return <div ref={mapRef} className={className} />
}
