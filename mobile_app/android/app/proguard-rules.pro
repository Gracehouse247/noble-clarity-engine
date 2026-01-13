# Flutter Wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Prevent shrinking of these classes
-keep class com.noblesworld.noble_clarity_mobile.** { *; }

# Speech to Text
-keep class com.csdcorp.speech_to_text.** { *; }
-dontwarn com.csdcorp.speech_to_text.**

# General
-dontwarn javax.annotation.**
-dontwarn com.google.errorprone.annotations.**
-dontwarn org.checkerframework.**
-dontwarn sun.misc.Unsafe
-dontwarn java.lang.invoke.**
-dontwarn javax.lang.model.element.**
-dontwarn java.util.**

# OKIO & OKHTTP
-dontwarn okio.**
-dontwarn okhttp3.**

# Gson/Serialization
-keepattributes Signature
-keepattributes *Annotation*
-keep class sun.misc.Unsafe { *; }

# Google/GMS
-dontwarn com.google.android.gms.internal.**
-keep class com.google.android.gms.internal.** { *; }

# ignore all warnings and continue
-ignorewarnings
