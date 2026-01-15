import 'package:flutter/material.dart';
import '../core/app_theme.dart';

class KpiCard extends StatefulWidget {
  final String title;
  final String value;
  final String trend;
  final bool isPositive;
  final Color glowColor;

  const KpiCard({
    super.key,
    required this.title,
    required this.value,
    required this.trend,
    required this.isPositive,
    this.glowColor = AppTheme.primaryBlue,
  });

  @override
  State<KpiCard> createState() => _KpiCardState();
}

class _KpiCardState extends State<KpiCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0.0, end: 1.0),
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeOutBack,
        builder: (context, value, child) {
          return Transform.scale(
            scale: value,
            child: Opacity(opacity: value.clamp(0.0, 1.0), child: child),
          );
        },
        child: AnimatedScale(
          scale: _isPressed ? 0.96 : 1.0,
          duration: const Duration(milliseconds: 100),
          child: Container(
            width: 260,
            height: 170, // Fixed height to prevent unbounded Spacer() crash
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF13151F).withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(
                24,
              ), // Smoother corners for premium look
              border: Border.all(
                color: _isPressed
                    ? widget.glowColor.withValues(alpha: 0.3)
                    : Colors.white.withValues(alpha: 0.08),
                width: _isPressed ? 2 : 1,
              ),
              boxShadow: _isPressed
                  ? [
                      BoxShadow(
                        color: widget.glowColor.withValues(alpha: 0.1),
                        blurRadius: 20,
                        spreadRadius: 2,
                      ),
                    ]
                  : [],
            ),
            child: Stack(
              children: [
                // Background Glow
                Positioned(
                  right: -20,
                  bottom: -20,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: _isPressed ? 100 : 80,
                    height: _isPressed ? 100 : 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: widget.glowColor.withValues(alpha: 0.1),
                      boxShadow: [
                        BoxShadow(
                          color: widget.glowColor.withValues(alpha: 0.1),
                          blurRadius: 40,
                          spreadRadius: 10,
                        ),
                      ],
                    ),
                  ),
                ),

                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          widget.title,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color:
                                (widget.isPositive
                                        ? AppTheme.profitGreen
                                        : AppTheme.lossRed)
                                    .withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                widget.isPositive
                                    ? Icons.trending_up
                                    : Icons.trending_down,
                                size: 14,
                                color: widget.isPositive
                                    ? AppTheme.profitGreen
                                    : AppTheme.lossRed,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                widget.trend,
                                style: TextStyle(
                                  color: widget.isPositive
                                      ? AppTheme.profitGreen
                                      : AppTheme.lossRed,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.value,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    // Mini Sparkline Placeholder
                    CustomPaint(
                      size: const Size(double.infinity, 30),
                      painter: _SparklinePainter(
                        color: widget.isPositive
                            ? AppTheme.profitGreen
                            : AppTheme.lossRed,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SparklinePainter extends CustomPainter {
  final Color color;

  _SparklinePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    path.moveTo(0, size.height * 0.8);
    path.cubicTo(
      size.width * 0.2,
      size.height * 0.7,
      size.width * 0.4,
      size.height * 0.9,
      size.width * 0.6,
      size.height * 0.4,
    );
    path.cubicTo(
      size.width * 0.8,
      size.height * 0.5,
      size.width * 0.9,
      size.height * 0.2,
      size.width,
      size.height * 0.3,
    );

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
