class ApiConfig {
  // Environment Configuration
  static const bool _isProduction = true; // Set to false for local development

  // Base URLs
  static const String _productionUrl = 'https://clarity.noblesworld.com.ng/api';
  static const String _developmentUrl = 'http://10.0.2.2:3001/api';

  // Active Base URL
  static String get baseUrl => _isProduction ? _productionUrl : _developmentUrl;

  // Mobile-Optimized Timeouts (longer than web for slower networks)
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 45);
  static const Duration sendTimeout = Duration(seconds: 30);

  // API Endpoints (without /api prefix - already in baseUrl)
  static const String dashboardData = '/revenue-intelligence';
  static const String aiInsights = '/gemini';
  static const String aiGoals = '/ai/goals';
  static const String aiTTS = '/tts';
  static const String goals = '/goals';
  static const String profile = '/profile';
  static const String registerDevice = '/register-device';
  static const String systemStatus = '/system-status';

  // Cache Configuration
  static const Duration cacheValidDuration = Duration(hours: 24);
  static const Duration offlineRetryInterval = Duration(seconds: 30);

  // Feature Flags
  static const bool enableOfflineMode = true;
  static const bool enableRequestCompression = true;
  static const bool enableResponseCaching = true;
}
