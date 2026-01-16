import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:intl/intl.dart';
import '../models/social_roi_models.dart';

class PdfService {
  static Future<void> generateSocialRoiReport({
    required SocialRoiState state,
    required NumberFormat format,
  }) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context context) {
          return [
            _buildHeader(state),
            pw.SizedBox(height: 24),
            _buildSummarySection(state, format),
            pw.SizedBox(height: 24),
            _buildOverheadsSection(state, format),
            pw.SizedBox(height: 24),
            _buildBrandEquitySection(state, format),
            pw.SizedBox(height: 24),
            _buildPlatformsSection(state, format),
            pw.SizedBox(height: 32),
            _buildFooter(),
          ];
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdf.save(),
      name: 'Social_ROI_Report_${DateTime.now().millisecondsSinceEpoch}.pdf',
    );
  }

  static pw.Widget _buildHeader(SocialRoiState state) {
    return pw.Row(
      mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
      children: [
        pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Text(
              'Social Media ROI Intelligence',
              style: pw.TextStyle(
                fontSize: 24,
                fontWeight: pw.FontWeight.bold,
                color: PdfColors.blue900,
              ),
            ),
            pw.Text(
              'Noble Clarity Engine | Strategic Report',
              style: const pw.TextStyle(fontSize: 12, color: PdfColors.grey700),
            ),
          ],
        ),
        pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.end,
          children: [
            pw.Text(
              'Report Date: ${DateFormat('MMM dd, yyyy').format(DateTime.now())}',
              style: const pw.TextStyle(fontSize: 10),
            ),
            pw.Text(
              'Timeframe: ${state.timeframe}',
              style: const pw.TextStyle(fontSize: 10),
            ),
          ],
        ),
      ],
    );
  }

  static pw.Widget _buildSummarySection(
    SocialRoiState state,
    NumberFormat format,
  ) {
    return pw.Container(
      padding: const pw.EdgeInsets.all(16),
      decoration: pw.BoxDecoration(
        color: PdfColors.blue50,
        borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
      ),
      child: pw.Column(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Text(
            'EXECUTIVE SUMMARY',
            style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 12),
          ),
          pw.Divider(color: PdfColors.blue200),
          pw.SizedBox(height: 8),
          pw.Row(
            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
            children: [
              _buildKpiItem(
                'Total Investment',
                format.format(state.totalInvestment),
              ),
              _buildKpiItem(
                'Total Value Generated',
                format.format(state.totalValueGenerated),
              ),
              _buildKpiItem(
                'Net Profit',
                format.format(state.netProfit),
                isPositive: state.netProfit >= 0,
              ),
              _buildKpiItem(
                'Social ROI',
                '${state.socialRoi.toStringAsFixed(1)}%',
                isPositive: state.socialRoi >= 0,
              ),
            ],
          ),
        ],
      ),
    );
  }

  static pw.Widget _buildKpiItem(
    String label,
    String value, {
    bool? isPositive,
  }) {
    PdfColor valueColor = PdfColors.black;
    if (isPositive != null) {
      valueColor = isPositive ? PdfColors.green700 : PdfColors.red700;
    }

    return pw.Column(
      children: [
        pw.Text(
          label,
          style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700),
        ),
        pw.SizedBox(height: 4),
        pw.Text(
          value,
          style: pw.TextStyle(
            fontSize: 14,
            fontWeight: pw.FontWeight.bold,
            color: valueColor,
          ),
        ),
      ],
    );
  }

  static pw.Widget _buildOverheadsSection(
    SocialRoiState state,
    NumberFormat format,
  ) {
    return _buildSectionWithTable('OVERHEAD COSTS', [
      ['Description', 'Metric', 'Cost'],
      [
        'Labor (Team Hours x Rate)',
        '${state.overheads.teamHours}h @ ${format.format(state.overheads.hourlyRate)}/h',
        format.format(state.overheads.laborCost),
      ],
      ['Software & Tool Costs', '-', format.format(state.overheads.toolCosts)],
      ['Total Overheads', '', format.format(state.overheads.total)],
    ]);
  }

  static pw.Widget _buildBrandEquitySection(
    SocialRoiState state,
    NumberFormat format,
  ) {
    return _buildSectionWithTable('BRAND EQUITY VALUE', [
      ['Description', 'Quantity', 'Value'],
      [
        'New Followers',
        state.brandEquity.newFollowers.toString(),
        format.format(
          state.brandEquity.newFollowers * state.brandEquity.valuePerFollower,
        ),
      ],
      [
        'Total Engagements',
        state.brandEquity.totalEngagements.toString(),
        format.format(
          state.brandEquity.totalEngagements *
              state.brandEquity.valuePerEngagement,
        ),
      ],
      ['Total Brand Equity', '', format.format(state.brandEquity.totalValue)],
    ]);
  }

  static pw.Widget _buildPlatformsSection(
    SocialRoiState state,
    NumberFormat format,
  ) {
    final platformRows = state.platforms.map((p) {
      return [
        p.name,
        format.format(p.totalCost),
        format.format(p.totalValue),
        format.format(p.netProfit),
        '${p.roi.toStringAsFixed(1)}%',
      ];
    }).toList();

    return _buildSectionWithTable('PLATFORM PERFORMANCE', [
      ['Platform', 'Total Spend', 'Total Value', 'Net Profit', 'ROI'],
      ...platformRows,
    ]);
  }

  static pw.Widget _buildSectionWithTable(
    String title,
    List<List<String>> data,
  ) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Text(
          title,
          style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 12),
        ),
        pw.SizedBox(height: 8),
        pw.TableHelper.fromTextArray(
          headers: data[0],
          data: data.sublist(1),
          border: pw.TableBorder.all(color: PdfColors.grey300),
          headerStyle: pw.TextStyle(
            fontWeight: pw.FontWeight.bold,
            color: PdfColors.white,
          ),
          headerDecoration: const pw.BoxDecoration(color: PdfColors.blue800),
          cellHeight: 25,
          cellAlignments: {
            0: pw.Alignment.centerLeft,
            1: pw.Alignment.centerRight,
            2: pw.Alignment.centerRight,
            3: pw.Alignment.centerRight,
            4: pw.Alignment.centerRight,
          },
        ),
      ],
    );
  }

  static pw.Widget _buildFooter() {
    return pw.Container(
      alignment: pw.Alignment.center,
      padding: const pw.EdgeInsets.only(top: 16),
      decoration: const pw.BoxDecoration(
        border: pw.Border(top: pw.BorderSide(color: PdfColors.grey300)),
      ),
      child: pw.Text(
        '© 2026 Noble World Technology Services | Generated by Noble Clarity Engine',
        style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600),
      ),
    );
  }
}
