"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Language {
  code: string;
  name: string;
  localName: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', localName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', localName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', localName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', localName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', localName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', localName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', localName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', localName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', localName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', localName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', localName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', localName: 'অসমীয়া', flag: '🇮🇳' }
];

export interface UserLanguagePreferences {
  primaryLanguage: Language;
  secondaryLanguage: Language | null;
  currentLanguage: Language;
  isSetupComplete: boolean;
}

interface LanguageContextType {
  preferences: UserLanguagePreferences | null;
  loading: boolean;
  setLanguagePreferences: (primary: Language, secondary: Language | null) => Promise<void>;
  switchLanguage: (language: Language) => void;
  needsSetup: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguagePreferences() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguagePreferences must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserLanguagePreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  // Load user language preferences from Firestore
  useEffect(() => {
    const loadLanguagePreferences = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'userPreferences', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const primaryLang = AVAILABLE_LANGUAGES.find(lang => lang.code === data.primaryLanguage) || AVAILABLE_LANGUAGES[0];
          const secondaryLang = data.secondaryLanguage 
            ? AVAILABLE_LANGUAGES.find(lang => lang.code === data.secondaryLanguage) 
            : null;

          setPreferences({
            primaryLanguage: primaryLang,
            secondaryLanguage: secondaryLang,
            currentLanguage: primaryLang,
            isSetupComplete: data.isSetupComplete || false
          });

          setNeedsSetup(!data.isSetupComplete);
        } else {
          // New user - set default to English and mark as needing setup
          const defaultPrefs: UserLanguagePreferences = {
            primaryLanguage: AVAILABLE_LANGUAGES[0], // English
            secondaryLanguage: null,
            currentLanguage: AVAILABLE_LANGUAGES[0],
            isSetupComplete: false
          };
          setPreferences(defaultPrefs);
          setNeedsSetup(true);
        }
      } catch (error) {
        console.error('Error loading language preferences:', error);
        // Fallback to default
        const defaultPrefs: UserLanguagePreferences = {
          primaryLanguage: AVAILABLE_LANGUAGES[0],
          secondaryLanguage: null,
          currentLanguage: AVAILABLE_LANGUAGES[0],
          isSetupComplete: false
        };
        setPreferences(defaultPrefs);
        setNeedsSetup(true);
      } finally {
        setLoading(false);
      }
    };

    loadLanguagePreferences();
  }, [user]);

  const setLanguagePreferences = async (primary: Language, secondary: Language | null) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'userPreferences', user.uid);
      await setDoc(userDocRef, {
        primaryLanguage: primary.code,
        secondaryLanguage: secondary?.code || null,
        isSetupComplete: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const newPreferences: UserLanguagePreferences = {
        primaryLanguage: primary,
        secondaryLanguage: secondary,
        currentLanguage: primary,
        isSetupComplete: true
      };

      setPreferences(newPreferences);
      setNeedsSetup(false);
    } catch (error) {
      console.error('Error saving language preferences:', error);
      throw error;
    }
  };

  const switchLanguage = (language: Language) => {
    if (!preferences) return;

    // Only allow switching between primary and secondary languages
    const allowedLanguages = [preferences.primaryLanguage];
    if (preferences.secondaryLanguage) {
      allowedLanguages.push(preferences.secondaryLanguage);
    }

    const isAllowed = allowedLanguages.some(lang => lang.code === language.code);
    if (!isAllowed) {
      console.warn('Cannot switch to language not in user preferences:', language.code);
      return;
    }

    setPreferences(prev => prev ? {
      ...prev,
      currentLanguage: language
    } : null);
  };

  return (
    <LanguageContext.Provider value={{
      preferences,
      loading,
      setLanguagePreferences,
      switchLanguage,
      needsSetup
    }}>
      {children}
    </LanguageContext.Provider>
  );
}
