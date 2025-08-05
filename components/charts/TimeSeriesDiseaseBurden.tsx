"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Time series data for Disease Burden (2005-2025)
const timeSeriesDiseaseBurden = {
  2005: [
    { name: "Cardiovascular Diseases", value: 18.2, deaths: 1820000, trend: "increasing", urbanPrevalence: 21.4, ruralPrevalence: 16.1 },
    { name: "Respiratory Diseases", value: 12.8, deaths: 1280000, trend: "stable", urbanPrevalence: 14.2, ruralPrevalence: 11.9 },
    { name: "Infectious Diseases", value: 15.6, deaths: 1560000, trend: "decreasing", urbanPrevalence: 12.3, ruralPrevalence: 17.8 },
    { name: "Cancer", value: 5.1, deaths: 510000, trend: "increasing", urbanPrevalence: 6.8, ruralPrevalence: 3.9 },
    { name: "Diabetes", value: 2.8, deaths: 280000, trend: "increasing", urbanPrevalence: 4.2, ruralPrevalence: 1.8 },
    { name: "Stroke", value: 3.9, deaths: 390000, trend: "increasing", urbanPrevalence: 4.8, ruralPrevalence: 3.2 },
    { name: "Tuberculosis", value: 8.7, deaths: 870000, trend: "decreasing", urbanPrevalence: 7.2, ruralPrevalence: 9.8 }
  ],
  2010: [
    { name: "Cardiovascular Diseases", value: 21.5, deaths: 2150000, trend: "increasing", urbanPrevalence: 25.1, ruralPrevalence: 19.2 },
    { name: "Respiratory Diseases", value: 11.9, deaths: 1190000, trend: "stable", urbanPrevalence: 13.1, ruralPrevalence: 11.2 },
    { name: "Infectious Diseases", value: 12.4, deaths: 1240000, trend: "decreasing", urbanPrevalence: 9.8, ruralPrevalence: 14.2 },
    { name: "Cancer", value: 6.2, deaths: 620000, trend: "increasing", urbanPrevalence: 8.1, ruralPrevalence: 4.9 },
    { name: "Diabetes", value: 3.8, deaths: 380000, trend: "increasing", urbanPrevalence: 5.9, ruralPrevalence: 2.4 },
    { name: "Stroke", value: 4.6, deaths: 460000, trend: "increasing", urbanPrevalence: 5.7, ruralPrevalence: 3.8 },
    { name: "Tuberculosis", value: 6.8, deaths: 680000, trend: "decreasing", urbanPrevalence: 5.4, ruralPrevalence: 7.8 }
  ],
  2015: [
    { name: "Cardiovascular Diseases", value: 24.8, deaths: 2480000, trend: "increasing", urbanPrevalence: 28.9, ruralPrevalence: 22.1 },
    { name: "Respiratory Diseases", value: 11.2, deaths: 1120000, trend: "stable", urbanPrevalence: 12.4, ruralPrevalence: 10.3 },
    { name: "Infectious Diseases", value: 9.8, deaths: 980000, trend: "decreasing", urbanPrevalence: 7.9, ruralPrevalence: 11.2 },
    { name: "Cancer", value: 7.1, deaths: 710000, trend: "increasing", urbanPrevalence: 9.4, ruralPrevalence: 5.6 },
    { name: "Diabetes", value: 4.9, deaths: 490000, trend: "increasing", urbanPrevalence: 7.2, ruralPrevalence: 3.1 },
    { name: "Stroke", value: 5.2, deaths: 520000, trend: "increasing", urbanPrevalence: 6.4, ruralPrevalence: 4.3 },
    { name: "Tuberculosis", value: 5.1, deaths: 510000, trend: "decreasing", urbanPrevalence: 4.2, ruralPrevalence: 5.8 }
  ],
  2020: [
    { name: "Cardiovascular Diseases", value: 26.9, deaths: 2690000, trend: "increasing", urbanPrevalence: 30.8, ruralPrevalence: 24.2 },
    { name: "Respiratory Diseases", value: 10.7, deaths: 1070000, trend: "stable", urbanPrevalence: 11.9, ruralPrevalence: 9.8 },
    { name: "Infectious Diseases", value: 8.2, deaths: 820000, trend: "decreasing", urbanPrevalence: 6.8, ruralPrevalence: 9.1 },
    { name: "Cancer", value: 7.8, deaths: 780000, trend: "increasing", urbanPrevalence: 10.2, ruralPrevalence: 6.1 },
    { name: "Diabetes", value: 5.8, deaths: 580000, trend: "increasing", urbanPrevalence: 8.6, ruralPrevalence: 3.8 },
    { name: "Stroke", value: 5.6, deaths: 560000, trend: "increasing", urbanPrevalence: 6.9, ruralPrevalence: 4.7 },
    { name: "Tuberculosis", value: 4.3, deaths: 430000, trend: "decreasing", urbanPrevalence: 3.6, ruralPrevalence: 4.8 }
  ],
  2024: [
    { name: "Cardiovascular Diseases", value: 28.1, deaths: 2810000, trend: "increasing", urbanPrevalence: 32.4, ruralPrevalence: 25.8 },
    { name: "Respiratory Diseases", value: 10.9, deaths: 1090000, trend: "stable", urbanPrevalence: 12.3, ruralPrevalence: 9.8 },
    { name: "Cancer", value: 8.3, deaths: 830000, trend: "increasing", urbanPrevalence: 11.2, ruralPrevalence: 6.4 },
    { name: "Diabetes", value: 6.2, deaths: 620000, trend: "increasing", urbanPrevalence: 9.8, ruralPrevalence: 4.1 },
    { name: "Stroke", value: 5.7, deaths: 570000, trend: "increasing", urbanPrevalence: 7.1, ruralPrevalence: 4.8 },
    { name: "Tuberculosis", value: 4.1, deaths: 410000, trend: "decreasing", urbanPrevalence: 3.2, ruralPrevalence: 4.7 },
    { name: "Infectious Diseases", value: 7.1, deaths: 710000, trend: "decreasing", urbanPrevalence: 5.9, ruralPrevalence: 7.8 }
  ],
  2025: [
    { name: "Cardiovascular Diseases", value: 29.2, deaths: 2920000, trend: "increasing", urbanPrevalence: 33.8, ruralPrevalence: 26.4 },
    { name: "Respiratory Diseases", value: 10.6, deaths: 1060000, trend: "stable", urbanPrevalence: 12.1, ruralPrevalence: 9.5 },
    { name: "Cancer", value: 8.7, deaths: 870000, trend: "increasing", urbanPrevalence: 11.8, ruralPrevalence: 6.8 },
    { name: "Diabetes", value: 6.8, deaths: 680000, trend: "increasing", urbanPrevalence: 10.4, ruralPrevalence: 4.5 },
    { name: "Stroke", value: 5.9, deaths: 590000, trend: "increasing", urbanPrevalence: 7.4, ruralPrevalence: 5.0 },
    { name: "Tuberculosis", value: 3.8, deaths: 380000, trend: "decreasing", urbanPrevalence: 2.9, ruralPrevalence: 4.3 },
    { name: "Infectious Diseases", value: 6.4, deaths: 640000, trend: "decreasing", urbanPrevalence: 5.2, ruralPrevalence: 7.1 }
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

const COLORS = ['#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#3B82F6']

export default function TimeSeriesDiseaseBurden() {
  const [selectedYear, setSelectedYear] = useState(2024)
  const [viewMode, setViewMode] = useState('mortality') // 'mortality', 'trends', 'urbanRural'

  const currentData = timeSeriesDiseaseBurden[selectedYear]
  const years = Object.keys(timeSeriesDiseaseBurden).map(Number).sort()

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-lg">
          <p className="text-white font-semibold text-sm mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-blue-400 text-sm">Mortality: {data.value}%</p>
            <p className="text-green-400 text-sm">Deaths: {data.deaths?.toLocaleString()}</p>
            <p className="text-yellow-400 text-sm">Trend: {data.trend}</p>
            <p className="text-purple-400 text-sm">Urban: {data.urbanPrevalence}%</p>
            <p className="text-pink-400 text-sm">Rural: {data.ruralPrevalence}%</p>
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

  const comparisonData = currentData.map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    fullName: item.name,
    urban: item.urbanPrevalence,
    rural: item.ruralPrevalence
  }))

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
              variant={viewMode === 'mortality' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mortality')}
            >
              Disease Burden
            </Button>
            <Button
              variant={viewMode === 'trends' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('trends')}
            >
              Trends
            </Button>
            <Button
              variant={viewMode === 'urbanRural' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('urbanRural')}
            >
              Urban vs Rural
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          {viewMode === 'mortality' && `Disease Burden in India (${selectedYear})`}
          {viewMode === 'trends' && 'Disease Burden Trends (2005-2025)'}
          {viewMode === 'urbanRural' && `Urban-Rural Disease Prevalence (${selectedYear})`}
        </div>
      </div>

      {/* Chart Display */}
      {viewMode === 'mortality' && (
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={currentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={180}
              fill="#8884d8"
              dataKey="value"
            >
              {currentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'trends' && (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={diseaseTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="year" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
            <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} label={{ value: 'Mortality (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<TrendTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="cardiovascular" stroke="#EF4444" strokeWidth={3} name="Cardiovascular" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="respiratory" stroke="#F59E0B" strokeWidth={3} name="Respiratory" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="cancer" stroke="#8B5CF6" strokeWidth={3} name="Cancer" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="diabetes" stroke="#EC4899" strokeWidth={3} name="Diabetes" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="stroke" stroke="#06B6D4" strokeWidth={3} name="Stroke" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="tuberculosis" stroke="#10B981" strokeWidth={3} name="Tuberculosis" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="infectious" stroke="#3B82F6" strokeWidth={3} name="Infectious" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'urbanRural' && (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
