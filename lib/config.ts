export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-6459.up.railway.app'
  : 'http://localhost:5000'

export const API_ENDPOINTS = {
  ASK: `${API_BASE_URL}/ask`,
  DOCTORS: `${API_BASE_URL}/doctors`,
  NEWS: `${API_BASE_URL}/news`,
  LOCATION: `${API_BASE_URL}/location`,
  HEALTH_CHECK: `${API_BASE_URL}/health`,
  HEALTH_CENTERS: `${API_BASE_URL}/health-centers`
}
