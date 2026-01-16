/// Local knowledge base for instant AI Coach responses
/// Falls back to Gemini API only when answer not found
class AiKnowledgeBase {
  /// Platform Knowledge - What is Noble Clarity Engine?
  static const Map<String, String> platformKnowledge = {
    'what is noble clarity engine': '''
Noble Clarity Engine is your financial command center - think of it as having a CFO, CMO, and data analyst working 24/7 for your business.

**What I Do:**
• Analyze your revenue, expenses, and cash flow in real-time
• Optimize your marketing spend across all channels
• Predict your runway and financial health
• Provide strategic advice based on your actual numbers

**Key Features:**
📊 Real-time Financial Analytics
🎯 AI-Powered Scenario Planning
📈 Marketing ROI Analysis (Google Ads, Meta, LinkedIn, TikTok, Instagram)
💰 Cash Flow Management & Runway Tracking
🔗 Integrations (Stripe, PayPal, QuickBooks, Xero, Google Sheets)
📄 Automated Financial Reporting & PDF Exports
🎤 Voice-Activated AI Coaching (that's me!)

You can ask me anything from "How long is my runway?" to "Should I increase my Google Ads budget?" and I'll give you precise, actionable insights based on your data.
''',

    'what features do you have': '''
**Noble Clarity Engine Features:**

**Financial Intelligence:**
• Dashboard - Real-time financial overview
• Cash Flow Analysis - Track inflows/outflows
• Scenario Planner - Model "what if" scenarios
• Financial Goals - Set and track targets

**Marketing Analytics:**
• Marketing ROI Calculator - Multi-channel analysis
• Social Media ROI - Platform-specific insights
• Email Marketing ROI - Campaign performance
• CAC & LTV Tracking - Unit economics

**Data Management:**
• Data Entry - Manual input or integrations
• Integrations - Connect Stripe, QuickBooks, Google Sheets, etc.
• PDF Reports - Export professional financial reports
• Real-time Sync - Always up-to-date

**AI Tools:**
• AI Insights Feed - TikTok-style financial insights
• AI Coach (me!) - Strategic financial advisor
• Voice Commands - Hands-free interaction
• Predictive Analytics - Future projections

Want to know more about any specific feature?
''',

    'how do i connect stripe': '''
**Connecting Stripe to Noble Clarity Engine:**

1. Go to **Data Entry** screen
2. Tap on **Integrations** tab
3. Find **Stripe** in the list
4. Tap **Connect**
5. You'll see a secure connection dialog
6. Authorize Noble Clarity to access your Stripe data
7. Done! Your revenue data will sync automatically

**What Gets Synced:**
• Transaction history
• Revenue by product/service
• Customer data
• Subscription metrics
• Refunds and chargebacks

**Privacy:** We use read-only access and bank-grade encryption. Your Stripe credentials are never stored on our servers.

Need help with other integrations? Just ask!
''',

    'how do i connect quickbooks': '''
**Connecting QuickBooks to Noble Clarity Engine:**

1. Navigate to **Data Entry** → **Integrations**
2. Select **QuickBooks**
3. Tap **Connect**
4. Sign in to your QuickBooks account
5. Authorize Noble Clarity (read-only access)
6. Your financial data will sync automatically

**What Gets Synced:**
• Income statements
• Balance sheets
• Expense categories
• Accounts receivable/payable
• Cash flow statements

Sync happens every 24 hours, or you can manually refresh anytime.
''',

    'how do i use scenario planner': '''
**Scenario Planner - Model Your Business Future:**

**How to Use:**
1. Go to **Scenario Planner** from the main menu
2. See your current baseline (actual numbers)
3. Adjust variables:
   • Revenue growth rate
   • Expense changes
   • Hiring plans
   • Marketing spend
4. See instant projections for:
   • Runway
   • Profitability
   • Cash position
   • Break-even point

**Example Scenarios:**
• "What if I hire 2 engineers?"
• "What if I cut marketing by 20%?"
• "What if I raise prices by 15%?"
• "What if I land a \$50k enterprise deal?"

**Pro Tip:** Save multiple scenarios and compare them side-by-side to make data-driven decisions.

Want me to help you model a specific scenario?
''',
  };

  /// Financial Expertise - Common financial questions
  static const Map<String, String> financialExpertise = {
    'what is runway': '''
**Runway** is how long your business can operate before running out of money.

**Formula:**
Runway (months) = Cash in Bank ÷ Monthly Burn Rate

**Example:**
• Cash: \$180,000
• Monthly Burn: \$15,000
• Runway: 12 months

**Healthy Runway Benchmarks:**
• Pre-seed: 12-18 months
• Seed: 18-24 months
• Series A+: 24-36 months

**How to Extend Runway:**
1. Reduce operating expenses (OpEx)
2. Increase revenue (faster sales cycle)
3. Delay hiring
4. Negotiate better vendor terms
5. Raise capital

Want me to calculate your current runway?
''',

    'what is burn rate': '''
**Burn Rate** is how much money you're spending each month.

**Formula:**
Burn Rate = Total Monthly Expenses - Total Monthly Revenue

**Example:**
• Revenue: \$30,000/month
• Expenses: \$45,000/month
• Burn Rate: \$15,000/month (losing money)

**Types:**
• **Gross Burn:** Total expenses (ignoring revenue)
• **Net Burn:** Expenses minus revenue (actual cash drain)

**Healthy Burn Rate:**
• Early-stage: \$10k-50k/month
• Growth-stage: \$50k-200k/month
• Scale-stage: \$200k+/month

**Red Flags:**
⚠️ Burn rate increasing faster than revenue
⚠️ Less than 6 months runway
⚠️ No clear path to profitability

Want me to analyze your burn rate?
''',

    'what is cac': '''
**CAC (Customer Acquisition Cost)** is how much you spend to acquire one customer.

**Formula:**
CAC = Total Marketing & Sales Spend ÷ Number of New Customers

**Example:**
• Marketing Spend: \$10,000/month
• New Customers: 50
• CAC: \$200 per customer

**Benchmarks by Industry:**
• B2C SaaS: \$50-200
• B2B SaaS: \$200-500
• Enterprise SaaS: \$500-5,000+

**Good CAC:**
• LTV:CAC ratio > 3:1
• Payback period < 12 months
• Decreasing over time (economies of scale)

**How to Reduce CAC:**
1. Optimize ad targeting
2. Improve conversion rates
3. Focus on high-performing channels
4. Implement referral programs
5. Content marketing (lower cost)

Want me to calculate your CAC by channel?
''',

    'what is ltv': '''
**LTV (Lifetime Value)** is the total revenue you'll earn from a customer over their entire relationship with your business.

**Formula (SaaS):**
LTV = ARPU × Gross Margin % ÷ Churn Rate

**Example:**
• ARPU: \$100/month
• Gross Margin: 80%
• Churn: 5%/month
• LTV: \$100 × 0.80 ÷ 0.05 = \$1,600

**Simplified Formula:**
LTV = Average Purchase Value × Purchase Frequency × Customer Lifespan

**Healthy LTV Metrics:**
• LTV:CAC ratio > 3:1 (ideal: 4-5:1)
• LTV should be increasing over time
• Churn rate < 5%/month for SaaS

**How to Increase LTV:**
1. Reduce churn (improve product)
2. Upsell/cross-sell
3. Increase prices
4. Add premium tiers
5. Improve customer success

Want me to calculate your LTV?
''',

    'what is gross margin': '''
**Gross Margin** is the percentage of revenue left after subtracting direct costs (COGS).

**Formula:**
Gross Margin % = (Revenue - COGS) ÷ Revenue × 100

**Example:**
• Revenue: \$100,000
• COGS: \$30,000
• Gross Margin: 70%

**Benchmarks:**
• SaaS: 70-90% (high margin)
• E-commerce: 30-50%
• Services: 40-60%
• Manufacturing: 20-40%

**What's Included in COGS:**
• Hosting/infrastructure costs
• Payment processing fees
• Direct labor (customer success)
• Third-party API costs

**Why It Matters:**
• Higher margin = more cash for growth
• SaaS should aim for 80%+ for scalability
• Below 60% makes fundraising difficult

Want me to analyze your gross margin?
''',
  };

  /// Marketing Expertise - Marketing strategy questions
  static const Map<String, String> marketingExpertise = {
    'which ad channel should i use': '''
**Choosing the Right Ad Channel:**

**Google Ads** 🎯
Best for: B2B SaaS, high-intent searches
Typical CAC: \$80-300
Pros: High intent, scalable
Cons: Competitive, expensive clicks

**Meta Ads (Facebook/Instagram)** 📱
Best for: B2C, visual products, broad audiences
Typical CAC: \$50-200
Pros: Detailed targeting, creative formats
Cons: iOS 14.5 tracking issues

**LinkedIn Ads** 💼
Best for: B2B, enterprise sales, professional services
Typical CAC: \$200-500
Pros: Professional targeting, decision-makers
Cons: Expensive CPCs (\$5-15)

**TikTok Ads** 🎵
Best for: B2C, Gen Z/Millennials, viral potential
Typical CAC: \$30-100
Pros: Low cost, high engagement, trending
Cons: Younger audience, brand fit

**My Recommendation:**
1. Start with **Google Ads** (high intent)
2. Test **Meta** with \$500-1,000 budget
3. Add **TikTok** if B2C and visual product
4. Use **LinkedIn** only for B2B with >\$10k ACV

Want me to analyze which channels fit your business?
''',

    'how do i reduce cac': '''
**10 Proven Ways to Reduce CAC:**

**1. Optimize Ad Targeting** 🎯
• Narrow audience to high-intent users
• Use lookalike audiences
• Exclude converters (retargeting)

**2. Improve Landing Pages** 📄
• A/B test headlines, CTAs
• Reduce friction (fewer form fields)
• Add social proof (testimonials)

**3. Focus on High-Performing Channels** 📊
• Pause underperforming campaigns
• Double down on winners
• Track CAC by channel

**4. Content Marketing** ✍️
• SEO for organic traffic (free!)
• Educational blog posts
• YouTube tutorials

**5. Referral Programs** 🤝
• Incentivize customers to refer
• Typical CAC: 50% of paid channels
• Viral coefficient > 1.0

**6. Email Marketing** 📧
• Nurture leads before asking for sale
• Automated drip campaigns
• Re-engage churned users

**7. Conversion Rate Optimization** 📈
• Improve website UX
• Faster load times
• Clear value proposition

**8. Retargeting** 🔄
• Lower cost than cold traffic
• Higher conversion rates
• Pixel tracking essential

**9. Partnerships** 🤝
• Co-marketing with complementary brands
• Affiliate programs
• Integration partnerships

**10. Organic Social** 📱
• Build community (free!)
• User-generated content
• Thought leadership

Want me to prioritize these for your business?
''',

    'what is a good conversion rate': '''
**Conversion Rate Benchmarks:**

**Landing Pages:**
• Average: 2-5%
• Good: 5-10%
• Excellent: 10-15%+

**E-commerce:**
• Average: 1-3%
• Good: 3-5%
• Excellent: 5-10%+

**SaaS Free Trial:**
• Average: 10-15%
• Good: 15-25%
• Excellent: 25-40%+

**Email Campaigns:**
• Average: 1-3%
• Good: 3-5%
• Excellent: 5-10%+

**How to Improve:**
1. **Clear Value Prop** - What's in it for them?
2. **Reduce Friction** - Fewer form fields
3. **Social Proof** - Testimonials, logos, reviews
4. **Urgency** - Limited time offers
5. **A/B Testing** - Test everything!
6. **Mobile Optimization** - 60%+ traffic is mobile
7. **Fast Load Times** - Every second counts

Want me to analyze your conversion funnel?
''',
  };

  /// Business Strategy - Strategic questions
  static const Map<String, String> businessStrategy = {
    'should i raise money': '''
**Should You Raise Money? Decision Framework:**

**✅ Raise Money If:**
• You have product-market fit (PMF)
• Strong unit economics (LTV:CAC > 3:1)
• Clear path to 10x growth
• Runway < 12 months
• Market opportunity > \$1B
• Competitive pressure (land grab)

**❌ Don't Raise If:**
• No PMF yet (fix product first)
• Profitable and growing
• Runway > 18 months
• Poor unit economics
• No clear use of funds
• Can bootstrap to profitability

**How Much to Raise:**
• Pre-seed: \$250k-1M (12-18 months runway)
• Seed: \$1-3M (18-24 months runway)
• Series A: \$5-15M (24-36 months runway)

**Dilution:**
• Pre-seed: 10-15%
• Seed: 15-20%
• Series A: 20-25%

**Alternative to Raising:**
1. Revenue-based financing
2. Venture debt
3. Grants/competitions
4. Strategic partnerships
5. Bootstrap to profitability

Want me to analyze if you should raise based on your numbers?
''',

    'how should i price my product': '''
**SaaS Pricing Strategy Framework:**

**Pricing Models:**

**1. Value-Based Pricing** 💎 (Best)
• Price based on value delivered
• Example: Save customer \$10k → Charge \$2k
• Highest margins

**2. Competitor-Based Pricing** 🎯
• Match or undercut competitors
• Easy to justify
• Risk: race to bottom

**3. Cost-Plus Pricing** 📊
• Cost × Markup (e.g., 3x)
• Simple but leaves money on table

**Pricing Tiers:**
• **Starter:** \$29-99/month (self-serve)
• **Professional:** \$99-299/month (most popular)
• **Enterprise:** \$500+/month (custom)

**Pricing Psychology:**
• End prices in 9 or 7 (\$97 vs \$100)
• Show annual savings (save 20%!)
• Anchor high (show enterprise price first)
• Good-Better-Best (3 tiers optimal)

**When to Raise Prices:**
• Product significantly improved
• Added major features
• Strong demand (low churn)
• Grandfather existing customers

**Red Flags:**
⚠️ Pricing too low (hard to raise later)
⚠️ Too many tiers (confusing)
⚠️ No clear value differentiation

Want me to analyze your pricing strategy?
''',
  };

  /// Industry Trends 2026 - Current market insights
  static const Map<String, String> industryTrends2026 = {
    'what are current saas trends': '''
**SaaS Industry Trends 2026:**

**1. AI-First Everything** 🤖
• AI features are table stakes, not differentiators
• AI reducing CAC by 30-40% for early adopters
• AI-powered customer success reducing churn

**2. Profitability > Growth** 💰
• "Default alive" is the new mantra
• Investors want path to profitability
• Burn multiples < 1.5x preferred

**3. Usage-Based Pricing** 📊
• Subscription fatigue is real
• Pay-as-you-go models growing 40% YoY
• Better alignment with customer value

**4. Vertical SaaS Dominance** 🎯
• Niche > Horizontal
• Valuations: 8-12x revenue (vs 5-7x horizontal)
• Easier to build moats

**5. Privacy-First Marketing** 🔒
• iOS 14.5+ killed traditional attribution
• First-party data is gold
• Server-side tracking essential

**6. Short-Form Video Wins** 📱
• TikTok/Reels: 3-5x higher engagement
• B2B brands seeing success on TikTok
• Video > Static ads

**7. Remote-First Operations** 🌍
• 20-30% overhead reduction
• Global talent pools
• Async communication tools booming

**8. Micro-SaaS Boom** 🚀
• Solo founders building \$1M ARR businesses
• Lower customer acquisition costs
• Niche communities

**9. Embedded Finance** 💳
• SaaS adding payments/lending
• 30-40% revenue boost
• Stripe, Plaid enabling this

**10. Consolidation Wave** 🔄
• Roll-ups of niche SaaS
• PE firms active in \$5-50M ARR range
• Exit multiples: 6-10x revenue

Want deeper insights on any trend?
''',

    'what is a good valuation multiple': '''
**SaaS Valuation Multiples 2026:**

**Revenue Multiples by Stage:**
• **Pre-revenue:** 0.5-1x projected ARR
• **<\$1M ARR:** 3-5x
• **\$1-5M ARR:** 5-8x
• **\$5-20M ARR:** 8-12x
• **\$20M+ ARR:** 10-15x+

**What Drives Higher Multiples:**
• **Growth Rate:** >100% YoY = premium
• **Gross Margin:** >80% = premium
• **Net Revenue Retention:** >120% = premium
• **CAC Payback:** <12 months = premium
• **Market Size:** >\$1B TAM = premium

**Vertical SaaS Premium:**
• 20-30% higher than horizontal
• Deeper moats, better retention
• Example: 10x vs 8x for horizontal

**Current Market (2026):**
• Down from 2021 peak (15-20x)
• Up from 2023 trough (3-5x)
• Stabilizing at 8-12x for quality SaaS

**Rule of 40:**
Growth Rate % + Profit Margin % ≥ 40
• Above 40 = premium valuation
• Below 40 = discount

Want me to estimate your valuation?
''',

    'what lies beyond 2026': '''
**Future Horizon: 2027-2030 and Beyond:**

**1. The Sovereign Individual's Tech Stack** 👤
• Rise of "Company of One" reaching \$10M ARR
• AI agents handling 90% of operational tasks (legal, accounting, dev)
• Shift from human-led teams to AI-agent clusters

**2. Zero-CAC Growth Models** ⭕
• Marketing shifts from "buying attention" to "building utility"
• Community-led growth becomes the primary acquisition channel
• AI-driven word-of-mouth (agents talking to agents)

**3. Hyper-Personalization at Scale** 🎭
• Products that re-design their own UI based on individual user needs
• Dynamic pricing shifting from "tiers" to "real-time value realization"
• Zero-onboarding applications (AI understands your goal instantly)

**4. Data Sovereignty & Local LLMs** 🔒
• Businesses moving away from centralized giants to private, local models
• "Edge Intelligence" - financial analysis happening entirely on your device
• Privacy is no longer a feature, it's the foundation

**5. The Post-Subscription Era** 🚀
• Outcome-based billing (only pay if you reach the goal)
• Fractional ownership of SaaS tools via micro-equity
• Decentralized software marketplaces

**Noble Clarity's Role:** We are building for this future - ensuring you have the crystalline precision to lead in the Sovereign Era.
''',
  };

  /// Searches the knowledge base for a matching answer
  static String? findAnswer(String question) {
    final normalizedQuestion = question.toLowerCase().trim();

    // Check all knowledge bases
    final allKnowledge = {
      ...platformKnowledge,
      ...financialExpertise,
      ...marketingExpertise,
      ...businessStrategy,
      ...industryTrends2026,
    };

    // Exact match
    if (allKnowledge.containsKey(normalizedQuestion)) {
      return allKnowledge[normalizedQuestion];
    }

    // Fuzzy match - check if question contains key phrases
    for (final entry in allKnowledge.entries) {
      if (normalizedQuestion.contains(entry.key) ||
          entry.key.contains(normalizedQuestion)) {
        return entry.value;
      }
    }

    // Keyword matching
    if (normalizedQuestion.contains('runway')) {
      return financialExpertise['what is runway'];
    }
    if (normalizedQuestion.contains('burn rate') ||
        normalizedQuestion.contains('burning')) {
      return financialExpertise['what is burn rate'];
    }
    if (normalizedQuestion.contains('cac') ||
        normalizedQuestion.contains('acquisition cost')) {
      return financialExpertise['what is cac'];
    }
    if (normalizedQuestion.contains('ltv') ||
        normalizedQuestion.contains('lifetime value')) {
      return financialExpertise['what is ltv'];
    }
    if (normalizedQuestion.contains('margin')) {
      return financialExpertise['what is gross margin'];
    }
    if (normalizedQuestion.contains('raise') &&
        normalizedQuestion.contains('money')) {
      return businessStrategy['should i raise money'];
    }
    if (normalizedQuestion.contains('pric')) {
      return businessStrategy['how should i price my product'];
    }
    if (normalizedQuestion.contains('ad channel') ||
        normalizedQuestion.contains('marketing channel')) {
      return marketingExpertise['which ad channel should i use'];
    }
    if (normalizedQuestion.contains('conversion rate')) {
      return marketingExpertise['what is a good conversion rate'];
    }
    if (normalizedQuestion.contains('trend')) {
      return industryTrends2026['what are current saas trends'];
    }
    if (normalizedQuestion.contains('valuation')) {
      return industryTrends2026['what is a good valuation multiple'];
    }

    // No match found - will fall back to Gemini API
    return null;
  }

  /// Gets all available topics for suggestions
  static List<String> getAllTopics() {
    return [
      ...platformKnowledge.keys,
      ...financialExpertise.keys,
      ...marketingExpertise.keys,
      ...businessStrategy.keys,
      ...industryTrends2026.keys,
    ];
  }

  /// Gets suggested questions based on category
  static List<String> getSuggestedQuestions(String category) {
    switch (category.toLowerCase()) {
      case 'platform':
        return platformKnowledge.keys.toList();
      case 'financial':
        return financialExpertise.keys.toList();
      case 'marketing':
        return marketingExpertise.keys.toList();
      case 'strategy':
        return businessStrategy.keys.toList();
      case 'trends':
        return industryTrends2026.keys.toList();
      default:
        return getAllTopics();
    }
  }
}
