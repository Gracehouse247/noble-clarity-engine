
/**
 * Noble Clarity Engine - Instant Indexing Utility
 * This utility uses the IndexNow API to notify search engines of page updates.
 * Documentation: https://www.indexnow.org/documentation
 */

const SEARCH_ENGINES = [
    'https://www.bing.com/indexnow',
    'https://search.yandex.com/indexnow',
    'https://api.indexnow.org/indexnow' // Universal endpoint
];

// In a real production environment, you would generate a key and save it in a .txt file at the root.
// For example: public/1234567890abcdef.txt
const INDEX_NOW_KEY = 'noble_clarity_seo_key_2026';

export const notifySearchEngines = async (urls: string[]) => {
    const host = 'clarity.noblesworld.com.ng';

    const payload = {
        host,
        key: INDEX_NOW_KEY,
        keyLocation: `https://${host}/${INDEX_NOW_KEY}.txt`,
        urlList: urls
    };

    console.log('Notifying search engines via IndexNow...', payload);

    const results = await Promise.allSettled(
        SEARCH_ENGINES.map(engine =>
            fetch(engine, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        )
    );

    return results;
};
