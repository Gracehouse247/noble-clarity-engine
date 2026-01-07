
import * as React from 'react';
import { useLocation } from 'react-router-dom';

interface SEOConfig {
    title: string;
    description: string;
    keywords: string;
}

const SEO_MAP: Record<string, SEOConfig> = {
    '/': {
        title: 'Financial Data Analytics Platform | Noble Clarity Engine',
        description: 'Transform financial noise into absolute clarity with our AI-driven financial data analytics platform. Real-time dashboards and predictive business insights.',
        keywords: 'Financial data analytics, AI business coach, Financial health checkup, Business intelligence for startups, SaaS financial metrics'
    },
    '/features': {
        title: 'Predictive Analytics for Small Business | Growth Engine',
        description: 'Powerful predictive analytics tools for small business. Automated cash flow forecasting, KPI tracking, and ROI calculation in one growth engine.',
        keywords: 'Predictive analytics, Cash flow forecasting, KPI tracking software, CAC calculator, LTV calculator, Burn rate calculator'
    },
    '/pricing': {
        title: 'Best Budgeting Apps for Small Business | Noble Clarity',
        description: 'Explore the best budgeting and financial analysis plans for small business. Affordable startup financial tools starting from free.',
        keywords: 'Budgeting apps, Startup financial tools, Runway calculator, Financial literacy for founders, Noble clarity pricing'
    },
    '/story': {
        title: 'Predictive Business Modeling & The Noble Manifesto',
        description: 'Discover the transparency behind our predictive business modeling. How we use Google Gemini 1.5 Flash to democratize financial intelligence.',
        keywords: 'Predictive business modeling, Transparent AI logic, Google Gemini integration, Financial data consolidation, ESG reporting'
    },
    '/api-docs': {
        title: 'Financial Intelligence API & SDK | Noble Clarity',
        description: 'Integrate the Noble Clarity financial intelligence API. Build predictive models into your own applications with our robust SDK.',
        keywords: 'Financial intelligence API, Business prediction API, Noble SDK, Financial data integration'
    },
    '/security': {
        title: 'Security & Data Protection | Noble Clarity Engine',
        description: 'Learn about our enterprise-grade security protocols, encryption, and how we protect your financial data.',
        keywords: 'financial security, data protection, enterprise encryption, secure financial modeling'
    },
    '/privacy': {
        title: 'Privacy Policy | Noble Clarity Engine',
        description: 'Read the Noble Clarity Engine privacy policy to understand how we handle and protect your personal and business data.',
        keywords: 'privacy policy, data privacy, financial data handling'
    },
    '/terms': {
        title: 'Terms of Service | Noble Clarity Engine',
        description: 'Read the terms and conditions for using the Noble Clarity Engine platform and services.',
        keywords: 'terms of service, user agreement, legal terms'
    },
    '/changelog': {
        title: 'Product Updates & Changelog | Noble Clarity Engine',
        description: 'Stay updated with the latest features, improvements, and fixes in the Noble Clarity Engine financial OS.',
        keywords: 'product updates, changelog, new features, financial software updates'
    },
    '/login': {
        title: 'Login to Noble Clarity Engine | Secure Access',
        description: 'Log in to your Noble Clarity Engine account to access your financial dashboard and predictive insights.',
        keywords: 'login, secure access, financial dashboard login'
    },
    '/signup': {
        title: 'Sign Up for Noble Clarity Engine | Start for Free',
        description: 'Join the next generation of founders. Create your Noble Clarity Engine account and gain total financial clarity.',
        keywords: 'sign up, create account, free financial intelligence'
    }
};

const SEOManager: React.FC = () => {
    const location = useLocation();

    React.useEffect(() => {
        const config = SEO_MAP[location.pathname] || SEO_MAP['/'];

        // Update Title
        document.title = config.title;

        // Update Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', config.description);

        // Update Meta Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', config.keywords);

        // Update Open Graph Tags
        const updateOG = (property: string, content: string) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        updateOG('og:title', config.title);
        updateOG('og:description', config.description);
        updateOG('og:url', window.location.href);
        updateOG('og:type', 'website');

    }, [location]);

    return null;
};

export default SEOManager;
