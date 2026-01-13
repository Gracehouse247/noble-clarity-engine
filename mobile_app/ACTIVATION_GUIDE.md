# 🚀 Mobile App - Quick Activation Guide

## ✅ What's Already Fixed

### 1. AI Insights Feed - PRODUCTION READY ✅
- ✅ Removed all mock data
- ✅ Connected to real AI backend
- ✅ Generates insights from actual financial data
- ✅ Rule-based fallback when AI unavailable
- ✅ Loading and error states
- **NO ACTION NEEDED** - Works out of the box!

### 2. Voice Assistant - READY TO ACTIVATE ⚡
- ✅ Code structure complete
- ✅ Connected to AI backend
- ✅ Error handling implemented
- ⚠️ **NEEDS PACKAGES** - See activation steps below

### 3. Financial Data Caching - READY TO ACTIVATE ⚡
- ✅ Removed mock data fallback
- ✅ Caching logic implemented
- ⚠️ **NEEDS PACKAGE** - See activation steps below

---

## 📦 Step 1: Add Required Packages

Add to `mobile_app/pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # ... existing packages ...
  
  # Voice Features (for Voice Assistant)
  speech_to_text: ^6.6.0
  flutter_tts: ^3.8.5
  permission_handler: ^11.0.1
  
  # Caching (for offline data)
  shared_preferences: ^2.2.2
  
  # OAuth/Integrations (for future use)
  url_launcher: ^6.2.2
  webview_flutter: ^4.4.2
```

Then run:
```bash
cd mobile_app
flutter pub get
```

---

## 🎤 Step 2: Activate Voice Assistant

### File: `lib/widgets/voice_assistant_sheet.dart`

**Uncomment these sections:**

#### A. Import statements (add at top):
```dart
import 'package:speech_to_text/speech_to_text.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:permission_handler/permission_handler.dart';
```

#### B. Initialize speech services (lines 32-34):
```dart
// UNCOMMENT THESE:
final SpeechToText _speechToText = SpeechToText();
final FlutterTts _flutterTts = FlutterTts();
```

#### C. Initialization code (lines 49-68):
```dart
// UNCOMMENT THIS ENTIRE BLOCK:
bool available = await _speechToText.initialize(
  onError: (error) => _handleError(error.errorMsg),
  onStatus: (status) => debugPrint('Speech status: $status'),
);

await _flutterTts.setLanguage("en-US");
await _flutterTts.setSpeechRate(0.5);
await _flutterTts.setVolume(1.0);
await _flutterTts.setPitch(1.0);

_flutterTts.setCompletionHandler(() {
  setState(() {
    _isSpeaking = false;
    _statusText = "Tap mic to speak";
  });
});

if (!available) {
  _handleError("Speech recognition not available");
}
```

#### D. Speech recognition (lines 108-120):
```dart
// UNCOMMENT THIS:
await _speechToText.listen(
  onResult: (result) {
    setState(() {
      _userTranscript = result.recognizedWords;
    });
  },
  listenFor: const Duration(seconds: 30),
  pauseFor: const Duration(seconds: 3),
  partialResults: true,
  cancelOnError: true,
  listenMode: ListenMode.confirmation,
);

// REMOVE/COMMENT the simulation code below it
```

#### E. Stop listening (line 133):
```dart
// UNCOMMENT THIS:
await _speechToText.stop();
```

#### F. Text-to-speech (line 181):
```dart
// UNCOMMENT THIS:
await _flutterTts.speak(text);

// REMOVE/COMMENT the simulation code below it
```

#### G. Cleanup (lines 197-199):
```dart
// UNCOMMENT THESE:
_speechToText.stop();
_flutterTts.stop();
```

---

## 💾 Step 3: Activate Data Caching

### File: `lib/services/api_service.dart`

#### A. Add import at top:
```dart
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
```

#### B. Uncomment caching code (lines 52-58):
```dart
// UNCOMMENT THIS:
final prefs = await SharedPreferences.getInstance();
await prefs.setString('financial_data_$userId', jsonEncode(data.toJson()));
await prefs.setInt('financial_data_timestamp_$userId', DateTime.now().millisecondsSinceEpoch);
```

#### C. Uncomment cache loading (lines 64-75):
```dart
// UNCOMMENT THIS:
final prefs = await SharedPreferences.getInstance();
final jsonString = prefs.getString('financial_data_$userId');
final timestamp = prefs.getInt('financial_data_timestamp_$userId');

if (jsonString != null && timestamp != null) {
  // Check if cache is less than 24 hours old
  final cacheAge = DateTime.now().millisecondsSinceEpoch - timestamp;
  if (cacheAge < 86400000) { // 24 hours in milliseconds
    return FinancialData.fromJson(jsonDecode(jsonString));
  }
}
```

---

## 🔐 Step 4: Request Permissions (Android)

### File: `android/app/src/main/AndroidManifest.xml`

Add these permissions:

```xml
<manifest ...>
    <!-- Existing permissions -->
    
    <!-- Voice Assistant Permissions -->
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.BLUETOOTH"/>
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
    
    <application ...>
        ...
    </application>
</manifest>
```

---

## 🍎 Step 5: Request Permissions (iOS)

### File: `ios/Runner/Info.plist`

Add these keys:

```xml
<dict>
    <!-- Existing keys -->
    
    <!-- Voice Assistant Permissions -->
    <key>NSMicrophoneUsageDescription</key>
    <string>We need access to your microphone to enable voice commands for financial insights.</string>
    
    <key>NSSpeechRecognitionUsageDescription</key>
    <string>We use speech recognition to understand your voice commands.</string>
</dict>
```

---

## ✅ Step 6: Test Everything

### Test Voice Assistant:
```bash
flutter run
```

1. Navigate to AI Coach
2. Tap the voice button
3. Grant microphone permission when prompted
4. Speak: "How is my cash flow?"
5. Verify AI responds with voice

### Test Caching:
1. Load financial data while online
2. Turn off internet/WiFi
3. Close and reopen app
4. Verify data still loads (from cache)
5. Check console for "Using cached data" message

---

## 🐛 Troubleshooting

### Voice Not Working?
1. Check microphone permissions in device settings
2. Verify packages installed: `flutter pub get`
3. Check console for error messages
4. Test on real device (not emulator)

### Caching Not Working?
1. Verify shared_preferences package installed
2. Check console for cache write/read messages
3. Clear app data and try again
4. Verify JSON serialization works

### Build Errors?
1. Run `flutter clean`
2. Run `flutter pub get`
3. Rebuild: `flutter run`

---

## 📊 Production Readiness Checklist

After activation:

- [x] AI Insights - Real data ✅
- [x] Voice Assistant - Real speech ✅
- [x] Data Caching - Offline support ✅
- [ ] Dashboard Trends - Calculate from history
- [ ] ROI Impressions - Real calculation
- [ ] Series A Score - Real algorithm
- [ ] Notifications - Event-driven
- [ ] 2FA - Firebase MFA
- [ ] Integrations - OAuth flows

**Current Score:** 70/100
**After Activation:** 85/100

---

## 🎯 Next Priority Fixes

1. **Dashboard Trends** - Calculate real percentage changes
2. **Notifications** - Generate from actual events
3. **Series A Readiness** - Implement scoring algorithm

See `PRODUCTION_FIXES_SUMMARY.md` for detailed implementation guides.

---

## 💡 Quick Commands

```bash
# Install packages
cd mobile_app && flutter pub get

# Clean build
flutter clean && flutter pub get

# Run on device
flutter run

# Build release APK
flutter build apk --release

# Build iOS
flutter build ios --release
```

---

**Last Updated:** January 11, 2026
**Status:** Ready for package activation
**Estimated Time:** 15-30 minutes
