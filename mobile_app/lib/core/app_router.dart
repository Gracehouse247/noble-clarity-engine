import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../screens/splash_screen.dart';
import '../screens/onboarding_screen.dart';
import '../screens/login_screen.dart';
import '../screens/signup_screen.dart';
import '../screens/data_connect_screen.dart';
import '../screens/ai_insights_feed.dart';
import '../screens/ai_coach_screen.dart';
import '../screens/main_shell.dart';

enum AppRoute {
  splash,
  onboarding,
  login,
  signup,
  dataConnect,
  dashboard,
  aiInsights,
  aiCoach,
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

class AppRouter {
  static Widget getScreen(AppRoute route) {
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
      case AppRoute.aiInsights:
        return const AiInsightsFeedScreen();
      case AppRoute.aiCoach:
        return const AiCoachChatScreen();
      default:
        return MainScreenShell(route: route);
    }
  }

  static AppRoute? getBackRoute(AppRoute currentRoute) {
    switch (currentRoute) {
      case AppRoute.emailRoi:
      case AppRoute.socialRoi:
        return AppRoute.roi;
      case AppRoute.notifications:
      case AppRoute.settings:
      case AppRoute.businessProfile:
      case AppRoute.history:
      case AppRoute.dataEntry:
      case AppRoute.integrations:
      case AppRoute.story:
      case AppRoute.security:
      case AppRoute.terms:
      case AppRoute.privacy:
        return AppRoute.dashboard;
      default:
        return null; // Implies no specific back navigation/open drawer
    }
  }
}
