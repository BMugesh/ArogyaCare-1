"use client";

import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in...', { email, authConfigured: !!auth.config });
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful', { user: result.user.uid });
      return { user: result.user, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = error.message;
      
      // Provide helpful error messages
      if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Firebase authentication is not properly configured. Please check the Firebase setup.';
      } else if (error.code === 'auth/invalid-api-key') {
        errorMessage = 'Invalid Firebase API key. Please check the configuration.';
      } else if (error.code === 'auth/project-not-found') {
        errorMessage = 'Firebase project not found. Please verify the project ID.';
      }
      
      return { user: null, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting sign up...', { email, authConfigured: !!auth.config });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign up successful', { user: result.user.uid });
      return { user: result.user, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = error.message;
      
      // Provide helpful error messages
      if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Firebase authentication is not properly configured. Please check the Firebase setup.';
      } else if (error.code === 'auth/invalid-api-key') {
        errorMessage = 'Invalid Firebase API key. Please check the configuration.';
      } else if (error.code === 'auth/project-not-found') {
        errorMessage = 'Firebase project not found. Please verify the project ID.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please try signing in instead.';
      }
      
      return { user: null, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword
  };
}
