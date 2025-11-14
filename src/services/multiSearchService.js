import axios from 'axios';
import Config from '../utils/config.js';

/**
 * Multi-Search Engine Service
 * Aggregates results from multiple search engines for comprehensive coverage
 */
class MultiSearchService {
    constructor() {
        this.searchEngines = [];
        this.initializeEngines();
    }

    initializeEngines() {
        this.searchEngines = [];
        
        // Google Custom Search
        if (Config.isGoogleSearchEnabled()) {
            this.searchEngines.push({
                name: 'google',
                enabled: true,
                search: this.performGoogleSearch.bind(this)
            });
        }

        // Bing Search (if API key is configured)
        if (Config.getBingApiKey()) {
            this.searchEngines.push({
                name: 'bing',
                enabled: true,
                search: this.performBingSearch.bind(this)
            });
        }

        // DuckDuckGo (no API key needed, but very limited - only instant answers)
        // Only add if no other engines are configured
        if (this.searchEngines.length === 0) {
            this.searchEngines.push({
                name: 'duckduckgo',
                enabled: true,
                search: this.performDuckDuckGoSearch.bind(this)
            });
        }
    }

    /**
     * Perform Google Custom Search
     */
    async performGoogleSearch(query) {
        const apiKey = Config.getGoogleApiKey();
        const searchEngineId = Config.getGoogleSearchEngineId();
        
        if (!apiKey || !searchEngineId) {
            throw new Error('Google Search API not configured');
        }

        const url = 'https://www.googleapis.com/customsearch/v1';
        const params = {
            key: apiKey,
            cx: searchEngineId,
            q: query,
            num: 10,
            safe: 'active'
        };

        try {
            const response = await axios.get(url, { params, timeout: 10000 });
            
            if (response.data.error) {
                throw new Error(response.data.error.message || 'Google Search API error');
            }
            
            if (!response.data.items || response.data.items.length === 0) {
                return { items: [], engine: 'google' };
            }
            
            return {
                items: response.data.items.map(item => ({
                    title: item.title || 'Untitled',
                    url: item.link || '#',
                    description: item.snippet || item.htmlSnippet || '',
                    engine: 'google'
                })),
                engine: 'google'
            };
        } catch (error) {
            console.error('Google Search error:', error.message);
            throw error;
        }
    }

    /**
     * Perform DuckDuckGo Search (using HTML scraping via instant answer API)
     * Note: DuckDuckGo doesn't have a public web search API, so we use Instant Answers
     * For better results, users should configure Google or Bing API
     */
    async performDuckDuckGoSearch(query) {
        try {
            // DuckDuckGo Instant Answer API (limited but free)
            const url = 'https://api.duckduckgo.com/';
            const params = {
                q: query,
                format: 'json',
                no_html: '1',
                skip_disambig: '1'
            };

            const response = await axios.get(url, { params, timeout: 10000 });
            const data = response.data;

            const items = [];
            
            // Add abstract if available
            if (data.AbstractText) {
                items.push({
                    title: data.Heading || query,
                    url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
                    description: data.AbstractText,
                    engine: 'duckduckgo'
                });
            }

            // Add related topics
            if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
                data.RelatedTopics.slice(0, 5).forEach(topic => {
                    if (topic.Text && topic.FirstURL) {
                        items.push({
                            title: topic.Text.substring(0, 100) || 'Related Topic',
                            url: topic.FirstURL,
                            description: topic.Text,
                            engine: 'duckduckgo'
                        });
                    }
                });
            }

            // If no results from Instant Answers, create a search link
            if (items.length === 0) {
                items.push({
                    title: `Search results for "${query}"`,
                    url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
                    description: `Click to view search results for "${query}" on DuckDuckGo`,
                    engine: 'duckduckgo'
                });
            }

            return {
                items: items.slice(0, 10),
                engine: 'duckduckgo'
            };
        } catch (error) {
            console.error('DuckDuckGo Search error:', error.message);
            // Return a fallback search link
            return { 
                items: [{
                    title: `Search for "${query}"`,
                    url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
                    description: `View search results on DuckDuckGo`,
                    engine: 'duckduckgo'
                }], 
                engine: 'duckduckgo' 
            };
        }
    }

    /**
     * Perform Bing Search
     */
    async performBingSearch(query) {
        const apiKey = Config.getBingApiKey();
        
        if (!apiKey) {
            throw new Error('Bing Search API not configured');
        }

        // Use query as-is (already enhanced by deep thinking service)
        const searchQuery = query;

        const url = 'https://api.bing.microsoft.com/v7.0/search';
        const params = {
            q: searchQuery,
            count: 10,
            offset: 0,
            mkt: 'en-US',
            safeSearch: 'Moderate'
        };

        try {
            const response = await axios.get(url, {
                params,
                headers: {
                    'Ocp-Apim-Subscription-Key': apiKey
                },
                timeout: 10000
            });

            if (!response.data.webPages || !response.data.webPages.value) {
                console.warn('Bing Search returned no results for query:', searchQuery);
                return { items: [], engine: 'bing' };
            }

            return {
                items: response.data.webPages.value.map(item => ({
                    title: item.name || 'Untitled',
                    url: item.url || '#',
                    description: item.snippet || '',
                    engine: 'bing'
                })),
                engine: 'bing'
            };
        } catch (error) {
            console.error('Bing Search error:', error.message);
            throw error;
        }
    }

    /**
     * Re-initialize engines (call when config changes)
     */
    reinitialize() {
        this.searchEngines = [];
        this.initializeEngines();
    }

    /**
     * Search across all enabled engines in parallel
     */
    async searchAll(query) {
        // Re-initialize to pick up any config changes
        this.reinitialize();
        
        const enabledEngines = this.searchEngines.filter(engine => engine.enabled);
        
        if (enabledEngines.length === 0) {
            // If no engines enabled, return empty results instead of throwing
            console.warn('No search engines enabled, returning empty results');
            return {
                allItems: [],
                byEngine: {},
                totalResults: 0
            };
        }

        // Execute all searches in parallel
        const searchPromises = enabledEngines.map(engine => 
            engine.search(query).catch(error => {
                console.warn(`${engine.name} search failed:`, error.message);
                return { items: [], engine: engine.name, error: error.message };
            })
        );

        const results = await Promise.allSettled(searchPromises);
        
        // Aggregate results
        const aggregated = {
            allItems: [],
            byEngine: {},
            totalResults: 0
        };

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                const engineName = result.value.engine || enabledEngines[index].name;
                aggregated.byEngine[engineName] = result.value.items || [];
                aggregated.allItems.push(...(result.value.items || []));
            }
        });

        aggregated.totalResults = aggregated.allItems.length;
        
        return aggregated;
    }

    /**
     * Deduplicate results by URL
     */
    deduplicateResults(items) {
        const seen = new Set();
        const unique = [];

        items.forEach(item => {
            const url = item.url || '';
            if (url && !seen.has(url)) {
                seen.add(url);
                unique.push(item);
            }
        });

        return unique;
    }

    /**
     * Rank and sort results by relevance
     */
    rankResults(items, query) {
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

        return items.map(item => {
            let score = 0;
            const titleLower = (item.title || '').toLowerCase();
            const descLower = (item.description || '').toLowerCase();
            const combined = `${titleLower} ${descLower}`;

            // Title matches are more important
            queryWords.forEach(word => {
                if (titleLower.includes(word)) score += 10;
                if (descLower.includes(word)) score += 5;
            });

            // Exact phrase match
            if (combined.includes(queryLower)) score += 20;

            // Engine preference (Google > Bing > DuckDuckGo)
            if (item.engine === 'google') score += 5;
            else if (item.engine === 'bing') score += 3;

            return { ...item, score };
        }).sort((a, b) => b.score - a.score);
    }
}

export default new MultiSearchService();

