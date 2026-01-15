import 'dart:convert';
import 'dart:io';
import 'package:csv/csv.dart';
import '../models/financial_models.dart';

class CsvParsingService {
  /// Mapping of common accounting terms to internal fields
  static const Map<String, List<String>> fieldMapping = {
    'revenue': [
      'Total Revenue',
      'Gross Sales',
      'Sales',
      'Total Income',
      'Net Sales',
      'Revenue',
    ],
    'cogs': ['Cost of Goods Sold', 'COGS', 'Total COGS', 'Direct Costs'],
    'operatingExpenses': [
      'Total Operating Expenses',
      'OpEx',
      'Total Expenses',
      'Operating Costs',
    ],
    'currentAssets': ['Total Current Assets', 'Current Assets'],
    'currentLiabilities': ['Total Current Liabilities', 'Current Liabilities'],
    'marketingSpend': ['Marketing', 'Ads', 'Advertising', 'Marketing Spend'],
    'leadsGenerated': ['Leads', 'Total Leads', 'New Leads'],
    'conversions': ['Conversions', 'Sales count', 'New Customers', 'Successes'],
  };

  static const List<String> periodAliases = [
    'Period',
    'Date',
    'Month',
    'Reporting Period',
  ];

  Future<FinancialData?> parseFinancialCsv(String filePath) async {
    try {
      final input = File(filePath).openRead();
      final fields = await input
          .transform(utf8.decoder)
          .transform(const CsvToListConverter())
          .toList();

      if (fields.isEmpty || fields.length < 2) return null;

      final headers = fields[0]
          .map((e) => e.toString().toLowerCase().trim())
          .toList();
      final row = fields[1]; // Using the first data row logic from web service

      double revenue = 0;
      double cogs = 0;
      double opex = 0;
      double assets = 0;
      double liab = 0;
      double marketing = 0;
      int leads = 0;
      int conversions = 0;
      String period = '';

      for (var i = 0; i < headers.length; i++) {
        final header = headers[i];
        final value = row[i];

        // Check against mappings
        fieldMapping.forEach((field, aliases) {
          if (aliases.any((a) => a.toLowerCase().trim() == header)) {
            final parsedValue = _parseNumeric(value);
            if (field == 'revenue') revenue = parsedValue;
            if (field == 'cogs') cogs = parsedValue;
            if (field == 'operatingExpenses') opex = parsedValue;
            if (field == 'currentAssets') assets = parsedValue;
            if (field == 'currentLiabilities') liab = parsedValue;
            if (field == 'marketingSpend') marketing = parsedValue;
            if (field == 'leadsGenerated') leads = parsedValue.toInt();
            if (field == 'conversions') conversions = parsedValue.toInt();
          }
        });

        // Check for Period
        if (periodAliases.any((a) => a.toLowerCase().trim() == header)) {
          period = value.toString();
        }
      }

      return FinancialData(
        revenue: revenue,
        cogs: cogs,
        operatingExpenses: opex,
        currentAssets: assets,
        currentLiabilities: liab,
        leadsGenerated: leads,
        conversions: conversions,
        marketingSpend: marketing,
        industry: 'Imported',
        date: period,
        mrr: revenue / 12,
        arr: revenue,
      );
    } catch (e) {
      return null;
    }
  }

  double _parseNumeric(dynamic value) {
    if (value == null) return 0.0;
    if (value is num) return value.toDouble();

    // String parsing for cases with $ or ,
    final stringVal = value.toString().replaceAll(RegExp(r'[$,\s]'), '');
    return double.tryParse(stringVal) ?? 0.0;
  }
}
