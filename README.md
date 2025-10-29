# Artistry Havens - Project README

## 1. Application Context

Artistry Havens is a modern, AI-enhanced marketplace designed to connect artisans with buyers and sponsors. Built with Next.js, Firebase, and Google's Genkit, it provides a seamless platform for three distinct user roles:

*   **Artisans:** Can showcase their creations, manage their digital storefront, track sales, and interact with sponsors.
*   **Buyers:** Can discover unique handmade goods, browse by category, and even use AI to design custom products.
*   **Sponsors:** Can discover and support talented artisans, fostering the creative community.

The application is multilingual and features a rich, interactive user interface powered by ShadCN components and Tailwind CSS.

## 2. Running Locally & Connecting to Firebase

The application is configured to connect to your live Firebase project when you run it locally. This allows you to see real-time updates in your Firebase Console.

**Before you start:**

1.  **Add Your API Key:** Open the newly created `.env.local` file in the root of the project. Replace `YOUR_API_KEY_HERE` with your actual Google AI (Gemini) API key.
2.  **Enable Phone Sign-In:** Go to your **Firebase Console**, navigate to **Authentication -> Sign-in method**, and ensure the **Phone** provider is enabled.
3.  **Run the App:** Start the local development server using `npm run dev`.

Now, when you register a new user in your locally running application, they will immediately appear in the **Authentication -> Users** tab of your Firebase project.

## 3. Current Progress & Features

The front-end of the application is substantially complete and functional. Key features implemented include:

*   **Multi-Role Authentication:** Secure phone number and OTP-based login for Artisans, Buyers, and Sponsors using Firebase Authentication.
*   **Artisan Portal:**
    *   AI-assisted product creation (image upload, AI-generated descriptions, names, and stories).
    *   Dashboard for tracking revenue, sales, and likes.
    *   Management screens for orders and sponsorships.
    *   AI-powered voice navigation to move between pages.
*   **Buyer Experience:**
    *   Browse products by category.
    *   View detailed product pages.
    *   Use AI to generate custom product designs from text descriptions or reference images.
*   **Sponsor Dashboard:**
    *   Discover artisans and their products to sponsor.

## 4. Recently Resolved File Issues

The application recently experienced several stability issues that have now been fixed:

*   **Hydration Errors:** Multiple pages were attempting to access browser-only APIs like `localStorage` during the initial server-side render. This caused a mismatch with the client-side render, leading to application crashes.
    *   **Fix:** All `localStorage` access has been moved into `useEffect` hooks, ensuring this code only runs on the client-side after the page has fully loaded.

*   **Invalid HTML Structure:** Some components had incorrect HTML nesting (e.g., a `<div>` inside a `<p>` tag), which also contributed to hydration errors.
    *   **Fix:** The HTML structure has been corrected to be valid, resolving these specific errors.

*   **Firebase Initialization Errors:** The application was throwing a `Firebase: No Firebase App '[DEFAULT]' has been created` error because Firebase services were being accessed before the app was properly initialized.
    *   **Fix:** The root layout (`src/app/layout.tsx`) has been wrapped with a `FirebaseClientProvider`, which ensures that the Firebase app is initialized once and made available to all pages before it is needed.

## 5. How to Create the Backend

Currently, the application is running with mock data and a front-end implementation of Firebase. To make it a fully functional, data-persistent application, the Firebase backend needs to be provisioned.

The backend is defined in `docs/backend.json`, which outlines the data schemas for Firestore and the authentication providers.

**Next Step:**
To create and provision the necessary Firebase backend resources (Firestore database and Authentication), you will need to **call the `RequestFirebaseBackendTool`**. This will set up the project scaffolding based on the `backend.json` file, enabling real data storage and user management.
