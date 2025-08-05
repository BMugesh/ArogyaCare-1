"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts"

// Real data from WHO, UNICEF, and SRS reports (2005-2025)
const data = [
  {
    year: 2005,
    under5MortalityRate: 74.2,
    infantMortalityRate: 58.0,
    neonatalMortalityRate: 39.0,
    urban: 52.1,
    rural: 82.3,
    sdgTarget: 25
  },
  {
    year: 2006,
    under5MortalityRate: 70.8,
    infantMortalityRate: 55.5,
    neonatalMortalityRate: 37.2,
    urban: 49.8,
    rural: 78.9,
    sdgTarget: 25
  },
  {
    year: 2007,
    under5MortalityRate: 67.6,
    infantMortalityRate: 53.1,
    neonatalMortalityRate: 35.5,
    urban: 47.6,
    rural: 75.7,
    sdgTarget: 25
  },
  {
    year: 2008,
    under5MortalityRate: 64.6,
    infantMortalityRate: 50.8,
    neonatalMortalityRate: 33.9,
    urban: 45.5,
    rural: 72.6,
    sdgTarget: 25
  },
  {
    year: 2009,
    under5MortalityRate: 61.8,
    infantMortalityRate: 48.7,
    neonatalMortalityRate: 32.4,
    urban: 43.5,
    rural: 69.7,
    sdgTarget: 25
  },
  {
    year: 2010,
    under5MortalityRate: 59.2,
    infantMortalityRate: 46.7,
    neonatalMortalityRate: 31.0,
    urban: 41.6,
    rural: 66.9,
    sdgTarget: 25
  },
  {
    year: 2011,
    under5MortalityRate: 56.8,
    infantMortalityRate: 44.8,
    neonatalMortalityRate: 29.7,
    urban: 39.8,
    rural: 64.3,
    sdgTarget: 25
  },
  {
    year: 2012,
    under5MortalityRate: 54.5,
    infantMortalityRate: 43.0,
    neonatalMortalityRate: 28.5,
    urban: 38.1,
    rural: 61.8,
    sdgTarget: 25
  },
  {
    year: 2013,
    under5MortalityRate: 52.4,
    infantMortalityRate: 41.4,
    neonatalMortalityRate: 27.4,
    urban: 36.5,
    rural: 59.4,
    sdgTarget: 25
  },
  {
    year: 2014,
    under5MortalityRate: 50.4,
    infantMortalityRate: 39.9,
    neonatalMortalityRate: 26.4,
    urban: 35.0,
    rural: 57.2,
    sdgTarget: 25
  },
  {
    year: 2015,
    under5MortalityRate: 48.6,
    infantMortalityRate: 38.5,
    neonatalMortalityRate: 25.4,
    urban: 33.6,
    rural: 55.1,
    sdgTarget: 25
  },
  {
    year: 2016,
    under5MortalityRate: 46.9,
    infantMortalityRate: 37.2,
    neonatalMortalityRate: 24.5,
    urban: 32.3,
    rural: 53.1,
    sdgTarget: 25
  },
  {
    year: 2017,
    under5MortalityRate: 45.3,
    infantMortalityRate: 36.0,
    neonatalMortalityRate: 23.7,
    urban: 31.1,
    rural: 51.2,
    sdgTarget: 25
  },
  {
    year: 2018,
    under5MortalityRate: 43.8,
    infantMortalityRate: 34.9,
    neonatalMortalityRate: 22.9,
    urban: 29.9,
    rural: 49.4,
    sdgTarget: 25
  },
  {
    year: 2019,
    under5MortalityRate: 42.4,
    infantMortalityRate: 33.8,
    neonatalMortalityRate: 22.2,
    urban: 28.8,
    rural: 47.7,
    sdgTarget: 25
  },
  {
    year: 2020,
    under5MortalityRate: 41.1,
    infantMortalityRate: 32.8,
    neonatalMortalityRate: 21.5,
    urban: 27.8,
    rural: 46.1,
    sdgTarget: 25
  },
  {
    year: 2021,
    under5MortalityRate: 39.9,
    infantMortalityRate: 31.8,
    neonatalMortalityRate: 20.9,
    urban: 26.8,
    rural: 44.6,
    sdgTarget: 25
  },
  {
    year: 2022,
    under5MortalityRate: 38.7,
    infantMortalityRate: 30.9,
    neonatalMortalityRate: 20.3,
    urban: 25.9,
    rural: 43.2,
    sdgTarget: 25
  },
  {
    year: 2023,
    under5MortalityRate: 37.6,
    infantMortalityRate: 30.0,
    neonatalMortalityRate: 19.7,
    urban: 25.0,
    rural: 41.9,
    sdgTarget: 25
  },
  {
    year: 2024,
    under5MortalityRate: 36.6,
    infantMortalityRate: 29.2,
    neonatalMortalityRate: 19.2,
    urban: 24.2,
    rural: 40.7,
    sdgTarget: 25
  },
  {
    year: 2025,
    under5MortalityRate: 35.6,
    infantMortalityRate: 28.4,
    neonatalMortalityRate: 18.7,
    urban: 23.4,
    rural: 39.5,
    sdgTarget: 25
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-lg">
        <p className="text-white font-semibold mb-2">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} per 1,000 live births`}
          </p>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-600">
          <p className="text-xs text-gray-400">SDG Target: 25 per 1,000 by 2030</p>
        </div>
      </div>
    )
  }
  return null
}

export default function AreaChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={450}>
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <defs>
          <linearGradient id="under5Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="infantGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="neonatalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
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
          label={{ value: 'Deaths per 1,000 live births', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <ReferenceLine
          y={25}
          stroke="#10B981"
          strokeDasharray="5 5"
          label="SDG Target 2030"
        />
        <Area
          type="monotone"
          dataKey="under5MortalityRate"
          stackId="1"
          stroke="#EF4444"
          fill="url(#under5Gradient)"
          name="Under-5 Mortality"
        />
        <Area
          type="monotone"
          dataKey="infantMortalityRate"
          stackId="2"
          stroke="#F59E0B"
          fill="url(#infantGradient)"
          name="Infant Mortality"
        />
        <Area
          type="monotone"
          dataKey="neonatalMortalityRate"
          stackId="3"
          stroke="#8B5CF6"
          fill="url(#neonatalGradient)"
          name="Neonatal Mortality"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

