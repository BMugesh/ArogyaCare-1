"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ExternalLink, Search, Newspaper } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface NewsArticle {
  title: string
  description: string
  content: string
  url: string
  source: string
  date: string
}

interface NewsResponse {
  news: string
}

const translations = [
  {
    lang: "English",
    heading: "Get Health News",
    placeholder: "Select a language...",
    buttonText: "Get News",
    loadingText: "Fetching news...",
    responseTitle: "News Results",
    homeButtonText: "Back to Home",
    readMore: "Read More",
  },
  {
    lang: "हिन्दी",
    heading: "स्वास्थ्य समाचार प्राप्त करें",
    placeholder: "भाषा चुनें...",
    buttonText: "समाचार प्राप्त करें",
    loadingText: "समाचार लोड हो रहे हैं...",
    responseTitle: "समाचार परिणाम",
    homeButtonText: "होम पेज पर वापस जाएं",
    readMore: "पूरा पढ़ें",
  },
  {
    lang: "ગુજરાતી",
    heading: "સ્વાસ્થ્ય સમાચાર મેળવો",
    placeholder: "ભાષા પસંદ કરો...",
    buttonText: "સમાચાર મેળવો",
    loadingText: "સમાચાર લોડ થાય છે...",
    responseTitle: "સમાચાર પરિણામો",
    homeButtonText: "હોમ પેજ પર પાછા જાઓ",
    readMore: "વધુ વાંચો",
  },
  {
    lang: "বাংলা",
    heading: "স্বাস্থ্য সংবাদ পান",
    placeholder: "একটি ভাষা নির্বাচন করুন...",
    buttonText: "সংবাদ পান",
    loadingText: "সংবাদ লোড হচ্ছে...",
    responseTitle: "সংবাদ ফলাফল",
    homeButtonText: "হোম পেজে ফিরে যান",
    readMore: "আরও পড়ুন",
  },
  {
    lang: "मराठी",
    heading: "आरोग्य बातम्या प्राप्त करा",
    placeholder: "भाषा निवडा...",
    buttonText: "बातम्या प्राप्त करा",
    loadingText: "बातम्या लोड होत आहेत...",
    responseTitle: "बातम्या परिणाम",
    homeButtonText: "होम पेजवर परत जा",
    readMore: "अधिक वाचा",
  },
  {
    lang: "தமிழ்",
    heading: "சுகாதார செய்திகளைப் பெறுங்கள்",
    placeholder: "ஒரு மொழியைத் தேர்ந்தெடுக்கவும்...",
    buttonText: "செய்திகளைப் பெறுங்கள்",
    loadingText: "செய்திகள் ஏற்றப்படுகின்றன...",
    responseTitle: "செய்தி முடிவுகள்",
    homeButtonText: "முகப்பு பக்கத்திற்கு திரும்புக",
    readMore: "மேலும் படிக்க",
  },
];

export default function NewsHelp() {
  const [language, setLanguage] = useState("English")
  const [apiResponse, setApiResponse] = useState<NewsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [index, setIndex] = useState(0) // Index for translations
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [refreshCountdown, setRefreshCountdown] = useState(10)
  const router = useRouter()

  const languages = [
    "English",
    "Hindi",
    "Marathi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Gujarati",
    "Punjabi",
    "Malayalam",
    "Kannada",
    "Odia",
  ]

  // Find the corresponding translation index based on the selected language
  useEffect(() => {
    const langMap: Record<string, number> = {
      "English": 0,
      "Hindi": 1,
      "Marathi": 4,
      "Bengali": 3,
      "Tamil": 5,
      "Gujarati": 2
    }

    setIndex(langMap[language] || 0)
  }, [language])

  // Auto-refresh functionality
  useEffect(() => {
    // Initial load with English by default
    handleGetNews()
  }, []) // Load news on component mount

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return

    const refreshInterval = setInterval(() => {
      handleGetNews(true) // Pass true for auto-refresh
    }, 10000) // Refresh every 10 seconds

    return () => clearInterval(refreshInterval)
  }, [autoRefresh, language])

  // Refresh when language changes
  useEffect(() => {
    if (language) {
      handleGetNews()
      setRefreshCountdown(10) // Reset countdown when language changes
    }
  }, [language])

  // Countdown timer for next refresh
  useEffect(() => {
    if (!autoRefresh || loading) return

    const countdownInterval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          return 10 // Reset to 10 seconds
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [autoRefresh, loading, lastRefresh])

  const parseNewsResponse = (responseText: string) => {
    try {
      // Split the response into articles
      const articleBlocks = responseText.split("\n\nTitle: ")
      const parsedArticles: NewsArticle[] = []

      articleBlocks.forEach((block, index) => {
        if (index === 0 && !block.startsWith("Title: ")) return

        const articleText = index === 0 ? block : "Title: " + block
        const titleMatch = articleText.match(/Title: (.*?)(?:\n|$)/)
        const descriptionMatch = articleText.match(/Description: (.*?)(?:\n|$)/)
        const contentMatch = articleText.match(/Content: ([\s\S]*?)(?:\nURL:|$)/)
        const urlMatch = articleText.match(/URL: (.*?)(?:\n|$)/)
        const sourceMatch = articleText.match(/Source: (.*?)(?:\n|$)/)
        const dateMatch = articleText.match(/Date: (.*?)(?:\n|$)/)

        if (titleMatch) {
          parsedArticles.push({
            title: titleMatch[1] || "",
            description: descriptionMatch ? descriptionMatch[1] : "",
            content: contentMatch ? contentMatch[1] : "",
            url: urlMatch ? urlMatch[1] : "",
            source: sourceMatch ? sourceMatch[1] : "",
            date: dateMatch ? dateMatch[1] : "",
          })
        }
      })

      setArticles(parsedArticles)
    } catch (error) {
      console.error("Error parsing news response:", error)
      setError("समाचार डेटा पार्स करने में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    }
  }

  const handleGetNews = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setLoading(true)
      setError(null)
      setArticles([]) // Clear previous articles only for manual refresh
    }

    const startTime = Date.now()

    try {
      // Add timeout for better user experience
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      // Fetch news from the API
      const res = await fetch("http://127.0.0.1:5000/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setApiResponse(data)

      if (data.news) {
        parseNewsResponse(data.news)
        const responseTime = Date.now() - startTime
        console.log(`News fetched in ${responseTime}ms`)
        setLastRefresh(new Date())
        setRefreshCountdown(10) // Reset countdown
      } else {
        throw new Error("No news data received")
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      let errorMessage = "समाचार प्राप्त करने में त्रुटि हुई। कृपया पुनः प्रयास करें।"

      if (error.name === 'AbortError') {
        errorMessage = "समाचार लोड करने में अधिक समय लग रहा है। कृपया पुनः प्रयास करें।"
      }

      setError(errorMessage)
    } finally {
      if (!isAutoRefresh) {
        setLoading(false)
      }
    }
  }

  const handleManualRefresh = () => {
    handleGetNews(false)
  }

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
    if (!autoRefresh) {
      setRefreshCountdown(10)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("hi-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Get translation for the currently selected language
  const getTranslation = (key: string) => {
    const currentTranslation = translations[index]
    return currentTranslation[key as keyof typeof currentTranslation] || ""
  }

  return (
    <div className="min-h-screen flex flex-col bg-black dark:bg-black text-white">
      <Navbar />
      
      {/* Search Section - Fixed at Top */}
      <div className="bg-black dark:bg-black text-white py-8 px-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">{getTranslation("heading")}</h1>
          
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            <div className="flex-1">
              <select
                className="w-full px-4 py-3 rounded-lg bg-black dark:bg-black text-white placeholder-gray-400 border border-gray-700"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                title="Select language for news"
              >
                {languages.map((lang, idx) => (
                  <option key={idx} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <Button
              className="flex items-center justify-center gap-2 hover:bg-[#b9b9b9] min-w-[120px]"
              onClick={handleManualRefresh}
              disabled={loading}
            >
              <Newspaper size={18} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>


        </div>
      </div>
      
      {/* Results Section - Expanded Area Below */}
      <div className="flex-grow dark:bg-black text-white px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-500 rounded-full animate-spin animation-delay-150"></div>
              </div>
              <p className="text-gray-300 text-lg mb-2">{getTranslation("loadingText")}</p>
              <p className="text-gray-500 text-sm">🏥 Fetching latest healthcare news from trusted sources...</p>
              <div className="flex space-x-1 mt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-700">
              <p className="text-red-400">{error}</p>
            </div>
          ) : articles.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white pb-2 border-b border-gray-700">
                {translations[index].responseTitle}
              </h2>
              
              {/* Performance Indicator */}
              <div className="mb-4 text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-900 text-green-300">
                    ⚡ Fast Healthcare News • {articles.length} articles loaded
                  </span>
                  {autoRefresh && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-900 text-blue-300">
                      🔄 Auto-refresh ON • Every 10s
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-900 text-purple-300">
                    🌐 Language: {language}
                  </span>
                </div>
              </div>

              {/* News Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {articles.map((article, idx) => {
                  // Determine article category based on content
                  const getCategory = (title, content) => {
                    const text = (title + " " + content).toLowerCase()
                    if (text.includes('vaccine') || text.includes('immunization')) return { name: 'Vaccination', color: 'bg-blue-600' }
                    if (text.includes('covid') || text.includes('coronavirus')) return { name: 'COVID-19', color: 'bg-red-600' }
                    if (text.includes('nutrition') || text.includes('diet')) return { name: 'Nutrition', color: 'bg-green-600' }
                    if (text.includes('mental') || text.includes('stress')) return { name: 'Mental Health', color: 'bg-purple-600' }
                    if (text.includes('child') || text.includes('maternal')) return { name: 'Mother & Child', color: 'bg-pink-600' }
                    if (text.includes('scheme') || text.includes('ayushman')) return { name: 'Health Schemes', color: 'bg-orange-600' }
                    return { name: 'General Health', color: 'bg-gray-600' }
                  }

                  const category = getCategory(article.title, article.content)

                  return (
                    <div
                      key={idx}
                      className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col border border-gray-700 hover:border-blue-500"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${category.color}`}>
                          {category.name}
                        </span>
                        <span className="text-xs text-gray-500">#{idx + 1}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-blue-400 mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-300 mb-3 text-sm">{article.description}</p>
                      <p className="text-gray-400 mb-4 flex-grow text-sm leading-relaxed">
                        {article.content.substring(0, 180)}...
                      </p>

                      <div className="flex justify-between items-center text-xs text-gray-500 mb-3 pt-2 border-t border-gray-700">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {article.source}
                        </span>
                        <span>{formatDate(article.date)}</span>
                      </div>

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium text-sm inline-flex items-center transition-colors duration-200 hover:bg-blue-900/20 px-2 py-1 rounded"
                      >
                        {translations[index].readMore}
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="dark:bg-black text-white shadow-md p-8 text-center border border-gray-700 rounded-lg">
              <div className="flex flex-col items-center justify-center py-12">
                <Newspaper size={48} className="text-gray-500 mb-4" />
                <p className="text-gray-400 text-lg">
                  {getTranslation("placeholder")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Back to Home Button */}
      <div className="dark:bg-black text-white pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 hover:bg-[#b9b9b9]"
            onClick={() => router.push("/")}
          >
            {getTranslation("homeButtonText")}
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

