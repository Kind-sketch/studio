# Firebase Setup Guide

This document outlines the steps to properly configure Firebase for the Artistry Havens application.

## Prerequisites

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following Firebase services:
   - Authentication (Phone Auth provider)
   - Firestore Database
   - Storage (if needed for images)

## Configuration Steps

### 1. Environment Variables

Update the `.env.local` file with your actual Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (for server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

### 2. Firebase Initialization

The application uses a Firebase context provider located at `src/context/firebase-context.tsx` to initialize Firebase services.

### 3. Authentication Implementation

The authentication pages have been updated to use Firebase services:
- `src/app/auth/auth-client-page.tsx`
- `src/app/artisan/register/page.tsx`

These pages use the Firebase service functions from `src/services/firebase-service.ts`.

### 4. Data Operations

All data operations (users, products, etc.) are handled through the Firebase service.

## Replacing Mock Implementation

When Firebase dependencies are properly installed, replace the mock implementations in:
- `src/services/firebase-service.ts`
- `src/context/firebase-context.tsx`

With actual Firebase imports:

```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
```

## Troubleshooting

If you encounter dependency issues:
1. Run `npm install --legacy-peer-deps` to install all dependencies
2. Ensure `@types/node` is installed: `npm install --save-dev @types/node`
3. Update `tsconfig.json` to include Node types if needed

## Next Steps

1. Create Firestore collections for:
   - users
   - products
   - orders
   - artisans
   - sponsors

2. Set up Firebase Security Rules for Firestore
3. Configure Firebase Storage rules if using image uploads