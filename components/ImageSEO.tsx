
import * as React from 'react';

interface ImageSEOProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    altText?: string;
}

const ImageSEO: React.FC<ImageSEOProps> = ({ altText, src, className, ...props }) => {
    // Automated Title and Alt generation logic
    const derivedAlt = React.useMemo(() => {
        if (altText) return altText;
        if (!src) return 'Noble Clarity Engine Application Asset';

        // Extract filename and clean it up
        const filename = src.split('/').pop()?.split('.')[0] || '';
        return filename
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()) + ' | Financial Intelligence Platform';
    }, [altText, src]);

    return (
        <img
            src={src}
            alt={derivedAlt}
            title={derivedAlt} // SEO Title attribute
            className={className}
            loading="lazy" // Performance optimization
            decoding="async" // Performance optimization
            {...props}
        />
    );
};

export default ImageSEO;
