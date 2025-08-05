"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UrbanRuralDisparity } from "@/components/charts/UrbanRuralDisparity"
import { HealthConditionsChart } from "@/components/charts/HealthConditionsChart"
import { HealthcareAccessMap } from "@/components/charts/HealthcareAccessMap"
import { LifeExpectancyTrend } from "@/components/charts/LifeExpectancyTrend"
import { ChildMortalityRate } from "@/components/charts/ChildMortalityRate"
import HealthTrendsChart from "@/components/charts/HealthTrendsChart"
import AdvancedHealthcareMap from "@/components/charts/AdvancedHealthcareMap"
import TimeSeriesDiseaseBurden from "@/components/charts/TimeSeriesDiseaseBurden"
import TimeSeriesStateAnalysis from "@/components/charts/TimeSeriesStateAnalysis"
import ClientOnly from "@/components/ClientOnly"

export default function HealthInsights() {
  const [activeTab, setActiveTab] = useState("disparity")

  return (
    <div className="min-h-screen bg-black dark:bg-black text-white" suppressHydrationWarning>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Health Insights: India's Healthcare Analytics (2005-2025)
          </h1>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto">
            Comprehensive analysis of India's healthcare progress, urban-rural disparities,
            and health outcomes based on real data from WHO, ICMR, and government reports.
          </p>
        </motion.div>

        <Tabs defaultValue="disparity" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1">
            <TabsTrigger value="disparity" className="text-xs sm:text-sm">
              Urban-Rural
            </TabsTrigger>
            <TabsTrigger value="conditions" className="text-xs sm:text-sm">
              Disease Burden
            </TabsTrigger>
            <TabsTrigger value="life-expectancy" className="text-xs sm:text-sm">
              Life Expectancy
            </TabsTrigger>
            <TabsTrigger value="child-mortality" className="text-xs sm:text-sm">
              Child Mortality
            </TabsTrigger>
            <TabsTrigger value="health-trends" className="text-xs sm:text-sm">
              Health Trends
            </TabsTrigger>
            <TabsTrigger value="healthcare-access" className="text-xs sm:text-sm">
              Healthcare Access
            </TabsTrigger>
            <TabsTrigger value="state-comparison" className="text-xs sm:text-sm">
              State Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="disparity">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-base sm:text-xl md:text-2xl">
                  Urban-Rural Health Disparity in India (2005-2025)
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Time series analysis of health indicators showing the evolution of urban-rural gaps with interactive year selection and trend visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 sm:pt-4 md:pt-6 px-2 sm:px-6 pb-4 sm:pb-6">
                <div className="h-[500px] sm:h-[550px] md:h-[600px]">
                  <ClientOnly>
                    <UrbanRuralDisparity />
                  </ClientOnly>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conditions">
            <Card>
              <CardHeader>
                <CardTitle>Disease Burden & Health Conditions in India (2005-2025)</CardTitle>
                <CardDescription>
                  Time series analysis of leading causes of mortality and morbidity with evolving urban-rural prevalence patterns and trend visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ClientOnly>
                  <TimeSeriesDiseaseBurden />
                </ClientOnly>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="life-expectancy">
            <Card>
              <CardHeader>
                <CardTitle>Life Expectancy Trends in India (2005-2025)</CardTitle>
                <CardDescription>
                  Detailed analysis of life expectancy by gender, location, and demographic factors
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ClientOnly>
                  <LifeExpectancyTrend />
                </ClientOnly>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="child-mortality">
            <Card>
              <CardHeader>
                <CardTitle>Child Mortality Trends in India (2005-2025)</CardTitle>
                <CardDescription>
                  Progress towards SDG targets for under-5, infant, and neonatal mortality rates
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ClientOnly>
                  <ChildMortalityRate />
                </ClientOnly>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health-trends">
            <Card>
              <CardHeader>
                <CardTitle>Healthcare System Trends (2005-2025)</CardTitle>
                <CardDescription>
                  Comprehensive analysis of healthcare infrastructure, expenditure, and coverage improvements
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ClientOnly>
                  <HealthTrendsChart />
                </ClientOnly>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="healthcare-access">
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Access Map</CardTitle>
                <CardDescription>
                  Geographic distribution of healthcare facilities and accessibility across India
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ClientOnly>
                  <HealthcareAccessMap />
                </ClientOnly>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="state-comparison">
            <Card>
              <CardHeader>
                <CardTitle>State-wise Healthcare Analysis (2005-2025)</CardTitle>
                <CardDescription>
                  Time series comparative analysis of healthcare infrastructure evolution, health outcomes improvement, and access patterns across Indian states
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ClientOnly>
                  <TimeSeriesStateAnalysis />
                </ClientOnly>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">📈 Key Progress (2005-2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Life Expectancy:</strong> Increased from 63.4 to 70.6 years (+7.2 years)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Child Mortality:</strong> Reduced from 74.2 to 35.6 per 1,000 births (-52%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Maternal Mortality:</strong> Decreased from 254 to 78 per 100,000 births (-69%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Immunization:</strong> Coverage improved from 61% to 98.5% (+37.5%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Sanitation Access:</strong> Increased from 31% to 92% (+61%)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">⚠️ Persistent Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">!</span>
                    <span><strong>Urban-Rural Gap:</strong> 22% disparity in healthcare access remains</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">!</span>
                    <span><strong>NCDs Rising:</strong> Cardiovascular diseases now account for 28.1% of deaths</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">!</span>
                    <span><strong>Doctor Shortage:</strong> Only 0.8 doctors per 1,000 people (WHO target: 1.0)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">!</span>
                    <span><strong>State Disparities:</strong> Life expectancy varies by 11 years between states</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">!</span>
                    <span><strong>Health Expenditure:</strong> Still only 6.2% of GDP (target: 8%)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">🎯 Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Infrastructure Development</h4>
                  <ul className="space-y-1">
                    <li>• Increase healthcare workforce by 40%</li>
                    <li>• Expand rural health centers coverage</li>
                    <li>• Improve telemedicine infrastructure</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Disease Prevention</h4>
                  <ul className="space-y-1">
                    <li>• Focus on NCD prevention programs</li>
                    <li>• Strengthen immunization systems</li>
                    <li>• Enhance maternal health services</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Policy & Financing</h4>
                  <ul className="space-y-1">
                    <li>• Increase health budget to 8% of GDP</li>
                    <li>• Implement universal health coverage</li>
                    <li>• Strengthen health information systems</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
      <Footer />
    </div>
  )
}

