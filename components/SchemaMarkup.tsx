
import * as React from 'react';

const SchemaMarkup: React.FC = () => {
    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Noble Clarity Engine",
        "url": "https://clarity.noblesworld.com.ng",
        "logo": "https://clarity.noblesworld.com.ng/favicon.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+234-XXX-XXX-XXXX",
            "contactType": "customer service",
            "areaServed": "Global",
            "availableLanguage": "English"
        },
        "sameAs": [
            "https://noblesworld.com.ng"
        ]
    };

    const schemaSoftware = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Noble Clarity Engine",
        "operatingSystem": "Web Browser",
        "applicationCategory": "BusinessApplication",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "500"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "Noble Clarity Engine",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lagos",
            "addressCountry": "NG"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 6.5244,
            "longitude": 3.3792
        },
        "url": "https://clarity.noblesworld.com.ng"
    };

    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(schemaOrg)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(schemaSoftware)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(localBusinessSchema)}
            </script>
        </>
    );
};

export default SchemaMarkup;
