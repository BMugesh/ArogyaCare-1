"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Search, MapPin, Building2, Users, Star, Phone, Clock, Filter, Hospital } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import dynamic from "next/dynamic"
import { API_ENDPOINTS } from "@/lib/config"

// Dynamically import map component to avoid SSR issues
const HealthCentersMap = dynamic(() => import("@/app/components/HealthCentersMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">Loading map...</div>
})

export default function FindDoctor() {
  const [condition, setCondition] = useState("")
  const [location, setLocation] = useState("")
  const [hospitalResults, setHospitalResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [nearbyHealthCenters, setNearbyHealthCenters] = useState([])
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const router = useRouter()

  // Medical specialties for better hospital matching
  const specialties = [
    "Cardiology", "Neurology", "Orthopedics", "Emergency Medicine", 
    "Pediatrics", "Oncology", "Gastroenterology", "Dermatology",
    "Psychiatry", "Radiology", "General Surgery", "Internal Medicine"
  ]

  // Condition to specialty mapping for smart suggestions
  const conditionSpecialtyMap = {
    "heart": "Cardiology",
    "brain": "Neurology", 
    "bone": "Orthopedics",
    "skin": "Dermatology",
    "stomach": "Gastroenterology",
    "cancer": "Oncology",
    "child": "Pediatrics",
    "mental": "Psychiatry",
    "emergency": "Emergency Medicine"
  }

  // Smart specialty suggestion based on condition
  const getSuggestedSpecialty = (condition) => {
    const lowerCondition = condition.toLowerCase()
    for (const [keyword, specialty] of Object.entries(conditionSpecialtyMap)) {
      if (lowerCondition.includes(keyword)) {
        return specialty
      }
    }
    return ""
  }

  const handleFindHospitals = async () => {
    if (!location.trim()) return

    setLoading(true)
    setHospitalResults(null)
    
    try {
      // Mock hospital data - in real app, this would be an API call
      const mockHospitals = [
        {
          name: "City General Hospital",
          address: `123 Main St, ${location}`,
          specialties: ["Emergency Medicine", "Cardiology", "General Surgery"],
          rating: 4.5,
          distance: "0.8 km",
          phone: "+1-555-0123",
          type: "General Hospital",
          availability: "24/7"
        },
        {
          name: "Heart Care Specialty Center",
          address: `456 Oak Ave, ${location}`,
          specialties: ["Cardiology", "Cardiac Surgery", "Interventional Cardiology"],
          rating: 4.8,
          distance: "1.2 km",
          phone: "+1-555-0456",
          type: "Specialty Hospital",
          availability: "6 AM - 10 PM"
        },
        {
          name: "Children's Medical Center",
          address: `789 Pine St, ${location}`,
          specialties: ["Pediatrics", "Pediatric Surgery", "NICU"],
          rating: 4.7,
          distance: "2.1 km", 
          phone: "+1-555-0789",
          type: "Children's Hospital",
          availability: "24/7"
        }
      ]

      // Filter hospitals based on condition and specialty
      let filteredHospitals = mockHospitals
      const suggestedSpecialty = getSuggestedSpecialty(condition)
      
      if (selectedSpecialty || suggestedSpecialty) {
        const targetSpecialty = selectedSpecialty || suggestedSpecialty
        filteredHospitals = mockHospitals.filter(hospital => 
          hospital.specialties.some(spec => 
            spec.toLowerCase().includes(targetSpecialty.toLowerCase())
          )
        )
      }

      setHospitalResults({ hospitals: filteredHospitals, suggestedSpecialty })
    } catch (error) {
      console.error("Error fetching hospitals:", error)
      setHospitalResults({ error: "Failed to fetch hospitals. Please try again." })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      {/* Enhanced Search Section */}
      <div className="bg-black text-white py-6 sm:py-8 px-3 sm:px-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
            🏥 Find Hospitals Near You
          </h1>

          <p className="text-center text-gray-400 mb-6 max-w-2xl mx-auto">
            Discover hospitals and medical centers in your area with specialized care for your health needs
          </p>

          {/* Main Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div className="lg:col-span-2">
              <input
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 text-sm sm:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your health condition or symptoms..."
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>

            <div>
              <input
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 text-sm sm:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800 text-white border border-gray-700 text-sm sm:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                aria-label="Select medical specialty"
              >
                <option value="">Select Specialty</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Smart Suggestions */}
          {condition && getSuggestedSpecialty(condition) && (
            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-400">
                💡 Based on your condition, we suggest looking for: 
                <Badge className="ml-2 bg-blue-600 text-white">
                  {getSuggestedSpecialty(condition)}
                </Badge>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
            <Button
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2 sm:py-3"
              onClick={handleFindHospitals}
              disabled={loading || !location.trim()}
            >
              <Hospital size={16} />
              {loading ? "Searching..." : "Find Hospitals"}
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 border-gray-600 hover:bg-gray-700 text-sm sm:text-base py-2 sm:py-3"
              onClick={() => setShowMap(!showMap)}
            >
              <MapPin size={16} />
              {showMap ? "Hide Map" : "Show Map"}
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 border-gray-600 hover:bg-gray-700 text-sm sm:text-base py-2 sm:py-3"
              onClick={() => {
                setCondition("")
                setLocation("")
                setSelectedSpecialty("")
                setHospitalResults(null)
              }}
            >
              <Filter size={16} />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {showMap && (
        <div className="bg-black text-white px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white pb-2 border-b border-gray-700">
              Nearby Healthcare Locations
            </h2>
            <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-700">
              <HealthCentersMap onHealthCentersUpdate={setNearbyHealthCenters} />
            </div>
            {nearbyHealthCenters.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyHealthCenters.slice(0, 6).map((center, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">{center.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">{center.address}</p>
                    {center.distance && (
                      <p className="text-xs text-blue-400">{center.distance.toFixed(2)} km away</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Section - Expanded Area Below */}
      <div className="flex-grow bg-black text-white px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Hospital Results */}
          {hospitalResults && hospitalResults.hospitals && hospitalResults.hospitals.length > 0 && (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Hospital className="h-6 w-6" />
                  Nearby Hospitals
                  {hospitalResults.suggestedSpecialty && (
                    <Badge className="ml-2 bg-blue-600 text-white text-xs">
                      Specialized in {hospitalResults.suggestedSpecialty}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Found {hospitalResults.hospitals.length} hospitals in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {hospitalResults.hospitals.map((hospital, index) => (
                    <Card key={index} className="bg-gray-800/50 border-gray-600 hover:border-blue-500/50 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-white mb-1">{hospital.name}</CardTitle>
                            <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                              {hospital.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm font-medium">{hospital.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm text-gray-300">
                          <MapPin className="inline h-4 w-4 mr-2 text-blue-400" />
                          {hospital.address}
                        </div>
                        <div className="text-sm text-gray-300">
                          <Building2 className="inline h-4 w-4 mr-2 text-purple-400" />
                          {hospital.distance} away
                        </div>
                        <div className="text-sm text-gray-300">
                          <Clock className="inline h-4 w-4 mr-2 text-green-400" />
                          {hospital.availability}
                        </div>
                        <div className="text-sm text-gray-300">
                          <Phone className="inline h-4 w-4 mr-2 text-orange-400" />
                          {hospital.phone}
                        </div>
                        <Separator className="bg-gray-600" />
                        <div>
                          <p className="text-xs text-gray-400 mb-2">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {hospital.specialties.map((specialty, idx) => (
                              <Badge 
                                key={idx} 
                                className={`text-xs ${
                                  (selectedSpecialty && specialty.includes(selectedSpecialty)) || 
                                  (hospitalResults.suggestedSpecialty && specialty.includes(hospitalResults.suggestedSpecialty))
                                    ? "bg-blue-600 text-white" 
                                    : "bg-gray-700 text-gray-300"
                                }`}
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}



          {/* No Results State */}
          {!hospitalResults && (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center justify-center py-12">
                  <Hospital size={48} className="text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Find Hospitals Near You
                  </h3>
                  <p className="text-gray-400 text-lg mb-4">
                    Enter your location and condition to find specialized hospitals
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-blue-400 border-blue-400">Specialty Matching</Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400">Distance & Ratings</Badge>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">24/7 Availability</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {hospitalResults && hospitalResults.error && (
            <Card className="bg-red-900/20 border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="p-2 bg-red-500/20 rounded-full">
                    <Hospital className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hospital Search Error</h3>
                    <p className="text-sm text-red-300">{hospitalResults.error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="bg-black text-white pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border-gray-600 hover:bg-gray-700"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
