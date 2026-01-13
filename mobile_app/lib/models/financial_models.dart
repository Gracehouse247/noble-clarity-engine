import 'package:flutter/foundation.dart';

@immutable
class FinancialData {
  final double revenue;
  final double cogs;
  final double operatingExpenses;
  final double currentAssets;
  final double currentLiabilities;
  final int leadsGenerated;
  final int conversions;
  final double marketingSpend;
  final String industry;
  final String date;
  final double mrr; // Monthly Recurring Revenue
  final double arr; // Annual Recurring Revenue
  final BenchmarkData? benchmark; // Comparison Data

  const FinancialData({
    required this.revenue,
    required this.cogs,
    required this.operatingExpenses,
    required this.currentAssets,
    required this.currentLiabilities,
    required this.leadsGenerated,
    required this.conversions,
    required this.marketingSpend,
    required this.industry,
    this.date = '',
    this.mrr = 0.0,
    this.arr = 0.0,
    this.benchmark,
  });

  factory FinancialData.fromJson(Map<String, dynamic> json) {
    return FinancialData(
      revenue: (json['revenue'] ?? 0.0).toDouble(),
      cogs: (json['cogs'] ?? 0.0).toDouble(),
      operatingExpenses: (json['operatingExpenses'] ?? 0.0).toDouble(),
      currentAssets: (json['currentAssets'] ?? 0.0).toDouble(),
      currentLiabilities: (json['currentLiabilities'] ?? 0.0).toDouble(),
      leadsGenerated: (json['leadsGenerated'] ?? 0).toInt(),
      conversions: (json['conversions'] ?? 0).toInt(),
      marketingSpend: (json['marketingSpend'] ?? 0.0).toDouble(),
      industry: json['industry'] ?? 'Technology',
      date: json['date'] ?? '',
      mrr: (json['mrr'] ?? 0.0).toDouble(),
      arr: (json['arr'] ?? 0.0).toDouble(),
      benchmark: json['benchmark'] != null
          ? BenchmarkData.fromJson(json['benchmark'])
          : null,
    );
  }

  // Specialized factory to map real business data from server
  factory FinancialData.fromRawData(Map<String, dynamic> response) {
    final dynamic rawData = response['data'];

    // Estimate metrics if not explicitly provided
    double revenue = 0;
    if (rawData is List) {
      // If it's a list of transactions (Paystack Raw)
      for (var tx in rawData) {
        revenue += (tx['amount'] ?? 0) / 100; // Paystack is in kobo
      }
    } else if (response['paystack'] != null) {
      // If server returns aggregated data
      revenue = (response['paystack']['total'] ?? 0.0).toDouble();
      revenue += (response['flutterwave']?['total'] ?? 0.0).toDouble();
    }

    return FinancialData(
      revenue: revenue,
      mrr: revenue / 6, // Rough average for demo if period is 6m
      arr: (revenue / 6) * 12,
      cogs: revenue * 0.15, // Estimate
      operatingExpenses: revenue * 0.4, // Estimate
      currentAssets: revenue * 0.8, // Estimate
      currentLiabilities: revenue * 0.2, // Estimate
      leadsGenerated: (revenue / 100).toInt(),
      conversions: (revenue / 500).toInt(),
      marketingSpend: revenue * 0.1,
      industry: 'SaaS',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'revenue': revenue,
      'cogs': cogs,
      'operatingExpenses': operatingExpenses,
      'currentAssets': currentAssets,
      'currentLiabilities': currentLiabilities,
      'leadsGenerated': leadsGenerated,
      'conversions': conversions,
      'marketingSpend': marketingSpend,
      'industry': industry,
      'date': date,
      'mrr': mrr,
      'arr': arr,
      'benchmark': benchmark?.toJson(),
    };
  }

  FinancialData copyWith({
    double? revenue,
    double? cogs,
    double? operatingExpenses,
    double? currentAssets,
    double? currentLiabilities,
    int? leadsGenerated,
    int? conversions,
    double? marketingSpend,
    String? industry,
    String? date,
    double? mrr,
    double? arr,
    BenchmarkData? benchmark,
  }) {
    return FinancialData(
      revenue: revenue ?? this.revenue,
      cogs: cogs ?? this.cogs,
      operatingExpenses: operatingExpenses ?? this.operatingExpenses,
      currentAssets: currentAssets ?? this.currentAssets,
      currentLiabilities: currentLiabilities ?? this.currentLiabilities,
      leadsGenerated: leadsGenerated ?? this.leadsGenerated,
      conversions: conversions ?? this.conversions,
      marketingSpend: marketingSpend ?? this.marketingSpend,
      industry: industry ?? this.industry,
      date: date ?? this.date,
      mrr: mrr ?? this.mrr,
      arr: arr ?? this.arr,
      benchmark: benchmark ?? this.benchmark,
    );
  }

  // Computed Getters for Calculated Metrics
  double get grossProfit => revenue - cogs;
  double get netProfit => revenue - cogs - operatingExpenses;
  double get netMargin =>
      revenue > 0 ? (netProfit / revenue) * 100 : 0; // Margin Percentage
  double get grossMargin => revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  double get conversionRate =>
      leadsGenerated > 0 ? (conversions / leadsGenerated) * 100 : 0;
  double get cac => conversions > 0
      ? marketingSpend / conversions
      : 0; // Customer Acquisition Cost
  double get currentRatio =>
      currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
  double get burnRate => operatingExpenses; // Monthly burn rate
  double get runway =>
      burnRate > 0 ? currentAssets / burnRate : 0; // Months of runway
}

@immutable
class BusinessProfile {
  final String id;
  final String name;
  final String industry;
  final String stage;
  final String currency;

  const BusinessProfile({
    required this.id,
    required this.name,
    this.industry = 'Technology',
    this.stage = 'Seed',
    this.currency = 'USD',
  });

  factory BusinessProfile.fromJson(Map<String, dynamic> json) {
    return BusinessProfile(
      id: json['id'],
      name: json['name'],
      industry: json['industry'] ?? 'Technology',
      stage: json['stage'] ?? 'Seed',
      currency: json['currency'] ?? 'USD',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'industry': industry,
    'stage': stage,
    'currency': currency,
  };

  BusinessProfile copyWith({
    String? name,
    String? industry,
    String? stage,
    String? currency,
  }) {
    return BusinessProfile(
      id: id,
      name: name ?? this.name,
      industry: industry ?? this.industry,
      stage: stage ?? this.stage,
      currency: currency ?? this.currency,
    );
  }
}

@immutable
class FinancialGoal {
  final String id;
  final String name;
  final String metric;
  final double targetValue;
  final String deadline;
  final bool achieved;

  const FinancialGoal({
    required this.id,
    required this.name,
    required this.metric,
    required this.targetValue,
    required this.deadline,
    this.achieved = false,
  });

  factory FinancialGoal.fromJson(Map<String, dynamic> json) {
    return FinancialGoal(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      metric: json['metric'] ?? 'revenue',
      targetValue: (json['targetValue'] ?? 0.0).toDouble(),
      deadline: json['deadline'] ?? 'Ongoing',
      achieved: json['achieved'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'metric': metric,
      'targetValue': targetValue,
      'deadline': deadline,
      'achieved': achieved,
    };
  }

  FinancialGoal copyWith({
    String? id,
    String? name,
    String? metric,
    double? targetValue,
    String? deadline,
    bool? achieved,
  }) {
    return FinancialGoal(
      id: id ?? this.id,
      name: name ?? this.name,
      metric: metric ?? this.metric,
      targetValue: targetValue ?? this.targetValue,
      deadline: deadline ?? this.deadline,
      achieved: achieved ?? this.achieved,
    );
  }
}

@immutable
class ProfileData {
  final FinancialData current;
  final List<FinancialData> history;
  final List<FinancialGoal> goals;

  const ProfileData({
    required this.current,
    this.history = const [],
    this.goals = const [],
  });

  Map<String, dynamic> toJson() => {
    'current': current.toJson(),
    'history': history.map((h) => h.toJson()).toList(),
    'goals': goals.map((g) => g.toJson()).toList(),
  };

  factory ProfileData.fromJson(Map<String, dynamic> json) {
    return ProfileData(
      current: FinancialData.fromJson(json['current']),
      history: (json['history'] as List? ?? [])
          .map((h) => FinancialData.fromJson(h))
          .toList(),
      goals: (json['goals'] as List? ?? [])
          .map((g) => FinancialGoal.fromJson(g))
          .toList(),
    );
  }
}

@immutable
class ChatMessage {
  final String role;
  final String content;
  final DateTime timestamp;

  ChatMessage({required this.role, required this.content, DateTime? timestamp})
    : timestamp = timestamp ?? DateTime.now();

  Map<String, dynamic> toJson() => {'role': role, 'content': content};
}

@immutable
class BenchmarkData {
  final double avgRevenue;
  final double avgNetMargin;
  final double avgBurnRate;
  final String cohortName;
  final double top10Revenue;

  const BenchmarkData({
    required this.avgRevenue,
    required this.avgNetMargin,
    required this.avgBurnRate,
    this.cohortName = 'SaaS < \$10M ARR',
    this.top10Revenue = 0.0,
  });

  factory BenchmarkData.fromJson(Map<String, dynamic> json) {
    return BenchmarkData(
      avgRevenue: (json['avgRevenue'] ?? 0.0).toDouble(),
      avgNetMargin: (json['avgNetMargin'] ?? 0.0).toDouble(),
      avgBurnRate: (json['avgBurnRate'] ?? 0.0).toDouble(),
      cohortName: json['cohortName'] ?? 'SaaS < \$10M ARR',
      top10Revenue: (json['top10Revenue'] ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
    'avgRevenue': avgRevenue,
    'avgNetMargin': avgNetMargin,
    'avgBurnRate': avgBurnRate,
    'cohortName': cohortName,
    'top10Revenue': top10Revenue,
  };
}
