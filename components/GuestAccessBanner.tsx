"use client";

import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Lock, UserPlus } from 'lucide-react';
import Link from 'next/link';

export function GuestAccessBanner() {
  const { user } = useAuth();

  // Only show for non-authenticated users
  if (user) return null;

  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-800 mb-6">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            You're browsing as a guest. Some features are limited.
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/login?tab=signup">
            <Button size="sm" className="h-8">
              <UserPlus className="h-3 w-3 mr-1" />
              Sign Up
            </Button>
          </Link>
          <Link href="/login?tab=signin">
            <Button size="sm" variant="outline" className="h-8">
              Sign In
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface RestrictedFeatureProps {
  featureName: string;
  children: React.ReactNode;
}

export function RestrictedFeature({ featureName, children }: RestrictedFeatureProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="relative">
        {/* Blurred content */}
        <div className="blur-sm pointer-events-none opacity-50">
          {children}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-sm">
            <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sign Up to Access {featureName}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Create a free account to unlock this feature and get personalized health insights.
            </p>
            <div className="space-y-2">
              <Link href="/login?tab=signup">
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Free Account
                </Button>
              </Link>
              <Link href="/login?tab=signin">
                <Button variant="outline" className="w-full">
                  Already have an account? Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
