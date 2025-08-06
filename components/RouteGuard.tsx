"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { AuthPrompt } from '@/components/AuthPrompt';

// Pages that are accessible to guest users (not signed in)
const GUEST_ACCESSIBLE_PAGES = [
  '/',
  '/our-team',
  '/health-insights',
  '/hero',
  '/login',
  '/setup-languages'
];

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    // Don't check while auth is loading
    if (loading) return;

    // If user is authenticated, allow access to all pages
    if (user) {
      setShowAuthPrompt(false);
      return;
    }

    // Check if current page is accessible to guests
    const isGuestAccessible = GUEST_ACCESSIBLE_PAGES.some(page => {
      if (page === '/') return pathname === '/';
      return pathname.startsWith(page);
    });

    // If page is not accessible to guests, show auth prompt
    if (!isGuestAccessible) {
      setShowAuthPrompt(true);
    } else {
      setShowAuthPrompt(false);
    }
  }, [user, loading, pathname]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show auth prompt for protected pages when user is not authenticated
  if (showAuthPrompt && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <AuthPrompt 
          onClose={() => {
            // Don't allow closing on protected pages - user must sign in
            console.log('User must sign in to access this page');
          }}
          showCloseButton={false}
        />
      </div>
    );
  }

  // Render the page content
  return <>{children}</>;
}
