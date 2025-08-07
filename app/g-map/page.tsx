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
        (error) => {
          console.error("Geolocation error:", error)
          if (error.code === error.PERMISSION_DENIED) {
            setError("Location access denied. Please enable location permissions to find nearby healthcare facilities.")
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setError("Location information unavailable. Please check your device settings.")
          } else {
            setError("Location request timed out. Please refresh the page and try again.")
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 600000 }, // 10 minutes cache
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }, [selectedFacility])

  // Re-fetch when distance filter changes significantly
  useEffect(() => {
    if (location && location.lat && location.lng) {
      fetchNearbyPlaces(location.lat, location.lng, selectedFacility)
    }
  }, [distanceFilter])

  const fetchNearbyPlaces = async (lat: number, lng: number, facilityType: string) => {
    setLoading(true)
    try {
      setError(null) // Clear previous errors
      
      // Enhanced request with more parameters
      const response = await fetch(API_ENDPOINTS.HEALTH_CENTERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          max_distance: distanceFilter, // Use current distance filter
          max_results: 50, // Get more results for filtering
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

      // Handle enhanced API response
      if (data.nearest_health_centers && data.nearest_health_centers.length > 0) {
        const placesWithDistance = data.nearest_health_centers
          .map((place: any) => ({
            name: place.name,
            vicinity: place.address,
            lat: place.latitude,
            lng: place.longitude,
            distance: place.distance, // Already calculated by backend
            mapsLink: `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}&zoom=16`,
            type: place.type || determineFacilityType(place.name, place.address),
            phone: place.phone || "",
            website: place.website || "",
            opening_hours: place.opening_hours || "",
            osm_id: place.osm_id || "",
          }))
          .filter(place => place.distance <= distanceFilter) // Filter by distance
          .sort((a, b) => a.distance - b.distance)

        setPlaces(placesWithDistance)
        setFilteredPlaces(placesWithDistance)
        
        // Log search metadata for debugging
        if (data.search_metadata) {
          console.log("Search metadata:", data.search_metadata)
        }
      } else if (Array.isArray(data) && data.length > 0) {
        // Handle legacy direct array response
        const placesWithDistance = data
          .map((place: any) => ({
            name: place.name,
            vicinity: place.address,
            lat: place.latitude,
            lng: place.longitude,
            distance: place.distance || getDistance(lat, lng, place.latitude, place.longitude),
            mapsLink: `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}&zoom=16`,
            type: place.type || determineFacilityType(place.name, place.address),
            phone: place.phone || "",
            website: place.website || "",
            opening_hours: place.opening_hours || "",
          }))
          .filter(place => place.distance <= distanceFilter)
          .sort((a, b) => a.distance - b.distance)

        setPlaces(placesWithDistance)
        setFilteredPlaces(placesWithDistance)
      } else {
        setError("No health centers found in your area. Try expanding your search radius or check your location settings.")
        setPlaces([])
        setFilteredPlaces([])
      }
    } catch (error) {
      console.error("Error fetching health centers:", error)
      setError("Unable to fetch health centers. Please check your internet connection and try again.")
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
    <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px] sm:h-[300px] sm:w-[300px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px] sm:h-[300px] sm:w-[300px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <div className="flex flex-col items-center justify-center p-6 text-foreground min-h-screen">
          <h1 className="text-3xl font-bold mb-6 pt-20 text-center">Accessible Healthcare Locations</h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {loading && <p className="text-blue-400 mb-4 text-center">🔍 Searching for healthcare facilities...</p>}

          {/* Advanced Filters Section */}
          <div className="w-full max-w-6xl mb-6 bg-card rounded-lg p-4 border">
            <h2 className="text-xl font-semibold mb-4">🔧 Search & Filter Options</h2>
        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-1">
                  🔍 Search by Name
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search facilities..."
                  className="w-full p-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground"
                />
              </div>

              {/* Facility Type Filter */}
              <div>
                <label htmlFor="facility-type" className="block text-sm font-medium text-muted-foreground mb-1">
                  🏥 Facility Type
                </label>
                <select
                  id="facility-type"
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
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
                <label htmlFor="distance" className="block text-sm font-medium text-muted-foreground mb-1">
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
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1km</span>
                  <span>50km</span>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-muted-foreground mb-1">
                  📊 Sort By
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                >
                  <option value="distance">📏 Distance</option>
                  <option value="name">🔤 Name</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 pt-3 border-t">
              <p className="text-sm text-muted-foreground">
                📋 Showing <span className="text-blue-500 font-semibold">{filteredPlaces.length}</span> out of{" "}
                <span className="text-green-500 font-semibold">{places.length}</span> healthcare facilities
                {searchTerm && <span className="text-yellow-500"> matching "{searchTerm}"</span>}
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
                  className="w-full h-full rounded-lg border"
                />
              </div>
            )}

            {/* Places List (Right) */}
            <div className="w-full md:w-[45%] h-[350px] sm:h-[450px] md:h-[550px] overflow-y-auto custom-scrollbar">
              {filteredPlaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p className="text-lg mb-2">🔍 No facilities found</p>
                  <p className="text-sm text-center">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <ul className="space-y-3 sm:space-y-4 p-2 sm:p-4">
                  {filteredPlaces.map((place, index) => (
                  <li
                    key={index}
                    className="border p-3 sm:p-5 rounded-lg bg-card shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <strong className="text-base sm:text-lg md:text-xl font-semibold text-blue-500">{place.name}</strong>
                        <span className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground">
                          {place.type === 'hospital' ? '🏥' : 
                           place.type === 'clinic' ? '🏢' :
                           place.type === 'doctor' ? '👨‍⚕️' :
                           place.type === 'pharmacy' ? '💊' :
                           place.type === 'emergency' ? '🚨' : '⚕️'} {place.type}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg italic text-muted-foreground">{place.vicinity}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">📍 {place.distance.toFixed(2)} km away</p>

                      {/* Additional Information */}
                      {place.phone && (
                        <p className="text-xs sm:text-sm text-muted-foreground">📞 {place.phone}</p>
                      )}
                      {place.opening_hours && (
                        <p className="text-xs sm:text-sm text-muted-foreground">🕒 {place.opening_hours}</p>
                      )}

                      {/* Action Links */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <a
                          href={place.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-xs sm:text-sm"
                        >
                          🗺️ View on Map
                        </a>
                        
                        {place.website && (
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-xs sm:text-sm"
                          >
                            🌐 Website
                          </a>
                        )}
                        
                        {place.phone && (
                          <a
                            href={`tel:${place.phone}`}
                            className="text-green-500 hover:underline text-xs sm:text-sm"
                          >
                            📞 Call
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

