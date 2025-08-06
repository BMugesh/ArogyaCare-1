"use client"

import React, { createContext, useContext, ReactNode } from "react"

// Create a safe auth context to prevent destructuring errors
interface AuthContextType {
  auth?: any
  user?: any
  isAuthenticated?: boolean
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  user: null,
  isAuthenticated: false
})

// Safe auth provider that provides default values
export function AuthProvider({ children }: { children: ReactNode }) {
  const authValue: AuthContextType = {
    auth: null,
    user: null,
    isAuthenticated: false
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Safe auth hook
export function useAuth() {
  const context = useContext(AuthContext)
  // Always return a valid object to prevent destructuring errors
  return context || { auth: null, user: null, isAuthenticated: false }
}

// Generic safe context provider for any missing contexts
interface SafeContextType {
  [key: string]: any
}

const SafeContext = createContext<SafeContextType>({})

export function SafeContextProvider({ children }: { children: ReactNode }) {
  // Provide safe defaults for any context that might be missing
  const safeValues = {
    auth: null,
    user: null,
    isAuthenticated: false,
    // Add any other common context properties that might be missing
  }

  return (
    <SafeContext.Provider value={safeValues}>
      {children}
    </SafeContext.Provider>
  )
}
