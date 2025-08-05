"use client"

import { useState, useEffect } from "react"

interface ChartWrapperProps {
  children: React.ReactNode
  height?: string
}

export default function ChartWrapper({ children, height = "500px" }: ChartWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={`w-full flex items-center justify-center bg-gray-800 rounded-lg`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chart...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
