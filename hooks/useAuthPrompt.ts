"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useAuthPrompt() {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const hasSeenPrompt = localStorage.getItem('arogyacare-auth-prompt-seen');
    const hasSignedUp = localStorage.getItem('arogyacare-has-account');
    const lastVisit = localStorage.getItem('arogyacare-last-visit');
    const currentTime = Date.now();
    
    // Show prompt if:
    // 1. User is not authenticated
    // 2. User hasn't seen the prompt recently (or it's been more than 24 hours)
    // 3. User is returning to home page
    if (!user) {
      const shouldShowPrompt = !hasSeenPrompt || 
        (lastVisit && currentTime - parseInt(lastVisit) > 24 * 60 * 60 * 1000) || // 24 hours
        !hasSignedUp;

      if (shouldShowPrompt) {
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 2000); // Show after 2 seconds

        return () => clearTimeout(timer);
      }
    }

    // Update last visit time
    localStorage.setItem('arogyacare-last-visit', currentTime.toString());
  }, [user]);

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Remember that user has seen the prompt (expires in 7 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem('arogyacare-auth-prompt-seen', expiryDate.toISOString());
  };

  const markUserInteraction = (feature: string) => {
    setHasInteracted(true);
    // If user tries to use a feature, show the prompt immediately
    if (!user && !showPrompt) {
      setShowPrompt(true);
    }
  };

  return {
    showPrompt,
    dismissPrompt,
    markUserInteraction,
    hasInteracted
  };
}
