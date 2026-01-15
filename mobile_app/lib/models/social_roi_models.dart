import 'package:flutter/foundation.dart';

@immutable
class SocialPlatformData {
  final String id;
  final String name;
  final double adSpend;
  final double contentCost;
  final double influencerCost;
  final int websiteClicks;
  final double websiteConversionRate;
  final double aov; // Average Order Value
  final int leadsGenerated;
  final double leadToCustomerRate;
  final double ltv; // Lifetime Value

  const SocialPlatformData({
    required this.id,
    required this.name,
    this.adSpend = 0.0,
    this.contentCost = 0.0,
    this.influencerCost = 0.0,
    this.websiteClicks = 0,
    this.websiteConversionRate = 0.0,
    this.aov = 0.0,
    this.leadsGenerated = 0,
    this.leadToCustomerRate = 0.0,
    this.ltv = 0.0,
  });

  SocialPlatformData copyWith({
    String? name,
    double? adSpend,
    double? contentCost,
    double? influencerCost,
    int? websiteClicks,
    double? websiteConversionRate,
    double? aov,
    int? leadsGenerated,
    double? leadToCustomerRate,
    double? ltv,
  }) {
    return SocialPlatformData(
      id: id,
      name: name ?? this.name,
      adSpend: adSpend ?? this.adSpend,
      contentCost: contentCost ?? this.contentCost,
      influencerCost: influencerCost ?? this.influencerCost,
      websiteClicks: websiteClicks ?? this.websiteClicks,
      websiteConversionRate:
          websiteConversionRate ?? this.websiteConversionRate,
      aov: aov ?? this.aov,
      leadsGenerated: leadsGenerated ?? this.leadsGenerated,
      leadToCustomerRate: leadToCustomerRate ?? this.leadToCustomerRate,
      ltv: ltv ?? this.ltv,
    );
  }

  // Getters for specific platform calculations
  double get totalCost => adSpend + contentCost + influencerCost;
  double get valueFromWebsite =>
      websiteClicks * (websiteConversionRate / 100) * aov;
  double get valueFromLeads =>
      leadsGenerated * (leadToCustomerRate / 100) * ltv;
  double get totalValue => valueFromWebsite + valueFromLeads;
  double get netProfit => totalValue - totalCost;
  double get roi => totalCost > 0 ? (netProfit / totalCost) * 100 : 0.0;
}

@immutable
class SocialOverheads {
  final double teamHours;
  final double hourlyRate;
  final double toolCosts;

  const SocialOverheads({
    this.teamHours = 0.0,
    this.hourlyRate = 0.0,
    this.toolCosts = 0.0,
  });

  SocialOverheads copyWith({
    double? teamHours,
    double? hourlyRate,
    double? toolCosts,
  }) {
    return SocialOverheads(
      teamHours: teamHours ?? this.teamHours,
      hourlyRate: hourlyRate ?? this.hourlyRate,
      toolCosts: toolCosts ?? this.toolCosts,
    );
  }

  double get laborCost => teamHours * hourlyRate;
  double get total => laborCost + toolCosts;
}

@immutable
class BrandEquity {
  final int newFollowers;
  final double valuePerFollower;
  final int totalEngagements;
  final double valuePerEngagement;

  const BrandEquity({
    this.newFollowers = 0,
    this.valuePerFollower = 0.0,
    this.totalEngagements = 0,
    this.valuePerEngagement = 0.0,
  });

  BrandEquity copyWith({
    int? newFollowers,
    double? valuePerFollower,
    int? totalEngagements,
    double? valuePerEngagement,
  }) {
    return BrandEquity(
      newFollowers: newFollowers ?? this.newFollowers,
      valuePerFollower: valuePerFollower ?? this.valuePerFollower,
      totalEngagements: totalEngagements ?? this.totalEngagements,
      valuePerEngagement: valuePerEngagement ?? this.valuePerEngagement,
    );
  }

  double get totalValue =>
      (newFollowers * valuePerFollower) +
      (totalEngagements * valuePerEngagement);
}
