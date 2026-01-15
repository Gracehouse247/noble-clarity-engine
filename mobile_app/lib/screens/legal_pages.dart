import 'package:flutter/material.dart';
import 'static_content_screen.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const StaticContentScreen(
      title: 'PRIVACY POLICY',
      sections: [
        StaticSection(
          content:
              'Noble Clarity Engine is an AI-powered financial intelligence dashboard designed to empower SMEs with real-time business health insights.',
        ),
        StaticSection(
          title: '1. Data Collection',
          content:
              'We collect Personal Identifiable Information (PII) and Business Financial Data to provide our services.',
          bullets: [
            'Identity Data: Name, Role, Avatar.',
            'Contact Data: Email address.',
            'Financial Data: Revenue, COGS, Assets, Liabilities.',
          ],
        ),
        StaticSection(
          title: '2. AI Transparency',
          content:
              'We utilize Google Gemini 3.0 Flash. Your sensitive data is governed by "Zero-Retention" policies and is never used to train base models.',
        ),
        StaticSection(
          title: '3. Data Security',
          content:
              'We implement AES-256 encryption at rest and TLS 1.2+ in transit. All API requests are proxied through our secure servers.',
        ),
      ],
    );
  }
}

class TermsOfServiceScreen extends StatelessWidget {
  const TermsOfServiceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const StaticContentScreen(
      title: 'TERMS OF SERVICE',
      sections: [
        StaticSection(
          title: '1. Service Overview',
          content:
              'Noble Clarity Engine provides financial analysis and AI-driven coaching for business owners.',
        ),
        StaticSection(
          title: '2. User Responsibility',
          content:
              'Users are responsible for the accuracy of manually entered data and the security of their login credentials.',
        ),
        StaticSection(
          title: '3. Subscription & Billing',
          content:
              'Subscriptions are billed in advance. Refunds are handled according to our standard refund policy.',
        ),
      ],
    );
  }
}

class SecurityScreen extends StatelessWidget {
  const SecurityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const StaticContentScreen(
      title: 'SECURITY',
      sections: [
        StaticSection(
          title: 'Enterprise-Grade Protection',
          content:
              'We prioritize your financial data sovereignty above all else.',
          bullets: [
            'SOC 2 Type II Compliant Infrastructure',
            'Full Data Encryption (AES-256)',
            'Multi-Factor Authentication (MFA)',
            'Secure API Proxying',
          ],
        ),
      ],
    );
  }
}

class OurStoryScreen extends StatelessWidget {
  const OurStoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const StaticContentScreen(
      title: 'OUR STORY',
      sections: [
        StaticSection(
          title: 'The Mission',
          content:
              'At Noble Clarity Engine, we bridge the gap between complex predictive business modeling and actionable growth.',
        ),
        StaticSection(
          title: 'The Pillars',
          content: 'Our work is built on three unshakeable pillars:',
          bullets: [
            'Truth: Unwavering data accuracy.',
            'Strategy: Predictive modeling for decisions.',
            'Freedom: Automation that liberates your schedule.',
          ],
        ),
      ],
    );
  }
}

class DataDeletionScreen extends StatelessWidget {
  const DataDeletionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const StaticContentScreen(
      title: 'DATA DELETION',
      sections: [
        StaticSection(
          title: 'Account Deletion Request',
          content:
              'We respect your right to privacy and data sovereignty. You can request the permanent deletion of your account and all associated financial data at any time.',
        ),
        StaticSection(
          title: 'What happens to my data?',
          content:
              'Upon completion of your request, the following will be permanently removed from our systems:',
          bullets: [
            'All personal profile information',
            'All synced business financial records',
            'AI-generated insights and history',
            'Saved API keys and credentials',
          ],
        ),
        StaticSection(
          title: 'How to initiate deletion',
          content:
              'To request deletion, you can use the "Delete Account" button in your Settings within the app. Alternatively, you can send an email request to our data protection team.',
          bullets: [
            'Email: support@noblesworld.com.ng',
            'Subject: Account Deletion Request',
            'Processing Time: Within 48 hours',
          ],
        ),
      ],
    );
  }
}
