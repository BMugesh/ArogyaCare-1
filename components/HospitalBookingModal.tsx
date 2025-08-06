"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Phone, Mail, FileText, X, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { API_ENDPOINTS } from "@/lib/config"

interface Hospital {
  name: string
  address: string
  phone: string
  specialties: string[]
  type: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  hospital: Hospital
  onBookingConfirmed: (bookingData: any) => void
}

export default function HospitalBookingModal({ 
  isOpen, 
  onClose, 
  hospital, 
  onBookingConfirmed 
}: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    department: "",
    symptoms: "",
    urgency: "Normal",
    previousVisit: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ]

  const urgencyLevels = [
    { value: "Emergency", color: "bg-red-600", label: "Emergency" },
    { value: "Urgent", color: "bg-orange-600", label: "Urgent" },
    { value: "Normal", color: "bg-green-600", label: "Normal" },
    { value: "Routine", color: "bg-blue-600", label: "Routine Checkup" }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const finalBookingData = {
        ...bookingData,
        hospital: hospital.name,
        hospitalAddress: hospital.address,
        hospitalPhone: hospital.phone,
        bookingId: `BK${Date.now()}`,
        status: "Confirmed",
        createdAt: new Date().toISOString()
      }

      // Call the booking API
      const res = await fetch(API_ENDPOINTS.BOOKINGS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalBookingData),
      })

      if (!res.ok) {
        throw new Error("Failed to book appointment")
      }

      const result = await res.json()
      
      setBookingConfirmed(true)
      onBookingConfirmed(result.booking || finalBookingData)
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose()
        setBookingConfirmed(false)
        setStep(1)
        setBookingData({
          patientName: "",
          age: "",
          gender: "",
          phone: "",
          email: "",
          preferredDate: "",
          preferredTime: "",
          department: "",
          symptoms: "",
          urgency: "Normal",
          previousVisit: false
        })
      }, 3000)
      
    } catch (error) {
      console.error("Booking failed:", error)
      // Could show an error message here
      alert("Failed to book appointment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return bookingData.patientName && bookingData.age && bookingData.gender && bookingData.phone
      case 2:
        return bookingData.preferredDate && bookingData.preferredTime && bookingData.department
      case 3:
        return bookingData.symptoms && bookingData.urgency
      default:
        return false
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-blue-400" />
                    Book Appointment
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-2">
                    {hospital.name} • {hospital.address}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mt-6 space-x-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        num <= step
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {num}
                    </div>
                    {num < 3 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          num < step ? "bg-blue-600" : "bg-slate-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              {bookingConfirmed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Your appointment has been scheduled successfully
                  </p>
                  <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300">
                    <p><strong>Date:</strong> {bookingData.preferredDate}</p>
                    <p><strong>Time:</strong> {bookingData.preferredTime}</p>
                    <p><strong>Department:</strong> {bookingData.department}</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Step 1: Patient Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Patient Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={bookingData.patientName}
                            onChange={(e) => handleInputChange("patientName", e.target.value)}
                            placeholder="Enter full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Age *
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={bookingData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            placeholder="Age"
                            min="1"
                            max="120"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Gender *
                          </label>
                          <select
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={bookingData.gender}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
                            aria-label="Select gender"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={bookingData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={bookingData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <input
                          type="checkbox"
                          id="previousVisit"
                          className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                          checked={bookingData.previousVisit}
                          onChange={(e) => handleInputChange("previousVisit", e.target.checked)}
                          aria-label="Previous visit to this hospital"
                        />
                        <label htmlFor="previousVisit" className="text-sm text-slate-300">
                          I have visited this hospital before
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Appointment Details */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Appointment Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Preferred Date *
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={bookingData.preferredDate}
                            onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                            min={getTomorrowDate()}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Preferred Time *
                          </label>
                          <select
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={bookingData.preferredTime}
                            onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                            aria-label="Select preferred time"
                          >
                            <option value="">Select Time</option>
                            {timeSlots.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Department/Specialty *
                          </label>
                          <select
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={bookingData.department}
                            onChange={(e) => handleInputChange("department", e.target.value)}
                            aria-label="Select department or specialty"
                          >
                            <option value="">Select Department</option>
                            {hospital.specialties.map(specialty => (
                              <option key={specialty} value={specialty}>{specialty}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300">
                        <h4 className="font-medium text-white mb-2">Available Departments:</h4>
                        <div className="flex flex-wrap gap-2">
                          {hospital.specialties.map(specialty => (
                            <Badge key={specialty} className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Medical Details */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Medical Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Describe your symptoms or reason for visit *
                        </label>
                        <textarea
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                          rows={4}
                          value={bookingData.symptoms}
                          onChange={(e) => handleInputChange("symptoms", e.target.value)}
                          placeholder="Please describe your symptoms, concerns, or reason for the appointment..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Urgency Level *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {urgencyLevels.map(level => (
                            <button
                              key={level.value}
                              type="button"
                              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                                bookingData.urgency === level.value
                                  ? `${level.color} text-white border-transparent`
                                  : "bg-slate-800 text-slate-300 border-slate-600 hover:border-slate-500"
                              }`}
                              onClick={() => handleInputChange("urgency", level.value)}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300">
                        <h4 className="font-medium text-white mb-2">Appointment Summary:</h4>
                        <div className="space-y-1">
                          <p><strong>Patient:</strong> {bookingData.patientName}</p>
                          <p><strong>Date & Time:</strong> {bookingData.preferredDate} at {bookingData.preferredTime}</p>
                          <p><strong>Department:</strong> {bookingData.department}</p>
                          <p><strong>Urgency:</strong> {bookingData.urgency}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700">
                    <Button
                      variant="outline"
                      onClick={step === 1 ? onClose : handleBack}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      {step === 1 ? "Cancel" : "Back"}
                    </Button>

                    <div className="flex gap-2">
                      {step < 3 ? (
                        <Button
                          onClick={handleNext}
                          disabled={!isStepValid()}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          disabled={!isStepValid() || isSubmitting}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isSubmitting ? "Booking..." : "Confirm Booking"}
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
