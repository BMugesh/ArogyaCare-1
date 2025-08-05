"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar, Area, AreaChart } from "recharts"

// Comprehensive health trends data (2005-2025)
const healthTrendsData = [
  {
    year: 2005,
    maternalMortality: 254,
    doctorsPer1000: 0.6,
    hospitalBeds: 0.7,
    healthExpenditure: 4.2,
    immunizationCoverage: 61.0,
    sanitationAccess: 31.0
  },
  {
    year: 2006,
    maternalMortality: 245,
    doctorsPer1000: 0.61,
    hospitalBeds: 0.71,
    healthExpenditure: 4.3,
    immunizationCoverage: 63.2,
    sanitationAccess: 33.1
  },
  {
    year: 2007,
    maternalMortality: 236,
    doctorsPer1000: 0.62,
    hospitalBeds: 0.72,
    healthExpenditure: 4.4,
    immunizationCoverage: 65.4,
    sanitationAccess: 35.3
  },
  {
    year: 2008,
    maternalMortality: 227,
    doctorsPer1000: 0.63,
    hospitalBeds: 0.73,
    healthExpenditure: 4.5,
    immunizationCoverage: 67.6,
    sanitationAccess: 37.6
  },
  {
    year: 2009,
    maternalMortality: 218,
    doctorsPer1000: 0.64,
    hospitalBeds: 0.74,
    healthExpenditure: 4.6,
    immunizationCoverage: 69.8,
    sanitationAccess: 40.0
  },
  {
    year: 2010,
    maternalMortality: 208,
    doctorsPer1000: 0.65,
    hospitalBeds: 0.75,
    healthExpenditure: 4.7,
    immunizationCoverage: 72.0,
    sanitationAccess: 42.5
  },
  {
    year: 2011,
    maternalMortality: 198,
    doctorsPer1000: 0.66,
    hospitalBeds: 0.76,
    healthExpenditure: 4.8,
    immunizationCoverage: 74.2,
    sanitationAccess: 45.1
  },
  {
    year: 2012,
    maternalMortality: 188,
    doctorsPer1000: 0.67,
    hospitalBeds: 0.77,
    healthExpenditure: 4.9,
    immunizationCoverage: 76.4,
    sanitationAccess: 47.8
  },
  {
    year: 2013,
    maternalMortality: 178,
    doctorsPer1000: 0.68,
    hospitalBeds: 0.78,
    healthExpenditure: 5.0,
    immunizationCoverage: 78.6,
    sanitationAccess: 50.6
  },
  {
    year: 2014,
    maternalMortality: 167,
    doctorsPer1000: 0.69,
    hospitalBeds: 0.79,
    healthExpenditure: 5.1,
    immunizationCoverage: 80.8,
    sanitationAccess: 53.5
  },
  {
    year: 2015,
    maternalMortality: 156,
    doctorsPer1000: 0.70,
    hospitalBeds: 0.80,
    healthExpenditure: 5.2,
    immunizationCoverage: 83.0,
    sanitationAccess: 56.5
  },
  {
    year: 2016,
    maternalMortality: 145,
    doctorsPer1000: 0.71,
    hospitalBeds: 0.81,
    healthExpenditure: 5.3,
    immunizationCoverage: 85.2,
    sanitationAccess: 59.6
  },
  {
    year: 2017,
    maternalMortality: 135,
    doctorsPer1000: 0.72,
    hospitalBeds: 0.82,
    healthExpenditure: 5.4,
    immunizationCoverage: 87.4,
    sanitationAccess: 62.8
  },
  {
    year: 2018,
    maternalMortality: 125,
    doctorsPer1000: 0.73,
    hospitalBeds: 0.83,
    healthExpenditure: 5.5,
    immunizationCoverage: 89.6,
    sanitationAccess: 66.1
  },
  {
    year: 2019,
    maternalMortality: 115,
    doctorsPer1000: 0.74,
    hospitalBeds: 0.84,
    healthExpenditure: 5.6,
    immunizationCoverage: 91.8,
    sanitationAccess: 69.5
  },
  {
    year: 2020,
    maternalMortality: 103,
    doctorsPer1000: 0.75,
    hospitalBeds: 0.85,
    healthExpenditure: 5.7,
    immunizationCoverage: 94.0,
    sanitationAccess: 73.0
  },
  {
    year: 2021,
    maternalMortality: 97,
    doctorsPer1000: 0.76,
    hospitalBeds: 0.86,
    healthExpenditure: 5.8,
    immunizationCoverage: 91.2,
    sanitationAccess: 76.6
  },
  {
    year: 2022,
    maternalMortality: 92,
    doctorsPer1000: 0.77,
    hospitalBeds: 0.87,
    healthExpenditure: 5.9,
    immunizationCoverage: 93.4,
    sanitationAccess: 80.3
  },
  {
    year: 2023,
    maternalMortality: 87,
    doctorsPer1000: 0.78,
    hospitalBeds: 0.88,
    healthExpenditure: 6.0,
    immunizationCoverage: 95.6,
    sanitationAccess: 84.1
  },
  {
    year: 2024,
    maternalMortality: 82,
    doctorsPer1000: 0.79,
    hospitalBeds: 0.89,
    healthExpenditure: 6.1,
    immunizationCoverage: 97.8,
    sanitationAccess: 88.0
  },
  {
    year: 2025,
    maternalMortality: 78,
    doctorsPer1000: 0.80,
    hospitalBeds: 0.90,
    healthExpenditure: 6.2,
    immunizationCoverage: 98.5,
    sanitationAccess: 92.0
  }
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-lg">
        <p className="text-white font-semibold mb-2">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.name.includes('Mortality') ? ' per 100,000' : 
              entry.name.includes('Expenditure') ? '% of GDP' : 
              entry.name.includes('Coverage') || entry.name.includes('Access') ? '%' : ''}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function HealthTrendsChart() {
  const [isMounted, setIsMounted] = useState(false)

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

  return (
    <ResponsiveContainer width="100%" height={450}>
      <ComposedChart
        data={healthTrendsData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="year" 
          stroke="#9CA3AF"
          tick={{ fontSize: 12 }}
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
          dataKey="maternalMortality" 
          fill="#EF4444" 
          name="Maternal Mortality"
          opacity={0.7}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="immunizationCoverage" 
          stroke="#10B981" 
          strokeWidth={3}
          name="Immunization Coverage"
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="sanitationAccess" 
          stroke="#3B82F6" 
          strokeWidth={3}
          name="Sanitation Access"
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="healthExpenditure" 
          stroke="#F59E0B" 
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Health Expenditure"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
