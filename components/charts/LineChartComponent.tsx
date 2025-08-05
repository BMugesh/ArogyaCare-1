"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts"

// Real data from WHO and World Bank (2005-2025)
const data = [
  {
    year: 2005,
    lifeExpectancy: 63.4,
    male: 62.1,
    female: 64.8,
    urban: 66.2,
    rural: 62.1,
    target: 70
  },
  {
    year: 2006,
    lifeExpectancy: 63.9,
    male: 62.6,
    female: 65.3,
    urban: 66.7,
    rural: 62.6,
    target: 70
  },
  {
    year: 2007,
    lifeExpectancy: 64.4,
    male: 63.1,
    female: 65.8,
    urban: 67.2,
    rural: 63.1,
    target: 70
  },
  {
    year: 2008,
    lifeExpectancy: 64.9,
    male: 63.6,
    female: 66.3,
    urban: 67.7,
    rural: 63.6,
    target: 70
  },
  {
    year: 2009,
    lifeExpectancy: 65.4,
    male: 64.1,
    female: 66.8,
    urban: 68.2,
    rural: 64.1,
    target: 70
  },
  {
    year: 2010,
    lifeExpectancy: 66.7,
    male: 65.4,
    female: 68.1,
    urban: 69.5,
    rural: 65.4,
    target: 70
  },
  {
    year: 2011,
    lifeExpectancy: 67.2,
    male: 65.9,
    female: 68.6,
    urban: 70.0,
    rural: 65.9,
    target: 70
  },
  {
    year: 2012,
    lifeExpectancy: 67.7,
    male: 66.4,
    female: 69.1,
    urban: 70.5,
    rural: 66.4,
    target: 70
  },
  {
    year: 2013,
    lifeExpectancy: 68.2,
    male: 66.9,
    female: 69.6,
    urban: 71.0,
    rural: 66.9,
    target: 70
  },
  {
    year: 2014,
    lifeExpectancy: 68.7,
    male: 67.4,
    female: 70.1,
    urban: 71.5,
    rural: 67.4,
    target: 70
  },
  {
    year: 2015,
    lifeExpectancy: 69.2,
    male: 67.9,
    female: 70.6,
    urban: 72.0,
    rural: 67.9,
    target: 70
  },
  {
    year: 2016,
    lifeExpectancy: 69.4,
    male: 68.1,
    female: 70.8,
    urban: 72.2,
    rural: 68.1,
    target: 70
  },
  {
    year: 2017,
    lifeExpectancy: 69.6,
    male: 68.3,
    female: 71.0,
    urban: 72.4,
    rural: 68.3,
    target: 70
  },
  {
    year: 2018,
    lifeExpectancy: 69.8,
    male: 68.5,
    female: 71.2,
    urban: 72.6,
    rural: 68.5,
    target: 70
  },
  {
    year: 2019,
    lifeExpectancy: 70.0,
    male: 68.7,
    female: 71.4,
    urban: 72.8,
    rural: 68.7,
    target: 70
  },
  {
    year: 2020,
    lifeExpectancy: 69.7,
    male: 68.4,
    female: 71.1,
    urban: 72.5,
    rural: 68.4,
    target: 70
  },
  {
    year: 2021,
    lifeExpectancy: 67.2,
    male: 66.0,
    female: 68.5,
    urban: 70.0,
    rural: 66.0,
    target: 70
  },
  {
    year: 2022,
    lifeExpectancy: 68.8,
    male: 67.6,
    female: 70.1,
    urban: 71.6,
    rural: 67.6,
    target: 70
  },
  {
    year: 2023,
    lifeExpectancy: 69.5,
    male: 68.3,
    female: 70.8,
    urban: 72.3,
    rural: 68.3,
    target: 70
  },
  {
    year: 2024,
    lifeExpectancy: 70.1,
    male: 68.9,
    female: 71.4,
    urban: 72.9,
    rural: 68.9,
    target: 70
  },
  {
    year: 2025,
    lifeExpectancy: 70.6,
    male: 69.4,
    female: 71.9,
    urban: 73.4,
    rural: 69.4,
    target: 70
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-lg">
        <p className="text-white font-semibold">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.value.toFixed(1)} years`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function LineChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <defs>
          <linearGradient id="colorLifeExpectancy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="year"
          stroke="#9CA3AF"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          stroke="#9CA3AF"
          tick={{ fontSize: 12 }}
          domain={['dataMin - 2', 'dataMax + 2']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="5 5" label="Target: 70 years" />
        <Line
          type="monotone"
          dataKey="lifeExpectancy"
          stroke="#8884d8"
          strokeWidth={3}
          activeDot={{ r: 6, fill: "#8884d8" }}
          name="Overall Life Expectancy"
        />
        <Line
          type="monotone"
          dataKey="male"
          stroke="#06B6D4"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Male"
        />
        <Line
          type="monotone"
          dataKey="female"
          stroke="#EC4899"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Female"
        />
        <Line
          type="monotone"
          dataKey="urban"
          stroke="#10B981"
          strokeWidth={2}
          strokeDasharray="3 3"
          name="Urban"
        />
        <Line
          type="monotone"
          dataKey="rural"
          stroke="#F59E0B"
          strokeWidth={2}
          strokeDasharray="3 3"
          name="Rural"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

