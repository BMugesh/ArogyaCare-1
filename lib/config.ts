// API Configuration for different environments
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.railway.app'
  : 'http://localhost:5000'

export const API_ENDPOINTS = {
  ASK: `${API_BASE_URL}/ask`,
  DOCTORS: `${API_BASE_URL}/doctors`,
  NEWS: `${API_BASE_URL}/news`,
  LOCATION: `${API_BASE_URL}/location`,
  HEALTH_CHECK: `${API_BASE_URL}/health`
}

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
