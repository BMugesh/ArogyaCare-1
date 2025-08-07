"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, Phone, MapPin, User, Heart, Activity, AlertCircle, Save, Edit2, Camera } from "lucide-react"

interface UserProfile {
  displayName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  bloodGroup: string
  allergies: string
  medications: string
  medicalConditions: string
  height: string
  weight: string
  bio: string
  photoURL: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    bloodGroup: "",
    allergies: "",
    medications: "",
    medicalConditions: "",
    height: "",
    weight: "",
    bio: "",
    photoURL: ""
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      // Initialize profile with user data
      setProfile(prev => ({
        ...prev,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || ""
      }))
      
      // Load additional profile data from localStorage or API
      loadProfileData()
    }
  }, [user, loading, router])

  const loadProfileData = () => {
    try {
      const savedProfile = localStorage.getItem(`profile_${user?.uid}`)
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(prev => ({ ...prev, ...parsedProfile }))
      }
    } catch (error) {
      console.error("Error loading profile data:", error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setMessage("")

    try {
      // Save profile data to localStorage (in a real app, this would be saved to a database)
      localStorage.setItem(`profile_${user?.uid}`, JSON.stringify(profile))
      setMessage("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      setError("Failed to save profile. Please try again.")
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

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
        
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal and medical information</p>
            </div>

            {/* Messages */}
            {message && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Profile Header Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                      <AvatarFallback className="text-xl">
                        {getInitials(profile.displayName || profile.email)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-1 -right-1 h-8 w-8 p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{profile.displayName || "User"}</h2>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {profile.email}
                    </div>
                    {profile.phone && (
                      <div className="flex items-center text-muted-foreground mt-1">
                        <Phone className="h-4 w-4 mr-2" />
                        {profile.phone}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isSaving}
                    className="ml-auto"
                  >
                    {isSaving ? (
                      "Saving..."
                    ) : isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Sections */}
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Your basic personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="displayName">Full Name</Label>
                        <Input
                          id="displayName"
                          value={profile.displayName}
                          onChange={(e) => handleInputChange("displayName", e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={!isEditing}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={profile.gender} 
                          onValueChange={(value) => handleInputChange("gender", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={profile.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your full address"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Tell us a bit about yourself"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Medical Information */}
              <TabsContent value="medical">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Medical Information
                    </CardTitle>
                    <CardDescription>
                      Your health information for better care
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select 
                          value={profile.bloodGroup} 
                          onValueChange={(value) => handleInputChange("bloodGroup", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          value={profile.height}
                          onChange={(e) => handleInputChange("height", e.target.value)}
                          disabled={!isEditing}
                          placeholder="175"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          value={profile.weight}
                          onChange={(e) => handleInputChange("weight", e.target.value)}
                          disabled={!isEditing}
                          placeholder="70"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea
                        id="allergies"
                        value={profile.allergies}
                        onChange={(e) => handleInputChange("allergies", e.target.value)}
                        disabled={!isEditing}
                        placeholder="List any allergies you have (food, medication, environmental)"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea
                        id="medications"
                        value={profile.medications}
                        onChange={(e) => handleInputChange("medications", e.target.value)}
                        disabled={!isEditing}
                        placeholder="List current medications and dosages"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="medicalConditions">Medical Conditions</Label>
                      <Textarea
                        id="medicalConditions"
                        value={profile.medicalConditions}
                        onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                        disabled={!isEditing}
                        placeholder="List any chronic conditions or medical history"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Emergency Contact */}
              <TabsContent value="emergency">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Emergency Contact
                    </CardTitle>
                    <CardDescription>
                      Contact information for emergency situations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          value={profile.emergencyContact}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                          disabled={!isEditing}
                          placeholder="Full name of emergency contact"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          value={profile.emergencyPhone}
                          onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                          disabled={!isEditing}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    {/* Health Summary Card */}
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Quick Health Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Blood Group:</span>
                          <div className="font-medium">{profile.bloodGroup || "Not set"}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Age:</span>
                          <div className="font-medium">
                            {profile.dateOfBirth ? 
                              new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : "Not set"}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Height:</span>
                          <div className="font-medium">{profile.height ? `${profile.height} cm` : "Not set"}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Weight:</span>
                          <div className="font-medium">{profile.weight ? `${profile.weight} kg` : "Not set"}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Preferences & Settings
                    </CardTitle>
                    <CardDescription>
                      Your app preferences and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive health reminders and updates</p>
                        </div>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Data Sharing</Label>
                          <p className="text-sm text-muted-foreground">Share anonymized data for research</p>
                        </div>
                        <Badge variant="outline">Disabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Emergency Access</Label>
                          <p className="text-sm text-muted-foreground">Allow medical professionals emergency access</p>
                        </div>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Cancel Button when editing */}
            {isEditing && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    loadProfileData() // Reset to saved data
                  }}
                >
                  Cancel Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
