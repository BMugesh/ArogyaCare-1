"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
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
  Pill
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useLanguagePreferences } from "@/hooks/useLanguagePreferences"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

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
  const { user, logout } = useAuth()
  const { preferences, loading } = useLanguagePreferences()

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-lg shadow-lg">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo with Healthcare Icon */}
        <div className="flex items-center space-x-3">
          <Link href="/hero" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent transition-all duration-1000 sm:text-2xl lg:text-3xl">
              {userTranslations[indexLeft]?.text || "ArogyaCare"}
            </span>
          </Link>
        </div>

        {/* Desktop Navbar Links */}
        <nav className="hidden lg:flex flex-1 items-center justify-center space-x-1">
          <Link
            href="/health-check"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 group"
          >
            <Bot className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaMitraAI</span>
          </Link>
          <Link
            href="/find-doctor"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-green-50 hover:text-green-600 group"
          >
            <Stethoscope className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>ArogyaCare</span>
          </Link>
          <Link
            href="/g-map"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-50 hover:text-purple-600 group"
          >
            <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaMap</span>
          </Link>
          <Link
            href="/news-help"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-orange-50 hover:text-orange-600 group"
          >
            <Newspaper className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaPulse</span>
          </Link>
          <Link
            href="/health-insights"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 group"
          >
            <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaView</span>
          </Link>
          <Link
            href="/our-team"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 group"
          >
            <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>AarogyaParivar</span>
          </Link>
          <Link
            href="/prescriptions"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-50 hover:text-purple-600 group"
          >
            <Pill className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>ArogyaScript</span>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium transition-all duration-300 hover:shadow-lg"
            aria-expanded={dropdownOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {dropdownOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="hidden sm:inline text-sm">Menu</span>
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
                className="absolute top-12 right-0 w-72 sm:w-80 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
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
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">AarogyaMap</span>
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
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">AarogyaView</span>
                </Link>
                <Link
                  href="/our-team"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 transition-all duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">AarogyaParivar</span>
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
        <div className="flex items-center space-x-2">
          {/* Animated Greeting */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <Heart className="h-4 w-4 text-white animate-pulse" />
            <span className="text-sm font-medium text-white transition-all duration-1000">
              {userTranslations[indexRight]?.greeting || "Hello"}
            </span>
          </div>
          <div className="sm:hidden">
            <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent transition-all duration-1000">
              {userTranslations[indexRight]?.greeting || "Hello"}
            </span>
          </div>
          
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2 px-2 py-1 bg-blue-50 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600 max-w-24 truncate">
                  {user.email}
                </span>
              </div>
              <Button
                onClick={() => logout()}
                size="sm"
                variant="outline"
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="flex items-center space-x-1">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

