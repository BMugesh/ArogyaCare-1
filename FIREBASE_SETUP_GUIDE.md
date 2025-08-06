# 🔥 Firebase Setup Guide for ArogyaCare

## ❌ Current Error: `auth/configuration-not-found`

This error occurs when Firebase Authentication is not properly configured. Here's how to fix it:

## 🔧 Firebase Console Setup Steps

### 1. **Firebase Project Setup**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `aroghyacare` project
3. Verify project ID is `aroghyacare`

### 2. **Enable Authentication**
1. In Firebase Console, go to **Authentication**
2. Click **Get Started** if not already enabled
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication:
   - Click on **Email/Password**
   - Toggle **Enable**
   - Click **Save**

### 3. **Verify Project Configuration**
1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Verify your web app configuration matches:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBojNBOxifjFE-Wt5UUh99-KQXXl9DN_jg",
  authDomain: "aroghyacare.firebaseapp.com",
  projectId: "aroghyacare",
  storageBucket: "aroghyacare.firebasestorage.app",
  messagingSenderId: "484515538872",
  appId: "1:484515538872:web:b97128ccdb0de44297514d",
  measurementId: "G-B2VQ04QL0F"
};
```

### 4. **Enable Firestore Database**
1. Go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location (closest to your users)

### 5. **Authorized Domains**
1. In **Authentication** → **Settings** → **Authorized domains**
2. Make sure these domains are added:
   - `localhost` (for development)
   - `arogyacare-1.vercel.app` (your Vercel domain)
   - `aroghyacare.firebaseapp.com` (Firebase hosting domain)

## 🛠️ Local Development Setup

### 1. **Environment Variables** (Optional)
Create `.env.local` file in project root:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBojNBOxifjFE-Wt5UUh99-KQXXl9DN_jg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aroghyacare.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aroghyacare
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aroghyacare.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=484515538872
NEXT_PUBLIC_FIREBASE_APP_ID=1:484515538872:web:b97128ccdb0de44297514d
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-B2VQ04QL0F
```

### 2. **Update Firebase Config** (If using env variables)
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

## 🔍 Debugging Steps

### 1. **Check Browser Console**
Open browser dev tools and look for:
- Firebase initialization errors
- Authentication configuration issues
- Network request failures

### 2. **Firebase Debug Component**
The `FirebaseDebug` component (visible in development) shows:
- ✅ Firebase App initialization status
- ✅ Authentication configuration status
- ✅ Firestore connection status
- ❌ Any initialization errors

### 3. **Test Authentication**
1. Try creating a test account
2. Check Firebase Console **Authentication** → **Users** tab
3. Verify user appears after successful signup

## 🏥 Firestore Security Rules

Set up basic security rules in **Firestore** → **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own preference documents
    match /userPreferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read public data
    match /{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

## ⚡ Quick Fixes

### Common Issues:

1. **Wrong Project ID**: Verify `projectId: "aroghyacare"` in config
2. **Authentication Not Enabled**: Enable Email/Password in Firebase Console
3. **Domain Not Authorized**: Add your domain to authorized domains
4. **API Key Issues**: Regenerate API key if needed

### Test Commands:
```bash
# Check if Firebase is reachable
curl -I https://aroghyacare.firebaseapp.com

# Verify Firestore rules
# Go to Firestore → Rules → Publish
```

## 📱 Testing the Fix

1. **Start Development Server**: `npm run dev`
2. **Open Browser**: Go to `http://localhost:3000/login`
3. **Check Debug Panel**: Look for Firebase Debug component in bottom-right
4. **Try Signup**: Create test account with email/password
5. **Check Console**: Look for success/error messages

## 🎯 Expected Behavior After Fix

- ✅ Firebase Debug shows all green checkmarks
- ✅ User signup works without errors
- ✅ User appears in Firebase Console → Authentication → Users
- ✅ Language preferences can be set and saved
- ✅ User can sign in and out successfully

## 🆘 Still Having Issues?

If the error persists:

1. **Check Firebase Project Status**: Ensure billing is enabled if needed
2. **Verify API Quotas**: Check Firebase Console → Usage tab
3. **Try Different Browser**: Clear cache/cookies
4. **Check Network**: Ensure firewall isn't blocking Firebase domains

Contact Firebase Support or check [Firebase Documentation](https://firebase.google.com/docs/auth/web/start) for additional help.
