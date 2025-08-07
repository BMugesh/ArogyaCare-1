"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Bot,
  MapPin,
  Newspaper,
  BarChart3,
  Users,
  Stethoscope,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Pill,
  Navigation,
  AlertTriangle
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useLanguagePreferences } from "@/hooks/useLanguagePreferences"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Badge } from "@/components/ui/badge"

// Static translations mapping
const allTranslations = {
  'en': { lang: "English", text: "ArogyaCare", greeting: "Hello" },
  'hi': { lang: "हिन्दी", text: "आरोग्यकेयर", greeting: "नमस्ते" },
  'gu': { lang: "ગુજરાતી", text: "આરોગ્યકેર", greeting: "નમસ્તે" },
  'bn': { lang: "বাংলা", text: "আরোগ্যকেয়ার", greeting: "নমস্কার" },
  'mr': { lang: "मराठी", text: "आरोग्यकेअर", greeting: "नमस्कार" },
  'ta': { lang: "தமிழ்", text: "ஆரோக்கியகேர்", greeting: "வணக்கம்" },
  'te': { lang: "తెలుగు", text: "ఆరోగ్యకేర్", greeting: "నమస్కారం" },
  'kn': { lang: "ಕನ್ನಡ", text: "ಆರೋಗ್ಯಕೇರ್", greeting: "ನಮಸ್ಕಾರ" },
  'ml': { lang: "മലയാളം", text: "ആരോഗ്യകേർ", greeting: "നമസ്കാരം" },
  'pa': { lang: "ਪੰਜਾਬੀ", text: "ਆਰੋਗਿਆਕੇਅਰ", greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
  'or': { lang: "ଓଡ଼ିଆ", text: "ଆରୋଗ୍ୟକେୟାର", greeting: "ନମସ୍କାର" },
  'as': { lang: "অসমীয়া", text: "আৰোগ্যকেয়াৰ", greeting: "নমস্কাৰ" }
}

export default function Navbar() {
  const [indexLeft, setIndexLeft] = useState(0)
  const [indexRight, setIndexRight] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false) // Controls dropdown expansion
  const [locationStatus, setLocationStatus] = useState<'granted' | 'denied' | 'pending' | null>(null)
  const { user, logout } = useAuth()
  const { preferences, loading } = useLanguagePreferences()
  const pathname = usePathname()

  // Get user's languages for cycling
  const getUserLanguages = () => {
    if (!preferences || loading) {
      return [allTranslations['en']]; // Default to English
    }
    
    const userLangs = [allTranslations[preferences.primaryLanguage.code]];
    if (preferences.secondaryLanguage) {
      userLangs.push(allTranslations[preferences.secondaryLanguage.code]);
    }
    return userLangs.filter(Boolean); // Remove any undefined
  }

  const userTranslations = getUserLanguages()

  // Check location permission when on g-map page
  useEffect(() => {
    if (pathname === '/g-map') {
      setLocationStatus('pending')
      navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
        setLocationStatus(result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'pending')
      }).catch(() => {
        // Fallback: try to get location directly
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            () => setLocationStatus('granted'),
            () => setLocationStatus('denied'),
            { timeout: 5000 }
          )
        }
      })
    } else {
      setLocationStatus(null)
    }
  }, [pathname])

  useEffect(() => {
    const intervalLeft = setInterval(() => {
      setIndexLeft((prevIndex) => (prevIndex + 1) % userTranslations.length)
    }, 3000)

    const intervalRight = setInterval(() => {
      setIndexRight((prevIndex) => (prevIndex + 1) % userTranslations.length)
    }, 3000)

    return () => {
      clearInterval(intervalLeft)
      clearInterval(intervalRight)
    }
  }, [userTranslations.length])

  // Helper function to check if a path is active
  const isActivePath = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-lg shadow-lg">
      <div className="container flex h-14 sm:h-16 max-w-screen-2xl items-center justify-between px-3 sm:px-4 lg:px-8">
        {/* Left Side: Logo with Healthcare Icon */}
        <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
          <Link href="/hero" className="flex items-center space-x-1 sm:space-x-2 group">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <span className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent transition-all duration-1000 whitespace-nowrap">
              <span className="hidden sm:inline">{userTranslations[indexLeft]?.text || "ArogyaCare"}</span>
              <span className="sm:hidden">AC</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navbar Links */}
        <nav className="hidden lg:flex flex-1 items-center justify-center space-x-1">
          <Link
            href="/health-check"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
              isActivePath('/health-check') 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <Bot className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaMitraAI</span>
          </Link>
          <Link
            href="/find-doctor"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
              isActivePath('/find-doctor') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'hover:bg-green-50 hover:text-green-600'
            }`}
          >
            <Stethoscope className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>ArogyaCare</span>
          </Link>
          <Link
            href="/g-map"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group relative ${
              isActivePath('/g-map') 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaMap</span>
            {isActivePath('/g-map') && locationStatus && (
              <div className="absolute -top-1 -right-1">
                {locationStatus === 'granted' && (
                  <Navigation className="h-3 w-3 text-green-600" title="Location access granted" />
                )}
                {locationStatus === 'denied' && (
                  <AlertTriangle className="h-3 w-3 text-red-600" title="Location access denied" />
                )}
                {locationStatus === 'pending' && (
                  <div className="h-3 w-3 bg-yellow-500 rounded-full animate-pulse" title="Requesting location access" />
                )}
              </div>
            )}
          </Link>
          <Link
            href="/news-help"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
              isActivePath('/news-help') 
                ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                : 'hover:bg-orange-50 hover:text-orange-600'
            }`}
          >
            <Newspaper className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaPulse</span>
          </Link>
          <Link
            href="/health-insights"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group relative ${
              isActivePath('/health-insights') 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaView</span>
            {!user && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 ml-1">
                FREE
              </Badge>
            )}
          </Link>
          <Link
            href="/our-team"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group relative ${
              isActivePath('/our-team') 
                ? 'bg-pink-100 text-pink-700 border border-pink-200' 
                : 'hover:bg-pink-50 hover:text-pink-600'
            }`}
          >
            <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaParivar</span>
            {!user && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 ml-1">
                FREE
              </Badge>
            )}
          </Link>
          <Link
            href="/prescriptions"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
              isActivePath('/prescriptions') 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Pill className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>ArogyaScript</span>
          </Link>
          
          {/* Emergency Quick Access for G-Map */}
          {isActivePath('/g-map') && (
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white animate-pulse border border-red-400"
              onClick={() => {
                // This would trigger emergency facility search
                const event = new CustomEvent('searchEmergency', { detail: 'emergency' })
                window.dispatchEvent(event)
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Emergency
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="relative lg:hidden order-2">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium transition-all duration-300 hover:shadow-lg"
            aria-expanded={dropdownOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {dropdownOpen ? <X size={16} className="sm:w-4 sm:h-4" /> : <Menu size={16} className="sm:w-4 sm:h-4" />}
            <span className="hidden xs:inline text-xs sm:text-sm">Menu</span>
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-25 z-40" 
                onClick={() => setDropdownOpen(false)}
              ></div>
              
              {/* Menu */}
              <div
                id="mobile-menu"
                className="absolute top-12 right-0 w-64 xs:w-72 sm:w-80 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto"
              >
                <div className="py-2">
                <Link
                  href="/health-check"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Bot className="h-5 w-5" />
                  <span className="font-medium">AarogyaMitraAI</span>
                </Link>
                <Link
                  href="/find-doctor"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Stethoscope className="h-5 w-5" />
                  <span className="font-medium">ArogyaCare</span>
                </Link>
                <Link
                  href="/g-map"
                  className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${
                    isActivePath('/g-map')
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-l-4 border-purple-500'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600'
                  }`}
                  onClick={() => setDropdownOpen(false)}
                >
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">AarogyaMap</span>
                  {isActivePath('/g-map') && locationStatus && (
                    <div className="ml-auto">
                      {locationStatus === 'granted' && (
                        <Navigation className="h-4 w-4 text-green-600" />
                      )}
                      {locationStatus === 'denied' && (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      {locationStatus === 'pending' && (
                        <div className="h-4 w-4 bg-yellow-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  )}
                </Link>
                <Link
                  href="/news-help"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Newspaper className="h-5 w-5" />
                  <span className="font-medium">AarogyaPulse</span>
                </Link>
                <Link
                  href="/health-insights"
                  className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-medium">AarogyaView</span>
                  </div>
                  {!user && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      FREE
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/our-team"
                  className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">AarogyaParivar</span>
                  </div>
                  {!user && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      FREE
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/prescriptions"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Pill className="h-5 w-5" />
                  <span className="font-medium">ArogyaScript</span>
                </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Auth Section */}
        <div className="flex items-center space-x-1 sm:space-x-2 order-3 lg:order-none flex-shrink-0">
          
          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-1">
              <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded-lg max-w-20 lg:max-w-24">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-600 truncate">
                  {user.email}
                </span>
              </div>
              <Button
                onClick={() => logout()}
                size="sm"
                variant="outline"
                className="flex items-center space-x-1 px-2 sm:px-3"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Out</span>
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="flex items-center space-x-1 px-2 sm:px-3">
                <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline text-xs sm:text-sm">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

