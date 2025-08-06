"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function FirebaseDebug() {
  const [status, setStatus] = useState({
    app: false,
    auth: false,
    firestore: false,
    error: null as string | null
  });

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Check if Firebase app is initialized
        const appInitialized = !!auth.app;
        
        // Check auth configuration
        const authConfigured = !!auth.config;
        
        // Check Firestore
        const firestoreInitialized = !!db.app;

        setStatus({
          app: appInitialized,
          auth: authConfigured,
          firestore: firestoreInitialized,
          error: null
        });

        console.log('Firebase Debug Info:', {
          'App Name': auth.app.name,
          'Project ID': auth.app.options.projectId,
          'Auth Domain': auth.app.options.authDomain,
          'API Key': auth.app.options.apiKey ? 'Present' : 'Missing',
          'Auth Settings': auth.settings,
          'Current User': auth.currentUser
        });

      } catch (error: any) {
        console.error('Firebase initialization error:', error);
        setStatus({
          app: false,
          auth: false,
          firestore: false,
          error: error.message
        });
      }
    };

    checkFirebase();
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50">
      <CardHeader>
        <CardTitle className="text-sm">Firebase Debug Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Firebase App</span>
          {status.app ? (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              OK
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Failed
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Authentication</span>
          {status.auth ? (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              OK
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Failed
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Firestore</span>
          {status.firestore ? (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              OK
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Failed
            </Badge>
          )}
        </div>

        {status.error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {status.error}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 mt-2">
          Check browser console for detailed logs
        </div>
      </CardContent>
    </Card>
  );
}
