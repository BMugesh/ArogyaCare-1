"use client"

import { useState, useEffect } from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts"

// State-wise healthcare infrastructure data (2024)
const stateHealthcareData = [
  {
    state: "Kerala",
    doctorsPer1000: 1.8,
    hospitalBeds: 2.1,
    healthCenters: 95,
    lifeExpectancy: 75.2,
    infantMortality: 7,
    literacyRate: 94.0,
    population: 35.0
  },
  {
    state: "Tamil Nadu",
    doctorsPer1000: 1.2,
    hospitalBeds: 1.8,
    healthCenters: 88,
    lifeExpectancy: 70.6,
    infantMortality: 19,
    literacyRate: 80.1,
    population: 77.8
  },
  {
    state: "Karnataka",
    doctorsPer1000: 1.1,
    hospitalBeds: 1.5,
    healthCenters: 82,
    lifeExpectancy: 68.8,
    infantMortality: 23,
    literacyRate: 75.4,
    population: 67.9
  },
  {
    state: "Maharashtra",
    doctorsPer1000: 1.0,
    hospitalBeds: 1.3,
    healthCenters: 78,
    lifeExpectancy: 72.6,
    infantMortality: 24,
    literacyRate: 82.3,
    population: 123.1
  },
  {
    state: "Gujarat",
    doctorsPer1000: 0.9,
    hospitalBeds: 1.2,
    healthCenters: 75,
    lifeExpectancy: 70.2,
    infantMortality: 30,
    literacyRate: 78.0,
    population: 70.0
  },
  {
    state: "Punjab",
    doctorsPer1000: 1.3,
    hospitalBeds: 1.6,
    healthCenters: 85,
    lifeExpectancy: 72.0,
    infantMortality: 21,
    literacyRate: 75.8,
    population: 30.1
  },
  {
    state: "Haryana",
    doctorsPer1000: 0.8,
    hospitalBeds: 1.1,
    healthCenters: 72,
    lifeExpectancy: 69.1,
    infantMortality: 33,
    literacyRate: 75.6,
    population: 28.9
  },
  {
    state: "Rajasthan",
    doctorsPer1000: 0.6,
    hospitalBeds: 0.9,
    healthCenters: 65,
    lifeExpectancy: 69.7,
    infantMortality: 37,
    literacyRate: 66.1,
    population: 81.0
  },
  {
    state: "Uttar Pradesh",
    doctorsPer1000: 0.4,
    hospitalBeds: 0.6,
    healthCenters: 58,
    lifeExpectancy: 64.1,
    infantMortality: 43,
    literacyRate: 67.7,
    population: 237.9
  },
  {
    state: "Bihar",
    doctorsPer1000: 0.3,
    hospitalBeds: 0.4,
    healthCenters: 52,
    lifeExpectancy: 68.1,
    infantMortality: 38,
    literacyRate: 61.8,
    population: 128.1
  },
  {
    state: "West Bengal",
    doctorsPer1000: 0.7,
    hospitalBeds: 1.0,
    healthCenters: 68,
    lifeExpectancy: 70.2,
    infantMortality: 27,
    literacyRate: 76.3,
    population: 99.6
  },
  {
    state: "Odisha",
    doctorsPer1000: 0.5,
    hospitalBeds: 0.8,
    healthCenters: 62,
    lifeExpectancy: 69.3,
    infantMortality: 40,
    literacyRate: 72.9,
    population: 45.4
  },
  {
    state: "Madhya Pradesh",
    doctorsPer1000: 0.5,
    hospitalBeds: 0.7,
    healthCenters: 60,
    lifeExpectancy: 64.2,
    infantMortality: 48,
    literacyRate: 69.3,
    population: 85.0
  },
  {
    state: "Assam",
    doctorsPer1000: 0.6,
    hospitalBeds: 0.9,
    healthCenters: 64,
    lifeExpectancy: 70.0,
    infantMortality: 44,
    literacyRate: 72.2,
    population: 35.6
  },
  {
    state: "Jharkhand",
    doctorsPer1000: 0.4,
    hospitalBeds: 0.6,
    healthCenters: 55,
    lifeExpectancy: 69.0,
    infantMortality: 29,
    literacyRate: 66.4,
    population: 38.6
  }
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-lg max-w-xs">
        <p className="text-white font-semibold text-sm mb-2">{data.state}</p>
        <div className="space-y-1 text-xs">
          <p className="text-blue-400">Doctors: {data.doctorsPer1000}/1000 people</p>
          <p className="text-green-400">Hospital Beds: {data.hospitalBeds}/1000</p>
          <p className="text-yellow-400">Health Centers: {data.healthCenters}% coverage</p>
          <p className="text-purple-400">Life Expectancy: {data.lifeExpectancy} years</p>
          <p className="text-red-400">Infant Mortality: {data.infantMortality}/1000</p>
          <p className="text-cyan-400">Literacy: {data.literacyRate}%</p>
          <p className="text-gray-400">Population: {data.population}M</p>
        </div>
      </div>
    )
  }
  return null
}

const ScatterTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 shadow-lg">
        <p className="text-white font-semibold text-sm mb-1">{data.state}</p>
        <p className="text-blue-400 text-xs">Healthcare Access: {data.healthCenters}%</p>
        <p className="text-green-400 text-xs">Life Expectancy: {data.lifeExpectancy} years</p>
        <p className="text-yellow-400 text-xs">Population: {data.population}M</p>
      </div>
    )
  }
  return null
}

export default function AdvancedHealthcareMap() {
  const [isMounted, setIsMounted] = useState(false)
  const [viewMode, setViewMode] = useState('infrastructure')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-800 rounded-lg">
        <p>Loading chart...</p>
      </div>
    )
  }

  const sortedData = [...stateHealthcareData].sort((a, b) => b.doctorsPer1000 - a.doctorsPer1000)

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setViewMode('infrastructure')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'infrastructure' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Healthcare Infrastructure
        </button>
        <button
          type="button"
          onClick={() => setViewMode('outcomes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'outcomes' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Health Outcomes
        </button>
        <button
          type="button"
          onClick={() => setViewMode('correlation')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'correlation' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Access vs Outcomes
        </button>
      </div>

      {viewMode === 'infrastructure' && (
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart
            data={sortedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="state" 
              stroke="#9CA3AF"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="doctorsPer1000" 
              fill="#3B82F6" 
              name="Doctors per 1000"
            />
            <Bar 
              yAxisId="left"
              dataKey="hospitalBeds" 
              fill="#10B981" 
              name="Hospital Beds per 1000"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="healthCenters" 
              stroke="#EF4444" 
              strokeWidth={3}
              name="Health Centers Coverage %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'outcomes' && (
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart
            data={sortedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="state" 
              stroke="#9CA3AF"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="lifeExpectancy" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Life Expectancy (years)"
            />
            <Bar 
              yAxisId="right"
              dataKey="infantMortality" 
              fill="#EF4444" 
              name="Infant Mortality per 1000"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="literacyRate" 
              stroke="#F59E0B" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Literacy Rate %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'correlation' && (
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart
            data={stateHealthcareData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="healthCenters" 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              name="Healthcare Access"
              label={{ value: 'Healthcare Access (%)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              dataKey="lifeExpectancy" 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              name="Life Expectancy"
              label={{ value: 'Life Expectancy (years)', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis dataKey="population" range={[50, 400]} />
            <Tooltip content={<ScatterTooltip />} />
            <Scatter 
              dataKey="lifeExpectancy" 
              fill="#8B5CF6"
              name="States (bubble size = population)"
            />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
