"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Time series data for Urban-Rural Health Disparity (2005-2025)
const timeSeriesData = {
  2005: [
    {
      indicator: "Access to Improved Sanitation",
      urban: 81.4,
      rural: 18.9,
      gap: 62.5,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Institutional Births",
      urban: 73.1,
      rural: 34.3,
      gap: 38.8,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Full Immunization Coverage",
      urban: 59.8,
      rural: 43.5,
      gap: 16.3,
      trend: "improving",
      priority: "medium"
    },
    {
      indicator: "Stunting in Children (<5 years)",
      urban: 40.9,
      rural: 51.7,
      gap: 10.8,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Access to Clean Drinking Water",
      urban: 89.6,
      rural: 73.8,
      gap: 15.8,
      trend: "improving",
      priority: "medium"
    },
    {
      indicator: "Skilled Birth Attendance",
      urban: 81.3,
      rural: 42.2,
      gap: 39.1,
      trend: "improving",
      priority: "high"
    }
  ],
  2010: [
    {
      indicator: "Access to Improved Sanitation",
      urban: 84.2,
      rural: 23.4,
      gap: 60.8,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Institutional Births",
      urban: 84.9,
      rural: 53.1,
      gap: 31.8,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Full Immunization Coverage",
      urban: 65.9,
      rural: 54.1,
      gap: 11.8,
      trend: "improving",
      priority: "medium"
    },
    {
      indicator: "Stunting in Children (<5 years)",
      urban: 36.8,
      rural: 46.3,
      gap: 9.5,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Access to Clean Drinking Water",
      urban: 91.4,
      rural: 78.9,
      gap: 12.5,
      trend: "improving",
      priority: "medium"
    },
    {
      indicator: "Skilled Birth Attendance",
      urban: 89.7,
      rural: 64.8,
      gap: 24.9,
      trend: "improving",
      priority: "high"
    }
  ],
  2015: [
    {
      indicator: "Access to Improved Sanitation",
      urban: 88.6,
      rural: 36.4,
      gap: 52.2,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Institutional Births",
      urban: 89.4,
      rural: 75.1,
      gap: 14.3,
      trend: "improving",
      priority: "medium"
    },
    {
      indicator: "Full Immunization Coverage",
      urban: 71.5,
      rural: 62.0,
      gap: 9.5,
      trend: "improving",
      priority: "medium"
    },
    {
      indicator: "Stunting in Children (<5 years)",
      urban: 31.0,
      rural: 41.2,
      gap: 10.2,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Access to Clean Drinking Water",
      urban: 92.6,
      rural: 84.0,
      gap: 8.6,
      trend: "improving",
      priority: "low"
    },
    {
      indicator: "Skilled Birth Attendance",
      urban: 94.0,
      rural: 79.9,
      gap: 14.1,
      trend: "improving",
      priority: "medium"
    }
  ],
  2020: [
    {
      indicator: "Access to Improved Sanitation",
      urban: 93.3,
      rural: 56.5,
      gap: 36.8,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Institutional Births",
      urban: 94.8,
      rural: 86.9,
      gap: 7.9,
      trend: "improving",
      priority: "low"
    },
    {
      indicator: "Full Immunization Coverage",
      urban: 76.4,
      rural: 71.1,
      gap: 5.3,
      trend: "stable",
      priority: "medium"
    },
    {
      indicator: "Stunting in Children (<5 years)",
      urban: 30.1,
      rural: 38.4,
      gap: 8.3,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Access to Clean Drinking Water",
      urban: 93.9,
      rural: 82.6,
      gap: 11.3,
      trend: "stable",
      priority: "medium"
    },
    {
      indicator: "Skilled Birth Attendance",
      urban: 96.2,
      rural: 88.7,
      gap: 7.5,
      trend: "improving",
      priority: "low"
    }
  ],
  2024: [
    {
      indicator: "Access to Improved Sanitation",
      urban: 96.2,
      rural: 71.3,
      gap: 24.9,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Institutional Births",
      urban: 97.1,
      rural: 91.8,
      gap: 5.3,
      trend: "improving",
      priority: "low"
    },
    {
      indicator: "Full Immunization Coverage",
      urban: 82.1,
      rural: 78.4,
      gap: 3.7,
      trend: "stable",
      priority: "medium"
    },
    {
      indicator: "Stunting in Children (<5 years)",
      urban: 29.6,
      rural: 37.3,
      gap: 7.7,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Access to Clean Drinking Water",
      urban: 94.7,
      rural: 83.1,
      gap: 11.6,
      trend: "stable",
      priority: "medium"
    },
    {
      indicator: "Skilled Birth Attendance",
      urban: 98.1,
      rural: 93.4,
      gap: 4.7,
      trend: "improving",
      priority: "low"
    }
  ],
  2025: [
    {
      indicator: "Access to Improved Sanitation",
      urban: 97.1,
      rural: 75.8,
      gap: 21.3,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Institutional Births",
      urban: 97.8,
      rural: 93.2,
      gap: 4.6,
      trend: "improving",
      priority: "low"
    },
    {
      indicator: "Full Immunization Coverage",
      urban: 84.2,
      rural: 80.1,
      gap: 4.1,
      trend: "improving",
      priority: "medium"
    },
    {
      indicator: "Stunting in Children (<5 years)",
      urban: 28.1,
      rural: 35.9,
      gap: 7.8,
      trend: "improving",
      priority: "high"
    },
    {
      indicator: "Access to Clean Drinking Water",
      urban: 95.2,
      rural: 84.7,
      gap: 10.5,
      trend: "improving",
      priority: "medium"
    },
    {
      indicator: "Skilled Birth Attendance",
      urban: 98.6,
      rural: 94.8,
      gap: 3.8,
      trend: "improving",
      priority: "low"
    }
  ]
}

// Trend analysis data for line chart
const trendData = [
  { year: 2005, sanitationGap: 62.5, birthsGap: 38.8, immunizationGap: 16.3, stuntingGap: 10.8, waterGap: 15.8, skilledBirthGap: 39.1 },
  { year: 2010, sanitationGap: 60.8, birthsGap: 31.8, immunizationGap: 11.8, stuntingGap: 9.5, waterGap: 12.5, skilledBirthGap: 24.9 },
  { year: 2015, sanitationGap: 52.2, birthsGap: 14.3, immunizationGap: 9.5, stuntingGap: 10.2, waterGap: 8.6, skilledBirthGap: 14.1 },
  { year: 2020, sanitationGap: 36.8, birthsGap: 7.9, immunizationGap: 5.3, stuntingGap: 8.3, waterGap: 11.3, skilledBirthGap: 7.5 },
  { year: 2024, sanitationGap: 24.9, birthsGap: 5.3, immunizationGap: 3.7, stuntingGap: 7.7, waterGap: 11.6, skilledBirthGap: 4.7 },
  { year: 2025, sanitationGap: 21.3, birthsGap: 4.6, immunizationGap: 4.1, stuntingGap: 7.8, waterGap: 10.5, skilledBirthGap: 3.8 }
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-lg max-w-xs">
        <p className="text-white font-semibold text-sm mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-blue-400 text-sm">Urban: {data.urban}%</p>
          <p className="text-green-400 text-sm">Rural: {data.rural}%</p>
          <p className="text-red-400 text-sm">Gap: {data.gap}%</p>
          <p className="text-yellow-400 text-sm">Trend: {data.trend}</p>
          <p className="text-purple-400 text-sm">Priority: {data.priority}</p>
        </div>
      </div>
    )
  }
  return null
}

const TrendTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-lg">
        <p className="text-white font-semibold text-sm mb-2">Year: {label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export default function BarChartComponent() {
  const [selectedYear, setSelectedYear] = useState(2024)
  const [viewMode, setViewMode] = useState('comparison') // 'comparison' or 'trends'

  const currentData = timeSeriesData[selectedYear]
  const years = Object.keys(timeSeriesData).map(Number).sort()

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'comparison' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('comparison')}
            >
              Year Comparison
            </Button>
            <Button
              variant={viewMode === 'trends' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('trends')}
            >
              Gap Trends
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {viewMode === 'comparison'
            ? `Urban-Rural Health Indicators for ${selectedYear}`
            : 'Urban-Rural Gap Trends (2005-2025)'
          }
        </div>
      </div>

      {/* Chart Display */}
      {viewMode === 'comparison' ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={currentData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 180, bottom: 5 }}
          >
            <defs>
              <linearGradient id="urbanGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.8}/>
              </linearGradient>
              <linearGradient id="ruralGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              stroke="#9CA3AF"
              tick={{ fontSize: 11 }}
              domain={[0, 100]}
            />
            <YAxis
              dataKey="indicator"
              type="category"
              width={170}
              stroke="#9CA3AF"
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="urban"
              fill="url(#urbanGradient)"
              name="Urban %"
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="rural"
              fill="url(#ruralGradient)"
              name="Rural %"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={trendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="year"
              stroke="#9CA3AF"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fontSize: 11 }}
              label={{ value: 'Gap (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<TrendTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="sanitationGap"
              stroke="#EF4444"
              strokeWidth={3}
              name="Sanitation Gap"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="birthsGap"
              stroke="#F59E0B"
              strokeWidth={3}
              name="Institutional Births Gap"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="immunizationGap"
              stroke="#10B981"
              strokeWidth={3}
              name="Immunization Gap"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="stuntingGap"
              stroke="#8B5CF6"
              strokeWidth={3}
              name="Stunting Gap"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="waterGap"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Water Access Gap"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="skilledBirthGap"
              stroke="#EC4899"
              strokeWidth={3}
              name="Skilled Birth Gap"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
