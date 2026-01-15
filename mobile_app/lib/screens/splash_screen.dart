import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';
import '../core/app_theme.dart';
import '../providers/auth_provider.dart';
import '../core/app_router.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with TickerProviderStateMixin {
  double _loadingProgress = 0.0;
  late AnimationController _fadeController;
  late AnimationController _floatController;
  late AnimationController _pulseController;
  late AnimationController _shimmerController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _scaleAnimation = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(
        parent: _fadeController,
        curve: const Interval(0.0, 0.8, curve: Curves.easeOutBack),
      ),
    );
    _floatController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat(reverse: true);
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();

    _startLoading();
    _fadeController.forward();
  }

  void _startLoading() {
    Timer.periodic(const Duration(milliseconds: 30), (timer) {
      if (mounted) {
        setState(() {
          _loadingProgress += 0.035;
          if (_loadingProgress >= 1.0) {
            _loadingProgress = 1.0;
            timer.cancel();
            _navigateToNext();
          }
        });
      }
    });
  }

  void _navigateToNext() {
    Future.delayed(const Duration(milliseconds: 200), () {
      if (mounted) {
        final authState = ref.read(authProvider);
        if (authState.isAuthenticated) {
          ref.read(navigationProvider.notifier).state = AppRoute.dashboard;
        } else {
          ref.read(navigationProvider.notifier).state = AppRoute.onboarding;
        }
      }
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _floatController.dispose();
    _pulseController.dispose();
    _shimmerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF050505),
      body: Stack(
        children: [
          // Ambient Background Glows
          Positioned(
            top: MediaQuery.of(context).size.height * 0.2,
            left: MediaQuery.of(context).size.width * 0.5 - 250,
            child: AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                return Opacity(
                  opacity: 0.3 + (0.2 * _pulseController.value),
                  child: Container(
                    width: 500,
                    height: 500,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppTheme.primaryBlue.withValues(alpha: 0.12),
                    ),
                  ),
                );
              },
            ),
          ),

          SafeArea(
            child: Column(
              children: [
                const Spacer(flex: 3),

                // Floating Diamond Logo Container
                FadeTransition(
                  opacity: _fadeController,
                  child: AnimatedBuilder(
                    animation: _floatController,
                    builder: (context, child) {
                      return Transform.translate(
                        offset: Offset(0, 12 * _floatController.value),
                        child: Center(
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              // Secondary Strong Glow
                              Container(
                                width: 260,
                                height: 260,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: AppTheme.primaryBlue.withValues(
                                    alpha: 0.08,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppTheme.accentBlue.withValues(
                                        alpha: 0.2,
                                      ),
                                      blurRadius: 100,
                                      spreadRadius: 10,
                                    ),
                                  ],
                                ),
                              ),

                              // Main Frosted Container with Scale Animation
                              ScaleTransition(
                                scale: _scaleAnimation,
                                child: Container(
                                  width: 180,
                                  height: 180,
                                  padding: const EdgeInsets.all(42),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.04),
                                    borderRadius: BorderRadius.circular(48),
                                    border: Border.all(
                                      color: Colors.white.withValues(
                                        alpha: 0.15,
                                      ),
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(
                                          alpha: 0.4,
                                        ),
                                        blurRadius: 40,
                                        offset: const Offset(0, 20),
                                      ),
                                    ],
                                  ),
                                  child: Image.asset(
                                    'assets/images/logo_icon.png',
                                    fit: BoxFit.contain,
                                    filterQuality: FilterQuality.high,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),

                const SizedBox(height: 54),

                // Branded Identity
                FadeTransition(
                  opacity: _fadeController,
                  child: Column(
                    children: [
                      const Text(
                        'Noble Clarity Engine',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w200, // Light for Noble
                          color: Colors.white,
                          letterSpacing: -1,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          border: Border.symmetric(
                            horizontal: BorderSide(
                              color: Colors.white.withValues(alpha: 0.08),
                            ),
                          ),
                        ),
                        child: const Text(
                          'FINANCIAL INTELLIGENCE PLATFORM',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.accentBlue,
                            letterSpacing: 4,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(flex: 3),

                // Tactical Loader
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 48),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Row(
                            children: [
                              Icon(
                                Icons.data_usage_rounded,
                                color: AppTheme.accentBlue,
                                size: 14,
                              ),
                              SizedBox(width: 8),
                              Text(
                                'Synthesizing Financials...',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            '${(_loadingProgress * 100).toInt()}%',
                            style: const TextStyle(
                              color: AppTheme.accentBlue,
                              fontSize: 10,
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Container(
                        height: 6,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.05),
                          borderRadius: BorderRadius.circular(3),
                        ),
                        child: Stack(
                          children: [
                            // Progress bar
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 40),
                              width:
                                  MediaQuery.of(context).size.width *
                                  0.7 *
                                  _loadingProgress,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    AppTheme.primaryBlue,
                                    AppTheme.accentBlue,
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(3),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppTheme.accentBlue.withValues(
                                      alpha: 0.3,
                                    ),
                                    blurRadius: 12,
                                  ),
                                ],
                              ),
                            ),

                            // Shimmer Effect Overlay
                            AnimatedBuilder(
                              animation: _shimmerController,
                              builder: (context, child) {
                                return Positioned(
                                  left:
                                      (MediaQuery.of(context).size.width *
                                              0.7 *
                                              _loadingProgress) *
                                          _shimmerController.value -
                                      40,
                                  child: Container(
                                    width: 40,
                                    height: 6,
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [
                                          Colors.white.withValues(alpha: 0),
                                          Colors.white.withValues(alpha: 0.4),
                                          Colors.white.withValues(alpha: 0),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                const Text(
                  'VERSION 2.0.1 â€¢ SECURE CONNECTION',
                  style: TextStyle(
                    fontSize: 9,
                    color: Colors.white24,
                    letterSpacing: 2,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 48),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
