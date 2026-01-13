import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'core/app_theme.dart';
import 'screens/splash_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/data_connect_screen.dart';
import 'screens/ai_insights_feed.dart';
import 'screens/ai_coach_screen.dart';
import 'screens/main_shell.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  // Force enable Crashlytics
  await FirebaseCrashlytics.instance.setCrashlyticsCollectionEnabled(true);

  // Pass all uncaught "fatal" errors from the framework to Crashlytics
  FlutterError.onError = (errorDetails) {
    FirebaseCrashlytics.instance.recordFlutterFatalError(errorDetails);
  };

  // Pass all uncaught asynchronous errors that aren't handled by the Flutter framework to Crashlytics
  PlatformDispatcher.instance.onError = (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    return true;
  };

  // Initialize Analytics
  await FirebaseAnalytics.instance.logAppOpen();

  runApp(const ProviderScope(child: NobleClarityApp()));
}

// Global Navigation State
enum AppRoute {
  splash,
  onboarding,
  login,
  signup,
  dataConnect,
  dashboard,
  aiInsights,
  aiCoach, // New entry
  roi,
  emailRoi,
  socialRoi,
  planner,
  goals,
  cashFlow,
  consolidation,
  dataEntry,
  integrations,
  businessProfile,
  history,
  settings,
  notifications,
  story,
  security,
  terms,
  privacy,
}

final navigationProvider = StateProvider<AppRoute>((ref) => AppRoute.splash);

class NobleClarityApp extends ConsumerWidget {
  const NobleClarityApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentRoute = ref.watch(navigationProvider);

    return MaterialApp(
      title: 'Noble Clarity',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: _getScreen(currentRoute),
    );
  }

  Widget _getScreen(AppRoute route) {
    switch (route) {
      case AppRoute.splash:
        return const SplashScreen();
      case AppRoute.onboarding:
        return const OnboardingScreen();
      case AppRoute.login:
        return const LoginScreen();
      case AppRoute.signup:
        return const SignupScreen();
      case AppRoute.dataConnect:
        return const DataConnectScreen();
      case AppRoute.aiInsights: // New route
        return const AiInsightsFeedScreen();
      case AppRoute.aiCoach: // New route
        return const AiCoachChatScreen();
      default:
        return MainScreenShell(route: route);
    }
  }
}
