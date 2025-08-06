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
    
    // Show prompt if:
    // 1. User is not authenticated
    // 2. User hasn't seen the prompt before (or it's been more than 7 days)
    // 3. User hasn't interacted with any features yet
    if (!user && !hasSeenPrompt && !hasSignedUp) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
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
