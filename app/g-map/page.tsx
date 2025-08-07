"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import dynamic from "next/dynamic"
import { API_ENDPOINTS } from "@/lib/config"

// Dynamically import Leaflet map component to avoid SSR issues
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">Loading map...</div>
})

export default function GMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [places, setPlaces] = useState<any[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<string>("all")
  const [distanceFilter, setDistanceFilter] = useState<number>(50)
  const [sortBy, setSortBy] = useState<string>("distance")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setLocation({ lat, lng })
          fetchNearbyPlaces(lat, lng, selectedFacility)
        },
        () => setError("Location access denied"),
        { enableHighAccuracy: true },
      )
    } else {
      setError("Geolocation is not supported")
    }

    // Listen for emergency search events from navbar
    const handleEmergencySearch = () => {
      setSelectedFacility('emergency')
      if (location) {
        fetchNearbyPlaces(location.lat, location.lng, 'emergency')
      }
    }

    window.addEventListener('searchEmergency', handleEmergencySearch)
    return () => window.removeEventListener('searchEmergency', handleEmergencySearch)
  }, [selectedFacility, location])

  const fetchNearbyPlaces = async (lat: number, lng: number, facilityType: string) => {
    setLoading(true)
    try {
      setError(null) // Clear previous errors
      const response = await fetch(API_ENDPOINTS.HEALTH_CENTERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setPlaces([])
        setFilteredPlaces([])
        return
      }

      if (data.nearest_health_centers && data.nearest_health_centers.length > 0) {
        const placesWithDistance = data.nearest_health_centers
          .map((place: any) => ({
            name: place.name,
            vicinity: place.address,
            lat: place.latitude,
            lng: place.longitude,
            distance: place.distance || getDistance(lat, lng, place.latitude, place.longitude),
            mapsLink: `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}&zoom=16`,
            type: determineFacilityType(place.name, place.address),
          }))
          .sort((a, b) => a.distance - b.distance)

        setPlaces(placesWithDistance)
        setFilteredPlaces(placesWithDistance)
      } else if (Array.isArray(data) && data.length > 0) {
        // Handle direct array response
        const placesWithDistance = data
          .map((place: any) => ({
            name: place.name,
            vicinity: place.address,
            lat: place.latitude,
            lng: place.longitude,
            distance: place.distance || getDistance(lat, lng, place.latitude, place.longitude),
            mapsLink: `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}&zoom=16`,
            type: determineFacilityType(place.name, place.address),
          }))
          .sort((a, b) => a.distance - b.distance)

        setPlaces(placesWithDistance)
        setFilteredPlaces(placesWithDistance)
      } else {
        setError("No health centers found in your area. Please try again or check your location settings.")
        setPlaces([])
        setFilteredPlaces([])
      }
    } catch (error) {
      console.error("Error fetching health centers:", error)
      setError("Unable to fetch health centers. Please check if the backend server is running.")
      setPlaces([])
      setFilteredPlaces([])
    } finally {
      setLoading(false)
    }
  }

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const determineFacilityType = (name: string, address: string) => {
    const nameAndAddress = (name + " " + address).toLowerCase()
    if (nameAndAddress.includes("hospital") || nameAndAddress.includes("medical college")) return "hospital"
    if (nameAndAddress.includes("clinic") || nameAndAddress.includes("dispensary")) return "clinic"
    if (nameAndAddress.includes("doctor") || nameAndAddress.includes("physician")) return "doctor"
    if (nameAndAddress.includes("pharmacy") || nameAndAddress.includes("medical store")) return "pharmacy"
    if (nameAndAddress.includes("emergency") || nameAndAddress.includes("trauma")) return "emergency"
    return "medical"
  }

  // Filter and sort places based on current filters
  useEffect(() => {
    let filtered = [...places]

    // Filter by facility type
    if (selectedFacility !== "all") {
      filtered = filtered.filter(place => place.type === selectedFacility)
    }

    // Filter by distance
    filtered = filtered.filter(place => place.distance <= distanceFilter)

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.vicinity.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort places
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredPlaces(filtered)
  }, [places, selectedFacility, distanceFilter, searchTerm, sortBy])

  return (
    <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">
      <Navbar className="fixed top-0 left-0 w-full bg-black shadow-md z-50" />

      <h1 className="text-3xl font-bold mb-6 pt-20 text-white text-center">Accessible Healthcare Locations</h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {loading && <p className="text-blue-400 mb-4 text-center">🔍 Searching for healthcare facilities...</p>}

      {/* Advanced Filters Section */}
      <div className="w-full max-w-6xl mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">🔧 Search & Filter Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
              🔍 Search by Name
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search facilities..."
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400"
            />
          </div>

          {/* Facility Type Filter */}
          <div>
            <label htmlFor="facility-type" className="block text-sm font-medium text-gray-300 mb-1">
              🏥 Facility Type
            </label>
            <select
              id="facility-type"
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-white"
            >
              <option value="all">All Types</option>
              <option value="hospital">🏥 Hospitals</option>
              <option value="clinic">🏢 Clinics</option>
              <option value="doctor">👨‍⚕️ Doctors</option>
              <option value="pharmacy">💊 Pharmacies</option>
              <option value="emergency">🚨 Emergency</option>
              <option value="medical">⚕️ General Medical</option>
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-300 mb-1">
              📍 Max Distance: {distanceFilter}km
            </label>
            <input
              id="distance"
              type="range"
              min="1"
              max="50"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1km</span>
              <span>50km</span>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-300 mb-1">
              📊 Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-white"
            >
              <option value="distance">📏 Distance</option>
              <option value="name">🔤 Name</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-sm text-gray-300">
            📋 Showing <span className="text-blue-400 font-semibold">{filteredPlaces.length}</span> out of{" "}
            <span className="text-green-400 font-semibold">{places.length}</span> healthcare facilities
            {searchTerm && <span className="text-yellow-400"> matching "{searchTerm}"</span>}
          </p>
        </div>
      </div>

      {/* Update the map and places list for better responsiveness */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl mt-4 gap-4 sm:gap-6">
        {/* Map Section (Left) */}
        {isMounted && location && (
          <div className="w-full md:w-[55%] h-[350px] sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden shadow-lg">
            <LeafletMap 
              latitude={location.lat} 
              longitude={location.lng} 
              healthCenters={filteredPlaces}
              className="w-full h-full rounded-lg border border-gray-700"
            />
          </div>
        )}

        {/* Places List (Right) */}
        <div className="w-full md:w-[45%] h-[350px] sm:h-[450px] md:h-[550px] overflow-y-auto custom-scrollbar">
          {filteredPlaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-lg mb-2">🔍 No facilities found</p>
              <p className="text-sm text-center">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <ul className="space-y-3 sm:space-y-4 p-2 sm:p-4">
              {filteredPlaces.map((place, index) => (
              <li
                key={index}
                className="border border-gray-700 p-3 sm:p-5 rounded-lg bg-black shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <strong className="text-base sm:text-lg md:text-xl font-semibold text-blue-400">{place.name}</strong>
                    <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                      {place.type === 'hospital' ? '🏥' : 
                       place.type === 'clinic' ? '🏢' :
                       place.type === 'doctor' ? '👨‍⚕️' :
                       place.type === 'pharmacy' ? '💊' :
                       place.type === 'emergency' ? '🚨' : '⚕️'} {place.type}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg italic text-gray-300">{place.vicinity}</p>
                  <p className="text-xs sm:text-sm text-gray-400">📍 {place.distance.toFixed(2)} km away</p>

                  {/* View on OpenStreetMap Link */}
                  <a
                    href={place.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline mt-2 text-xs sm:text-sm"
                  >
                    View on OpenStreetMap
                  </a>

                  {/* Visit Website Link (if available) */}
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-1 text-xs sm:text-sm"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer className="w-full bg-black text-gray-400 mt-10" />

      <style jsx>{`
        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f1f1f;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  )
}

