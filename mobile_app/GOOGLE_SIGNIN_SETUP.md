# Google Sign-In Setup Guide for Noble Clarity Mobile

This guide will walk you through setting up real Google Sign-In authentication for the Noble Clarity mobile app.

## Prerequisites
- Google Account
- Access to [Firebase Console](https://console.firebase.google.com/)
- Access to [Google Cloud Console](https://console.cloud.google.com/)

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `Noble Clarity Mobile`
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

---

## Step 2: Add Android App to Firebase

1. In your Firebase project, click the **Android icon** to add an Android app
2. Fill in the registration form:
   - **Android package name**: `com.noblesworld.noble_clarity_mobile`
   - **App nickname** (optional): `Noble Clarity Mobile`
   - **Debug signing certificate SHA-1**: (See instructions below)
3. Click **"Register app"**
4. Download the `google-services.json` file
5. Place it in: `mobile_app/android/app/google-services.json`

### Getting SHA-1 Certificate

Open PowerShell and run:
```powershell
cd "C:\Projects\noble-clarity-mobile\android"
.\gradlew signingReport
```

Look for the **SHA-1** under `Variant: debug` and copy it.

---

## Step 3: Enable Google Sign-In in Firebase

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle **Enable**
4. Set **Project support email** (your email)
5. Click **Save**

---

## Step 4: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project from the dropdown
3. Go to **APIs & Services** → **Credentials**
4. You should see an **OAuth 2.0 Client ID** already created by Firebase
5. Click on the **Web client** (auto-created by Google Service)
6. Copy the **Client ID** - you'll need this!

---

## Step 5: Update Android Configuration

### 5.1 Update `android/build.gradle`

Add the Google Services plugin:

```gradle
buildscript {
    dependencies {
        // ... existing dependencies
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

### 5.2 Update `android/app/build.gradle`

At the **bottom** of the file, add:

```gradle
apply plugin: 'com.google.gms.google-services'
```

---

## Step 6: Add Configuration File

Create a file: `mobile_app/lib/core/firebase_config.dart`

```dart
class FirebaseConfig {
  // Get this from Google Cloud Console → Credentials → Web client
  static const String webClientId = 'YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com';
}
```

**Replace `YOUR_WEB_CLIENT_ID_HERE` with the actual Web Client ID from Step 4!**

---

## Step 7: Update Main.dart

The main.dart file will be automatically updated to initialize Firebase.

---

## Step 8: Install Dependencies

In PowerShell, navigate to the project and run:

```powershell
cd C:\Projects\noble-clarity-mobile
flutter pub get
```

---

## Step 9: Test the App

1. Make sure your emulator is running
2. Run the app:
   ```powershell
   flutter run -d emulator-5554
   ```
3. Click **"Sign In with Google"**
4. You should see the Google account picker!

---

## Troubleshooting

### Error: "Developer Error" or "Sign-in failed"
- **Cause**: SHA-1 certificate mismatch
- **Fix**: Re-run `gradlew signingReport` and update the SHA-1 in Firebase Console

### Error: "API not enabled"
- **Cause**: Google Sign-In API not enabled
- **Fix**: Go to Google Cloud Console → APIs & Services → Enable "Google Sign-In API"

### Error: "google-services.json not found"
- **Cause**: Configuration file not in the correct location
- **Fix**: Ensure `google-services.json` is in `android/app/` directory

### Error: "PlatformException(sign_in_failed)"
- **Cause**: Web Client ID not configured
- **Fix**: Double-check the `webClientId` in `firebase_config.dart`

---

## Security Notes

1. **Never commit** `google-services.json` to public repositories
2. Add to `.gitignore`:
   ```
   android/app/google-services.json
   lib/core/firebase_config.dart
   ```
3. Use environment variables for production builds

---

## Next Steps

After successful setup:
- Test sign-in on a real Android device
- Set up iOS configuration (similar process)
- Implement sign-out functionality
- Add user profile management
- Connect to your backend API

---

## Support

If you encounter issues:
1. Check the [Firebase Documentation](https://firebase.google.com/docs/auth/android/google-signin)
2. Review the [Google Sign-In Flutter Package](https://pub.dev/packages/google_sign_in)
3. Ensure all package versions are compatible

---

**Last Updated**: January 2026
**Version**: 1.0.0
