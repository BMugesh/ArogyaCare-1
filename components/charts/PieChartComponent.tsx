"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ComposedChart } from "recharts"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Time series data for Disease Burden (2005-2025)
const timeSeriesDiseaseBurden = {
  2005: [
    {
      name: "Cardiovascular Diseases",
      value: 18.2,
      deaths: 1820000,
      trend: "increasing",
      urbanPrevalence: 21.4,
      ruralPrevalence: 16.1
    },
    {
      name: "Respiratory Diseases",
      value: 12.8,
      deaths: 1280000,
      trend: "stable",
      urbanPrevalence: 14.2,
      ruralPrevalence: 11.9
    },
    {
      name: "Infectious Diseases",
      value: 15.6,
      deaths: 1560000,
      trend: "decreasing",
      urbanPrevalence: 12.3,
      ruralPrevalence: 17.8
    },
    {
      name: "Cancer",
      value: 5.1,
      deaths: 510000,
      trend: "increasing",
      urbanPrevalence: 6.8,
      ruralPrevalence: 3.9
    },
    {
      name: "Diabetes",
      value: 2.8,
      deaths: 280000,
      trend: "increasing",
      urbanPrevalence: 4.2,
      ruralPrevalence: 1.8
    },
    {
      name: "Stroke",
      value: 3.9,
      deaths: 390000,
      trend: "increasing",
      urbanPrevalence: 4.8,
      ruralPrevalence: 3.2
    },
    {
      name: "Tuberculosis",
      value: 8.7,
      deaths: 870000,
      trend: "decreasing",
      urbanPrevalence: 7.2,
      ruralPrevalence: 9.8
    }
  ],
  2010: [
    {
      name: "Cardiovascular Diseases",
      value: 21.5,
      deaths: 2150000,
      trend: "increasing",
      urbanPrevalence: 25.1,
      ruralPrevalence: 19.2
    },
    {
      name: "Respiratory Diseases",
      value: 11.9,
      deaths: 1190000,
      trend: "stable",
      urbanPrevalence: 13.1,
      ruralPrevalence: 11.2
    },
    {
      name: "Infectious Diseases",
      value: 12.4,
      deaths: 1240000,
      trend: "decreasing",
      urbanPrevalence: 9.8,
      ruralPrevalence: 14.2
    },
    {
      name: "Cancer",
      value: 6.2,
      deaths: 620000,
      trend: "increasing",
      urbanPrevalence: 8.1,
      ruralPrevalence: 4.9
    },
    {
      name: "Diabetes",
      value: 3.8,
      deaths: 380000,
      trend: "increasing",
      urbanPrevalence: 5.9,
      ruralPrevalence: 2.4
    },
    {
      name: "Stroke",
      value: 4.6,
      deaths: 460000,
      trend: "increasing",
      urbanPrevalence: 5.7,
      ruralPrevalence: 3.8
    },
    {
      name: "Tuberculosis",
      value: 6.8,
      deaths: 680000,
      trend: "decreasing",
      urbanPrevalence: 5.4,
      ruralPrevalence: 7.8
    }
  ],
  2015: [
    {
      name: "Cardiovascular Diseases",
      value: 24.8,
      deaths: 2480000,
      trend: "increasing",
      urbanPrevalence: 28.9,
      ruralPrevalence: 22.1
    },
    {
      name: "Respiratory Diseases",
      value: 11.2,
      deaths: 1120000,
      trend: "stable",
      urbanPrevalence: 12.4,
      ruralPrevalence: 10.3
    },
    {
      name: "Infectious Diseases",
      value: 9.8,
      deaths: 980000,
      trend: "decreasing",
      urbanPrevalence: 7.9,
      ruralPrevalence: 11.2
    },
    {
      name: "Cancer",
      value: 7.1,
      deaths: 710000,
      trend: "increasing",
      urbanPrevalence: 9.4,
      ruralPrevalence: 5.6
    },
    {
      name: "Diabetes",
      value: 4.9,
      deaths: 490000,
      trend: "increasing",
      urbanPrevalence: 7.2,
      ruralPrevalence: 3.1
    },
    {
      name: "Stroke",
      value: 5.2,
      deaths: 520000,
      trend: "increasing",
      urbanPrevalence: 6.4,
      ruralPrevalence: 4.3
    },
    {
      name: "Tuberculosis",
      value: 5.1,
      deaths: 510000,
      trend: "decreasing",
      urbanPrevalence: 4.2,
      ruralPrevalence: 5.8
    }
  ],
  2020: [
    {
      name: "Cardiovascular Diseases",
      value: 26.9,
      deaths: 2690000,
      trend: "increasing",
      urbanPrevalence: 30.8,
      ruralPrevalence: 24.2
    },
    {
      name: "Respiratory Diseases",
      value: 10.7,
      deaths: 1070000,
      trend: "stable",
      urbanPrevalence: 11.9,
      ruralPrevalence: 9.8
    },
    {
      name: "Infectious Diseases",
      value: 8.2,
      deaths: 820000,
      trend: "decreasing",
      urbanPrevalence: 6.8,
      ruralPrevalence: 9.1
    },
    {
      name: "Cancer",
      value: 7.8,
      deaths: 780000,
      trend: "increasing",
      urbanPrevalence: 10.2,
      ruralPrevalence: 6.1
    },
    {
      name: "Diabetes",
      value: 5.8,
      deaths: 580000,
      trend: "increasing",
      urbanPrevalence: 8.6,
      ruralPrevalence: 3.8
    },
    {
      name: "Stroke",
      value: 5.6,
      deaths: 560000,
      trend: "increasing",
      urbanPrevalence: 6.9,
      ruralPrevalence: 4.7
    },
    {
      name: "Tuberculosis",
      value: 4.3,
      deaths: 430000,
      trend: "decreasing",
      urbanPrevalence: 3.6,
      ruralPrevalence: 4.8
    }
  ],
  2024: [
    {
      name: "Cardiovascular Diseases",
      value: 28.1,
      deaths: 2810000,
      trend: "increasing",
      urbanPrevalence: 32.4,
      ruralPrevalence: 25.8
    },
    {
      name: "Respiratory Diseases",
      value: 10.9,
      deaths: 1090000,
      trend: "stable",
      urbanPrevalence: 12.3,
      ruralPrevalence: 9.8
    },
    {
      name: "Cancer",
      value: 8.3,
      deaths: 830000,
      trend: "increasing",
      urbanPrevalence: 11.2,
      ruralPrevalence: 6.4
    },
    {
      name: "Diabetes",
      value: 6.2,
      deaths: 620000,
      trend: "increasing",
      urbanPrevalence: 9.8,
      ruralPrevalence: 4.1
    },
    {
      name: "Stroke",
      value: 5.7,
      deaths: 570000,
      trend: "increasing",
      urbanPrevalence: 7.1,
      ruralPrevalence: 4.8
    },
    {
      name: "Tuberculosis",
      value: 4.1,
      deaths: 410000,
      trend: "decreasing",
      urbanPrevalence: 3.2,
      ruralPrevalence: 4.7
    },
    {
      name: "Infectious Diseases",
      value: 7.1,
      deaths: 710000,
      trend: "decreasing",
      urbanPrevalence: 5.9,
      ruralPrevalence: 7.8
    }
  ],
  2025: [
    {
      name: "Cardiovascular Diseases",
      value: 29.2,
      deaths: 2920000,
      trend: "increasing",
      urbanPrevalence: 33.8,
      ruralPrevalence: 26.4
    },
    {
      name: "Respiratory Diseases",
      value: 10.6,
      deaths: 1060000,
      trend: "stable",
      urbanPrevalence: 12.1,
      ruralPrevalence: 9.5
    },
    {
      name: "Cancer",
      value: 8.7,
      deaths: 870000,
      trend: "increasing",
      urbanPrevalence: 11.8,
      ruralPrevalence: 6.8
    },
    {
      name: "Diabetes",
      value: 6.8,
      deaths: 680000,
      trend: "increasing",
      urbanPrevalence: 10.4,
      ruralPrevalence: 4.5
    },
    {
      name: "Stroke",
      value: 5.9,
      deaths: 590000,
      trend: "increasing",
      urbanPrevalence: 7.4,
      ruralPrevalence: 5.0
    },
    {
      name: "Tuberculosis",
      value: 3.8,
      deaths: 380000,
      trend: "decreasing",
      urbanPrevalence: 2.9,
      ruralPrevalence: 4.3
    },
    {
      name: "Infectious Diseases",
      value: 6.4,
      deaths: 640000,
      trend: "decreasing",
      urbanPrevalence: 5.2,
      ruralPrevalence: 7.1
    }
  ]
}

// Disease burden trend data for line charts
const diseaseTrendData = [
  { year: 2005, cardiovascular: 18.2, respiratory: 12.8, cancer: 5.1, diabetes: 2.8, stroke: 3.9, tuberculosis: 8.7, infectious: 15.6 },
  { year: 2010, cardiovascular: 21.5, respiratory: 11.9, cancer: 6.2, diabetes: 3.8, stroke: 4.6, tuberculosis: 6.8, infectious: 12.4 },
  { year: 2015, cardiovascular: 24.8, respiratory: 11.2, cancer: 7.1, diabetes: 4.9, stroke: 5.2, tuberculosis: 5.1, infectious: 9.8 },
  { year: 2020, cardiovascular: 26.9, respiratory: 10.7, cancer: 7.8, diabetes: 5.8, stroke: 5.6, tuberculosis: 4.3, infectious: 8.2 },
  { year: 2024, cardiovascular: 28.1, respiratory: 10.9, cancer: 8.3, diabetes: 6.2, stroke: 5.7, tuberculosis: 4.1, infectious: 7.1 },
  { year: 2025, cardiovascular: 29.2, respiratory: 10.6, cancer: 8.7, diabetes: 6.8, stroke: 5.9, tuberculosis: 3.8, infectious: 6.4 }
]

// Urban-Rural prevalence gap data
const urbanRuralGapData = [
  { year: 2005, cardiovascularGap: 5.3, cancerGap: 2.9, diabetesGap: 2.4, strokeGap: 1.6, tbGap: -2.6, infectiousGap: -5.5 },
  { year: 2010, cardiovascularGap: 5.9, cancerGap: 3.2, diabetesGap: 3.5, strokeGap: 1.9, tbGap: -2.4, infectiousGap: -4.4 },
  { year: 2015, cardiovascularGap: 6.8, cancerGap: 3.8, diabetesGap: 4.1, strokeGap: 2.1, tbGap: -1.6, infectiousGap: -3.3 },
  { year: 2020, cardiovascularGap: 6.6, cancerGap: 4.1, diabetesGap: 4.8, strokeGap: 2.2, tbGap: -1.2, infectiousGap: -2.3 },
  { year: 2024, cardiovascularGap: 6.6, cancerGap: 4.8, diabetesGap: 5.7, strokeGap: 2.3, tbGap: -1.5, infectiousGap: -1.9 },
  { year: 2025, cardiovascularGap: 7.4, cancerGap: 5.0, diabetesGap: 5.9, strokeGap: 2.4, tbGap: -1.4, infectiousGap: -1.9 }
]

const COLORS = [
  "#EF4444", // Red for CVD
  "#F59E0B", // Orange for Respiratory
  "#8B5CF6", // Purple for Cancer
  "#EC4899", // Pink for Diabetes
  "#06B6D4", // Cyan for Stroke
  "#10B981", // Green for TB
  "#3B82F6", // Blue for Kidney
  "#F97316", // Orange for Liver
  "#6366F1", // Indigo for Accidents
  "#84CC16", // Lime for Diarrheal
  "#6B7280"  // Gray for Others
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-lg max-w-xs">
        <p className="text-white font-semibold text-sm mb-2">{data.name}</p>
        <div className="space-y-1 text-xs">
          <p className="text-blue-400">Share of Deaths: {data.value}%</p>
          <p className="text-green-400">Annual Deaths: {(data.deaths / 1000000).toFixed(1)}M</p>
          <p className="text-yellow-400">Trend: {data.trend}</p>
          <p className="text-purple-400">Urban: {data.urbanPrevalence}%</p>
          <p className="text-pink-400">Rural: {data.ruralPrevalence}%</p>
        </div>
      </div>
    )
  }
  return null
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.03) return null // Don't show labels for very small slices

  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={10}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  )
}

export default function PieChartComponent() {
  const [viewMode, setViewMode] = useState('pie')

  const comparisonData = mortalityData
    .filter(item => item.name !== 'Others')
    .map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      urban: item.urbanPrevalence,
      rural: item.ruralPrevalence,
      fullName: item.name
    }))

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setViewMode('pie')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'pie'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Disease Burden
        </button>
        <button
          onClick={() => setViewMode('comparison')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'comparison'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Urban vs Rural
        </button>
      </div>

      {viewMode === 'pie' ? (
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={mortalityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
            >
              {mortalityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              label={{ value: 'Prevalence (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 shadow-lg">
                      <p className="text-white font-semibold text-sm mb-2">{data.fullName}</p>
                      <p className="text-blue-400 text-sm">Urban: {data.urban}%</p>
                      <p className="text-green-400 text-sm">Rural: {data.rural}%</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Bar dataKey="urban" fill="#3B82F6" name="Urban Prevalence %" />
            <Bar dataKey="rural" fill="#10B981" name="Rural Prevalence %" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

