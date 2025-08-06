"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguagePreferences } from '@/hooks/useLanguagePreferences';
import { useAuth } from '@/hooks/useAuth';

export function LanguageSetupRedirect({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { needsSetup, loading } = useLanguagePreferences();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if:
    // - Still loading
    // - No user
    // - Already on setup page
    // - On login page
    if (loading || !user || pathname === '/setup-languages' || pathname === '/login') {
      return;
    }

    // Redirect to language setup if needed
    if (needsSetup) {
      router.push('/setup-languages');
    }
  }, [user, needsSetup, loading, router, pathname]);

  // Show loading or redirect in progress
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user needs setup and not on setup page, don't render children
  if (user && needsSetup && pathname !== '/setup-languages' && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
