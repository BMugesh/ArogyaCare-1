"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { API_ENDPOINTS } from "@/lib/config"
import {
  Bot,
  Send,
  Loader2,
  Heart,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Brain,
  Clock,
  User,
  MessageSquare,
  Sparkles,
  Mic
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import VapiWidget from "./VapiWidget"

const translations = [
  {
    lang: "English",
    heading: "🤖 ArogyaMitra AI Health Assistant",
    placeholder: "Describe your symptoms in detail (e.g., fever, headache, duration, severity)...",
    subheading: "Get instant AI-powered health insights and recommendations"
  },
  {
    lang: "हिन्दी",
    heading: "🤖 आरोग्य मित्र AI स्वास्थ्य सहायक",
    placeholder: "अपने लक्षणों का विस्तार से वर्णन करें (जैसे बुखार, सिरदर्द, अवधि, गंभीरता)...",
    subheading: "तत्काल AI-संचालित स्वास्थ्य अंतर्दृष्टि और सिफारिशें प्राप्त करें"
  },
  {
    lang: "ગુજરાતી",
    heading: "🤖 આરોગ્ય મિત્ર AI આરોગ્ય સહાયક",
    placeholder: "તમારા લક્ષણોનું વિગતવાર વર્ણન કરો (જેમ કે તાવ, માથાનો દુખાવો, અવધિ, ગંભીરતા)...",
    subheading: "તાત્કાલિક AI-સંચાલિત આરોગ્ય અંતર્દૃષ્ટિ અને ભલામણો મેળવો"
  },
  {
    lang: "বাংলা",
    heading: "🤖 আরোগ্য মিত্র AI স্বাস্থ্য সহায়ক",
    placeholder: "আপনার উপসর্গগুলি বিস্তারিতভাবে বর্ণনা করুন (যেমন জ্বর, মাথাব্যথা, সময়কাল, তীব্রতা)...",
    subheading: "তাৎক্ষণিক AI-চালিত স্বাস্থ্য অন্তর্দৃষ্টি এবং সুপারিশ পান"
  },
  {
    lang: "मराठी",
    heading: "🤖 आरोग्य मित्र AI आरोग्य सहाय्यक",
    placeholder: "तुमच्या लक्षणांचे तपशीलवार वर्णन करा (जसे ताप, डोकेदुखी, कालावधी, तीव्रता)...",
    subheading: "तत्काळ AI-चालित आरोग्य अंतर्दृष्टी आणि शिफारसी मिळवा"
  },
  {
    lang: "தமிழ்",
    heading: "🤖 ஆரோக்கிய மித்ரா AI ஆரோக்கிய உதவியாளர்",
    placeholder: "உங்கள் அறிகுறிகளை விரிவாக விவரிக்கவும் (காய்ச்சல், தலைவலி, கால அளவு, தீவிரம் போன்றவை)...",
    subheading: "உடனடி AI-இயங்கும் ஆரோக்கிய நுண்ணறிவு மற்றும் பரிந்துரைகளைப் பெறுங்கள்"
  },
]

const loadingMessages = [
  { text: "🔍 Analyzing your health query...", icon: Brain },
  { text: "🩺 Accessing medical knowledge base...", icon: Stethoscope },
  { text: "⚡ Generating quick health insights...", icon: Sparkles },
  { text: "📋 Preparing your personalized advice...", icon: MessageSquare },
  { text: "✨ Almost ready with your response...", icon: CheckCircle },
]

const healthcareTopics = [
  "symptoms", "fever", "headache", "cough", "cold", "flu", "pain", "infection",
  "medicine", "treatment", "doctor", "hospital", "health", "medical", "wellness",
  "nutrition", "diet", "exercise", "mental health", "stress", "sleep", "fatigue",
  "near me", "nearby", "appointment", "book", "schedule", "visit", "consultation"
]

const exampleQueries = [
  "Find hospitals near me",
  "Book appointment for fever", 
  "Hospitals for heart treatment nearby",
  "Schedule visit for headache",
  "Emergency clinics in my area",
  "Book doctor appointment",
]

const voicePrompts = [
  "🎤 Try saying: 'I have a fever and headache'",
  "🎤 Voice: 'Find doctors near me'",
  "🎤 Say: 'Book appointment for stomach pain'",
  "🎤 Voice: 'I need emergency care'",
]

export default function HealthCheck() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState(0)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [conversationHistory, setConversationHistory] = useState([])
  const [severity, setSeverity] = useState("")
  const [recommendations, setRecommendations] = useState([])
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const router = useRouter()
  const messageRef = useRef(null)

  // Vapi configuration - these should be environment variables in production
  // For now using placeholder values - update these with your actual Vapi credentials
  const VAPI_API_KEY = "your-vapi-api-key" // Replace with actual API key
  const VAPI_ASSISTANT_ID = "your-vapi-assistant-id" // Replace with actual assistant ID

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % translations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let interval
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length)
        setCurrentIndex(0)
        setCurrentMessage("")
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [loading])

  useEffect(() => {
    if (loading) {
      const messageObj = loadingMessages[loadingMessageIndex]
      const messageText = messageObj.text // Extract the text property
      const timeout = setTimeout(() => {
        setCurrentMessage(() => {
          if (currentIndex < messageText.length) {
            return messageText.substring(0, currentIndex + 1)
          } else {
            return messageText
          }
        })
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [loading, loadingMessageIndex, currentIndex])

  const isHealthcareRelated = (text) => {
    const lowerText = text.toLowerCase()
    return healthcareTopics.some(topic => lowerText.includes(topic))
  }

  const handleSubmit = async () => {
    if (!input.trim()) return

    // Quick validation for healthcare topics
    if (!isHealthcareRelated(input)) {
      setResponse("I'm ArogyaMitra, your healthcare AI assistant. I can only help with health and medical-related questions. Please ask me about symptoms, health conditions, medical advice, wellness tips, or any healthcare concerns you may have.")
      setSummary("Please ask healthcare-related questions only.")
      return
    }

    setLoading(true)
    setResponse("")
    setSummary("")
    setSeverity("")
    setRecommendations([])

    // Add user message to conversation history
    const userMessage = { type: 'user', content: input, timestamp: new Date() }
    setConversationHistory(prev => [...prev, userMessage])

    const startTime = Date.now()

    try {
      // Add timeout for faster user feedback
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const res = await fetch(API_ENDPOINTS.ASK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiResponse = data.response || "No response available."
      const aiSummary = data.summary || "No detailed response available."

      setResponse(aiResponse)
      setSummary(aiSummary)

      // Handle special actions (hospital finding, appointment booking)
      if (data.action === 'find_hospitals' || data.action === 'book_appointment') {
        setTimeout(() => {
          router.push(data.redirect || '/find-doctor')
        }, 2000) // Give user time to read the response
      }

      // Extract severity and recommendations from response
      extractStructuredData(aiResponse)

      // Add AI response to conversation history
      const responseTime = Date.now() - startTime
      const aiMessage = {
        type: 'ai',
        content: aiResponse,
        summary: aiSummary,
        timestamp: new Date(),
        responseTime: responseTime,
        action: data.action,
        condition: data.condition
      }
      setConversationHistory(prev => [...prev, aiMessage])

    } catch (error) {
      console.error("Error fetching response:", error)
      let errorMessage = "I'm having trouble connecting to the health service. Please try again in a moment."

      if (error.name === 'AbortError') {
        errorMessage = "Response is taking longer than expected. Please try with a shorter, more specific health question."
      }

      setResponse(errorMessage)

      // Add error to conversation history
      const errorAiMessage = {
        type: 'ai',
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      }
      setConversationHistory(prev => [...prev, errorAiMessage])
    }

    setLoading(false)
    setInput("") // Clear input after submission
  }

  const extractStructuredData = (responseText) => {
    // Simple extraction logic for severity and recommendations
    const lowerResponse = responseText.toLowerCase()

    if (lowerResponse.includes('emergency') || lowerResponse.includes('urgent') || lowerResponse.includes('immediately')) {
      setSeverity('high')
    } else if (lowerResponse.includes('concern') || lowerResponse.includes('monitor') || lowerResponse.includes('doctor')) {
      setSeverity('medium')
    } else {
      setSeverity('low')
    }

    // Extract recommendations (simple pattern matching)
    const sentences = responseText.split(/[.!?]+/)
    const recs = sentences
      .filter(sentence =>
        sentence.toLowerCase().includes('recommend') ||
        sentence.toLowerCase().includes('should') ||
        sentence.toLowerCase().includes('try') ||
        sentence.toLowerCase().includes('consider')
      )
      .map(rec => rec.trim())
      .filter(rec => rec.length > 10)
      .slice(0, 3) // Limit to 3 recommendations

    setRecommendations(recs)
  }

  // Voice input handlers
  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
    // Auto-submit if user stops speaking for a moment
    setTimeout(() => {
      if (transcript.trim()) {
        handleSubmit()
      }
    }, 1000)
  }

  const handleVoiceResponse = (response: string) => {
    // Handle voice response from Vapi if needed
    console.log('Voice response:', response)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return AlertCircle
      case 'medium': return Clock
      case 'low': return CheckCircle
      default: return Heart
    }
  }

  return (
    <>
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header Section */}
            <Card className="mb-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-3 mb-4"
                >
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Bot className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <Stethoscope className="h-8 w-8 text-green-400" />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {translations[index].heading}
                </CardTitle>
                <CardDescription className="text-lg text-slate-300 mt-2">
                  {translations[index].subheading}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Input Section */}
            <Card className="mb-8 bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      className="w-full h-32 sm:h-40 p-4 pr-16 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                      placeholder={translations[index].placeholder}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={loading}
                    />
                    
                    {/* Voice Widget */}
                    <div className="absolute top-3 right-3">
                      <VapiWidget
                        apiKey={VAPI_API_KEY}
                        assistantId={VAPI_ASSISTANT_ID}
                        onTranscript={handleVoiceTranscript}
                        onResponse={handleVoiceResponse}
                      />
                    </div>
                    
                    <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                      {input.length}/500
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={handleSubmit}
                      disabled={loading || !input.trim()}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span ref={messageRef}>{currentMessage}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Get AI Health Advice
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Example Queries */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm text-slate-400">Quick examples:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsVoiceMode(!isVoiceMode)}
                        className="text-xs px-2 py-1 h-auto text-slate-400 hover:text-white"
                      >
                        <Mic className="h-3 w-3 mr-1" />
                        {isVoiceMode ? 'Voice' : 'Text'}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isVoiceMode ? voicePrompts : exampleQueries).map((query, index) => (
                        <button
                          key={index}
                          onClick={() => !isVoiceMode && setInput(query)}
                          className={`text-xs px-3 py-1 rounded-full transition-colors ${
                            isVoiceMode 
                              ? 'bg-purple-700/30 text-purple-300 cursor-default' 
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                          }`}
                          disabled={loading || isVoiceMode}
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading Animation */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-8"
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center space-x-3">
                          {loadingMessages.map((msg, idx) => {
                            const IconComponent = msg.icon
                            return (
                              <motion.div
                                key={idx}
                                initial={{ scale: 0.8, opacity: 0.3 }}
                                animate={{
                                  scale: idx === loadingMessageIndex ? 1.2 : 0.8,
                                  opacity: idx === loadingMessageIndex ? 1 : 0.3
                                }}
                                transition={{ duration: 0.3 }}
                                className="p-2 bg-blue-500/20 rounded-full"
                              >
                                <IconComponent className="h-5 w-5 text-blue-400" />
                              </motion.div>
                            )
                          })}
                        </div>
                        <motion.p
                          key={loadingMessageIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-blue-400 font-medium text-center"
                        >
                          {loadingMessages[loadingMessageIndex]?.text}
                        </motion.p>
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Response Section */}
            <AnimatePresence>
              {(response || summary) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 mb-8"
                >
                  {/* Severity Indicator */}
                  {severity && (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full border ${getSeverityColor(severity)}`}>
                            {React.createElement(getSeverityIcon(severity), { className: "h-5 w-5" })}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">Assessment Level</h3>
                            <p className="text-sm text-slate-400 capitalize">
                              {severity === 'high' ? 'Requires Attention' :
                               severity === 'medium' ? 'Monitor Closely' :
                               'General Guidance'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Main Response Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* AI Response */}
                    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-400">
                          <Bot className="h-5 w-5" />
                          AI Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-900/20">
                        <div className="space-y-3 text-slate-200">
                          {response.split("\n").filter(line => line.trim()).map((item, index) => (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-sm leading-relaxed flex items-start gap-2"
                            >
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{item.trim()}</span>
                            </motion.p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Detailed Summary */}
                    <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-400">
                          <MessageSquare className="h-5 w-5" />
                          Summary & Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900/20">
                        <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {summary}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Recommendations */}
                  {recommendations.length > 0 && (
                    <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          Key Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3">
                          {recommendations.map((rec, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                            >
                              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-200">{rec}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30"
                    onClick={() => router.push("/find-doctor")}
                  >
                    <User className="h-4 w-4" />
                    Find Doctors
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-gradient-to-r from-slate-600/20 to-slate-700/20 border-slate-500/30 text-slate-400 hover:bg-slate-600/30"
                    onClick={() => router.push("/")}
                  >
                    <Heart className="h-4 w-4" />
                    Back to Home
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600/30"
                    onClick={() => {
                      setInput("")
                      setResponse("")
                      setSummary("")
                      setSeverity("")
                      setRecommendations([])
                      setConversationHistory([])
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    New Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
        <Footer />
      </div>
    </>
  )
}
