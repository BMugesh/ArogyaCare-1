"use client"

import { useState } from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, AreaChart, Area } from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Time series data for State-wise Healthcare Analysis (2005-2025)
const timeSeriesStateData = {
  2005: [
    { state: "Kerala", doctorsPer1000: 1.2, hospitalBeds: 1.8, healthCenters: 78, lifeExpectancy: 71.2, infantMortality: 12, literacyRate: 90.9, population: 31.8 },
    { state: "Tamil Nadu", doctorsPer1000: 0.8, hospitalBeds: 1.4, healthCenters: 72, lifeExpectancy: 66.2, infantMortality: 30, literacyRate: 73.5, population: 62.4 },
    { state: "Karnataka", doctorsPer1000: 0.7, hospitalBeds: 1.1, healthCenters: 65, lifeExpectancy: 63.8, infantMortality: 41, literacyRate: 67.0, population: 52.9 },
    { state: "Maharashtra", doctorsPer1000: 0.6, hospitalBeds: 0.9, healthCenters: 58, lifeExpectancy: 67.6, infantMortality: 38, literacyRate: 77.3, population: 96.9 },
    { state: "Gujarat", doctorsPer1000: 0.5, hospitalBeds: 0.8, healthCenters: 52, lifeExpectancy: 65.2, infantMortality: 52, literacyRate: 69.1, population: 50.7 },
    { state: "Punjab", doctorsPer1000: 0.9, hospitalBeds: 1.2, healthCenters: 68, lifeExpectancy: 69.0, infantMortality: 34, literacyRate: 69.7, population: 24.3 },
    { state: "Haryana", doctorsPer1000: 0.4, hospitalBeds: 0.7, healthCenters: 45, lifeExpectancy: 66.1, infantMortality: 60, literacyRate: 68.6, population: 21.1 },
    { state: "Rajasthan", doctorsPer1000: 0.3, hospitalBeds: 0.5, healthCenters: 38, lifeExpectancy: 64.7, infantMortality: 68, literacyRate: 61.0, population: 56.5 },
    { state: "Uttar Pradesh", doctorsPer1000: 0.2, hospitalBeds: 0.3, healthCenters: 28, lifeExpectancy: 58.1, infantMortality: 73, literacyRate: 57.4, population: 166.2 },
    { state: "Bihar", doctorsPer1000: 0.1, hospitalBeds: 0.2, healthCenters: 22, lifeExpectancy: 60.1, infantMortality: 61, literacyRate: 47.5, population: 82.9 }
  ],
  2010: [
    { state: "Kerala", doctorsPer1000: 1.4, hospitalBeds: 1.9, healthCenters: 82, lifeExpectancy: 72.8, infantMortality: 10, literacyRate: 93.9, population: 33.4 },
    { state: "Tamil Nadu", doctorsPer1000: 0.9, hospitalBeds: 1.5, healthCenters: 76, lifeExpectancy: 67.6, infantMortality: 26, literacyRate: 80.1, population: 72.1 },
    { state: "Karnataka", doctorsPer1000: 0.8, hospitalBeds: 1.2, healthCenters: 69, lifeExpectancy: 65.8, infantMortality: 35, literacyRate: 75.4, population: 61.1 },
    { state: "Maharashtra", doctorsPer1000: 0.7, hospitalBeds: 1.0, healthCenters: 62, lifeExpectancy: 69.6, infantMortality: 31, literacyRate: 82.3, population: 112.4 },
    { state: "Gujarat", doctorsPer1000: 0.6, hospitalBeds: 0.9, healthCenters: 58, lifeExpectancy: 67.2, infantMortality: 44, literacyRate: 78.0, population: 60.4 },
    { state: "Punjab", doctorsPer1000: 1.0, hospitalBeds: 1.3, healthCenters: 72, lifeExpectancy: 70.0, infantMortality: 28, literacyRate: 75.8, population: 27.7 },
    { state: "Haryana", doctorsPer1000: 0.5, hospitalBeds: 0.8, healthCenters: 52, lifeExpectancy: 67.1, infantMortality: 48, literacyRate: 75.6, population: 25.4 },
    { state: "Rajasthan", doctorsPer1000: 0.4, hospitalBeds: 0.6, healthCenters: 45, lifeExpectancy: 66.7, infantMortality: 55, literacyRate: 66.1, population: 68.5 },
    { state: "Uttar Pradesh", doctorsPer1000: 0.3, hospitalBeds: 0.4, healthCenters: 35, lifeExpectancy: 60.1, infantMortality: 57, literacyRate: 67.7, population: 199.8 },
    { state: "Bihar", doctorsPer1000: 0.2, hospitalBeds: 0.3, healthCenters: 28, lifeExpectancy: 62.1, infantMortality: 48, literacyRate: 61.8, population: 104.1 }
  ],
  2015: [
    { state: "Kerala", doctorsPer1000: 1.6, hospitalBeds: 2.0, healthCenters: 88, lifeExpectancy: 74.2, infantMortality: 8, literacyRate: 94.0, population: 33.4 },
    { state: "Tamil Nadu", doctorsPer1000: 1.0, hospitalBeds: 1.6, healthCenters: 81, lifeExpectancy: 68.6, infantMortality: 21, literacyRate: 80.1, population: 72.1 },
    { state: "Karnataka", doctorsPer1000: 0.9, hospitalBeds: 1.3, healthCenters: 74, lifeExpectancy: 66.8, infantMortality: 28, literacyRate: 75.4, population: 61.1 },
    { state: "Maharashtra", doctorsPer1000: 0.8, hospitalBeds: 1.1, healthCenters: 68, lifeExpectancy: 70.6, infantMortality: 27, literacyRate: 82.3, population: 112.4 },
    { state: "Gujarat", doctorsPer1000: 0.7, hospitalBeds: 1.0, healthCenters: 64, lifeExpectancy: 68.2, infantMortality: 38, literacyRate: 78.0, population: 60.4 },
    { state: "Punjab", doctorsPer1000: 1.1, hospitalBeds: 1.4, healthCenters: 78, lifeExpectancy: 71.0, infantMortality: 24, literacyRate: 75.8, population: 27.7 },
    { state: "Haryana", doctorsPer1000: 0.6, hospitalBeds: 0.9, healthCenters: 58, lifeExpectancy: 67.1, infantMortality: 41, literacyRate: 75.6, population: 25.4 },
    { state: "Rajasthan", doctorsPer1000: 0.5, hospitalBeds: 0.7, healthCenters: 52, lifeExpectancy: 67.7, infantMortality: 47, literacyRate: 66.1, population: 68.5 },
    { state: "Uttar Pradesh", doctorsPer1000: 0.3, hospitalBeds: 0.5, healthCenters: 42, lifeExpectancy: 61.1, infantMortality: 48, literacyRate: 67.7, population: 199.8 },
    { state: "Bihar", doctorsPer1000: 0.2, hospitalBeds: 0.4, healthCenters: 35, lifeExpectancy: 63.1, infantMortality: 42, literacyRate: 61.8, population: 104.1 }
  ],
  2020: [
    { state: "Kerala", doctorsPer1000: 1.7, hospitalBeds: 2.0, healthCenters: 92, lifeExpectancy: 74.9, infantMortality: 7, literacyRate: 94.0, population: 35.0 },
    { state: "Tamil Nadu", doctorsPer1000: 1.1, hospitalBeds: 1.7, healthCenters: 85, lifeExpectancy: 69.6, infantMortality: 19, literacyRate: 80.1, population: 77.8 },
    { state: "Karnataka", doctorsPer1000: 1.0, hospitalBeds: 1.4, healthCenters: 79, lifeExpectancy: 67.8, infantMortality: 25, literacyRate: 75.4, population: 67.9 },
    { state: "Maharashtra", doctorsPer1000: 0.9, hospitalBeds: 1.2, healthCenters: 74, lifeExpectancy: 71.6, infantMortality: 25, literacyRate: 82.3, population: 123.1 },
    { state: "Gujarat", doctorsPer1000: 0.8, hospitalBeds: 1.1, healthCenters: 70, lifeExpectancy: 69.2, infantMortality: 33, literacyRate: 78.0, population: 70.0 },
    { state: "Punjab", doctorsPer1000: 1.2, hospitalBeds: 1.5, healthCenters: 82, lifeExpectancy: 71.5, infantMortality: 22, literacyRate: 75.8, population: 30.1 },
    { state: "Haryana", doctorsPer1000: 0.7, hospitalBeds: 1.0, healthCenters: 65, lifeExpectancy: 68.1, infantMortality: 36, literacyRate: 75.6, population: 28.9 },
    { state: "Rajasthan", doctorsPer1000: 0.5, hospitalBeds: 0.8, healthCenters: 58, lifeExpectancy: 68.7, infantMortality: 41, literacyRate: 66.1, population: 81.0 },
    { state: "Uttar Pradesh", doctorsPer1000: 0.4, hospitalBeds: 0.5, healthCenters: 48, lifeExpectancy: 62.1, infantMortality: 45, literacyRate: 67.7, population: 237.9 },
    { state: "Bihar", doctorsPer1000: 0.3, hospitalBeds: 0.5, healthCenters: 42, lifeExpectancy: 64.1, infantMortality: 38, literacyRate: 61.8, population: 128.5 }
  ],
  2024: [
    { state: "Kerala", doctorsPer1000: 1.8, hospitalBeds: 2.1, healthCenters: 95, lifeExpectancy: 75.2, infantMortality: 7, literacyRate: 94.0, population: 35.0 },
    { state: "Tamil Nadu", doctorsPer1000: 1.2, hospitalBeds: 1.8, healthCenters: 88, lifeExpectancy: 70.6, infantMortality: 19, literacyRate: 80.1, population: 77.8 },
    { state: "Karnataka", doctorsPer1000: 1.1, hospitalBeds: 1.5, healthCenters: 82, lifeExpectancy: 68.8, infantMortality: 23, literacyRate: 75.4, population: 67.9 },
    { state: "Maharashtra", doctorsPer1000: 1.0, hospitalBeds: 1.3, healthCenters: 78, lifeExpectancy: 72.6, infantMortality: 24, literacyRate: 82.3, population: 123.1 },
    { state: "Gujarat", doctorsPer1000: 0.9, hospitalBeds: 1.2, healthCenters: 75, lifeExpectancy: 70.2, infantMortality: 30, literacyRate: 78.0, population: 70.0 },
    { state: "Punjab", doctorsPer1000: 1.3, hospitalBeds: 1.6, healthCenters: 85, lifeExpectancy: 72.0, infantMortality: 21, literacyRate: 75.8, population: 30.1 },
    { state: "Haryana", doctorsPer1000: 0.8, hospitalBeds: 1.1, healthCenters: 72, lifeExpectancy: 69.1, infantMortality: 33, literacyRate: 75.6, population: 28.9 },
    { state: "Rajasthan", doctorsPer1000: 0.6, hospitalBeds: 0.9, healthCenters: 65, lifeExpectancy: 69.7, infantMortality: 37, literacyRate: 66.1, population: 81.0 },
    { state: "Uttar Pradesh", doctorsPer1000: 0.4, hospitalBeds: 0.6, healthCenters: 58, lifeExpectancy: 64.1, infantMortality: 43, literacyRate: 67.7, population: 237.9 },
    { state: "Bihar", doctorsPer1000: 0.3, hospitalBeds: 0.6, healthCenters: 48, lifeExpectancy: 65.1, infantMortality: 35, literacyRate: 61.8, population: 128.5 }
  ],
  2025: [
    { state: "Kerala", doctorsPer1000: 1.9, hospitalBeds: 2.2, healthCenters: 97, lifeExpectancy: 75.8, infantMortality: 6, literacyRate: 94.5, population: 35.2 },
    { state: "Tamil Nadu", doctorsPer1000: 1.3, hospitalBeds: 1.9, healthCenters: 90, lifeExpectancy: 71.2, infantMortality: 18, literacyRate: 81.0, population: 78.5 },
    { state: "Karnataka", doctorsPer1000: 1.2, hospitalBeds: 1.6, healthCenters: 85, lifeExpectancy: 69.4, infantMortality: 21, literacyRate: 76.2, population: 68.8 },
    { state: "Maharashtra", doctorsPer1000: 1.1, hospitalBeds: 1.4, healthCenters: 82, lifeExpectancy: 73.2, infantMortality: 22, literacyRate: 83.1, population: 124.8 },
    { state: "Gujarat", doctorsPer1000: 1.0, hospitalBeds: 1.3, healthCenters: 78, lifeExpectancy: 70.8, infantMortality: 28, literacyRate: 79.2, population: 71.2 },
    { state: "Punjab", doctorsPer1000: 1.4, hospitalBeds: 1.7, healthCenters: 88, lifeExpectancy: 72.5, infantMortality: 19, literacyRate: 76.5, population: 30.5 },
    { state: "Haryana", doctorsPer1000: 0.9, hospitalBeds: 1.2, healthCenters: 75, lifeExpectancy: 69.8, infantMortality: 30, literacyRate: 76.8, population: 29.5 },
    { state: "Rajasthan", doctorsPer1000: 0.7, hospitalBeds: 1.0, healthCenters: 68, lifeExpectancy: 70.4, infantMortality: 34, literacyRate: 67.5, population: 82.8 },
    { state: "Uttar Pradesh", doctorsPer1000: 0.5, hospitalBeds: 0.7, healthCenters: 62, lifeExpectancy: 65.1, infantMortality: 40, literacyRate: 69.2, population: 241.5 },
    { state: "Bihar", doctorsPer1000: 0.4, hospitalBeds: 0.7, healthCenters: 52, lifeExpectancy: 66.1, infantMortality: 32, literacyRate: 63.5, population: 131.2 }
  ]
}

// Trend data for key metrics
const healthcareProgressData = [
  { year: 2005, avgDoctors: 0.57, avgBeds: 0.87, avgCenters: 52.6, avgLifeExpectancy: 65.3, avgInfantMortality: 48.9 },
  { year: 2010, avgDoctors: 0.64, avgBeds: 0.99, avgCenters: 58.9, avgLifeExpectancy: 67.1, avgInfantMortality: 40.1 },
  { year: 2015, avgDoctors: 0.72, avgBeds: 1.09, avgCenters: 65.0, avgLifeExpectancy: 68.9, avgInfantMortality: 32.4 },
  { year: 2020, avgDoctors: 0.81, avgBeds: 1.17, avgCenters: 70.5, avgLifeExpectancy: 69.8, avgInfantMortality: 28.6 },
  { year: 2024, avgDoctors: 0.87, avgBeds: 1.27, avgCenters: 74.8, avgLifeExpectancy: 70.8, avgInfantMortality: 26.2 },
  { year: 2025, avgDoctors: 0.94, avgBeds: 1.37, avgCenters: 77.7, avgLifeExpectancy: 71.5, avgInfantMortality: 24.0 }
]

export default function TimeSeriesStateAnalysis() {
  const [selectedYear, setSelectedYear] = useState(2024)
  const [viewMode, setViewMode] = useState('infrastructure') // 'infrastructure', 'outcomes', 'trends'

  const currentData = timeSeriesStateData[selectedYear]
  const years = Object.keys(timeSeriesStateData).map(Number).sort()

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-lg">
          <p className="text-white font-semibold text-sm mb-2">{data.state || label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </p>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  const sortedData = [...currentData].sort((a, b) => b.doctorsPer1000 - a.doctorsPer1000)

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
              variant={viewMode === 'infrastructure' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('infrastructure')}
            >
              Infrastructure
            </Button>
            <Button
              variant={viewMode === 'outcomes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('outcomes')}
            >
              Health Outcomes
            </Button>
            <Button
              variant={viewMode === 'trends' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('trends')}
            >
              Progress Trends
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          {viewMode === 'infrastructure' && `Healthcare Infrastructure by State (${selectedYear})`}
          {viewMode === 'outcomes' && `Health Outcomes by State (${selectedYear})`}
          {viewMode === 'trends' && 'National Healthcare Progress (2005-2025)'}
        </div>
      </div>

      {/* Chart Display */}
      {viewMode === 'infrastructure' && (
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
              name="Healthcare Access %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'outcomes' && (
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
              yAxisId="right"
              type="monotone" 
              dataKey="literacyRate" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              name="Literacy Rate %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'trends' && (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={healthcareProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="year" 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              label={{ value: 'National Average', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="avgDoctors" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="Doctors per 1000"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="avgBeds" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Hospital Beds per 1000"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="avgLifeExpectancy" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              name="Life Expectancy"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="avgInfantMortality" 
              stroke="#EF4444" 
              strokeWidth={3}
              name="Infant Mortality"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
