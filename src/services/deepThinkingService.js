import { africanCountries, africanKeywords } from '../data/africanCountries.js';
import multiSearchService from './multiSearchService.js';

/**
 * Deep Thinking Service
 * Implements multi-step reasoning similar to DeepSeek, Gemini, and ChatGPT
 * but with Africa-focused analysis
 */
class DeepThinkingService {
    constructor() {
        this.reasoningSteps = [];
    }

    /**
     * Main deep thinking process
     * Breaks down queries into multiple reasoning steps
     */
    async thinkDeeply(query) {
        this.reasoningSteps = [];
        
        // Step 1: Understand the query
        const understanding = await this.understandQuery(query);
        this.reasoningSteps.push({ step: 1, type: 'understanding', data: understanding });

        // Step 2: Identify Africa-relevant aspects
        const africaRelevance = await this.identifyAfricaRelevance(query, understanding);
        this.reasoningSteps.push({ step: 2, type: 'africa_relevance', data: africaRelevance });

        // Step 3: Generate sub-queries for comprehensive search
        const subQueries = await this.generateSubQueries(query, understanding, africaRelevance);
        this.reasoningSteps.push({ step: 3, type: 'sub_queries', data: subQueries });

        // Step 4: Search across multiple engines with sub-queries
        const searchResults = await this.multiQuerySearch(subQueries);
        this.reasoningSteps.push({ step: 4, type: 'search_results', data: searchResults });

        // Step 5: Analyze and synthesize results
        const analysis = await this.analyzeResults(query, searchResults, africaRelevance);
        this.reasoningSteps.push({ step: 5, type: 'analysis', data: analysis });

        // Step 6: Generate comprehensive narrative
        const narrative = await this.generateNarrative(query, analysis, africaRelevance);
        this.reasoningSteps.push({ step: 6, type: 'narrative', data: narrative });

        return {
            query,
            understanding,
            africaRelevance,
            subQueries,
            searchResults,
            analysis,
            narrative,
            reasoningSteps: this.reasoningSteps
        };
    }

    /**
     * Step 1: Understand the query intent and context
     */
    async understandQuery(query) {
        const lowerQuery = query.toLowerCase();
        
        // Identify query type
        const queryTypes = {
            business: ['business', 'investment', 'opportunity', 'market', 'economy', 'sector', 'industry'],
            technology: ['technology', 'tech', 'innovation', 'digital', 'startup', 'fintech'],
            agriculture: ['agriculture', 'farming', 'crop', 'food', 'agricultural'],
            energy: ['energy', 'power', 'renewable', 'solar', 'oil', 'gas', 'electricity'],
            infrastructure: ['infrastructure', 'construction', 'development', 'building', 'road', 'transport'],
            general: []
        };

        let detectedType = 'general';
        for (const [type, keywords] of Object.entries(queryTypes)) {
            if (keywords.some(keyword => lowerQuery.includes(keyword))) {
                detectedType = type;
                break;
            }
        }

        // Extract key entities
        const entities = this.extractEntities(query);

        return {
            originalQuery: query,
            queryType: detectedType,
            entities,
            keywords: lowerQuery.split(/\s+/).filter(w => w.length > 2),
            isQuestion: query.trim().endsWith('?'),
            isComparison: lowerQuery.includes(' vs ') || lowerQuery.includes(' versus ') || lowerQuery.includes(' compare')
        };
    }

    /**
     * Step 2: Identify Africa-relevant aspects
     */
    async identifyAfricaRelevance(query, understanding) {
        const lowerQuery = query.toLowerCase();
        const relevantCountries = [];
        const relevantSectors = [];
        const relevanceScore = 0;

        // Check for country mentions
        africanCountries.forEach(country => {
            const countryNameLower = country.name.toLowerCase();
            if (lowerQuery.includes(countryNameLower)) {
                relevantCountries.push(country);
            }
        });

        // Check for sector keywords
        Object.entries(africanKeywords).forEach(([keyword, countries]) => {
            if (lowerQuery.includes(keyword)) {
                relevantSectors.push(keyword);
                // Add countries associated with this sector
                countries.forEach(countryName => {
                    const country = africanCountries.find(c => c.name === countryName);
                    if (country && !relevantCountries.find(c => c.name === countryName)) {
                        relevantCountries.push(country);
                    }
                });
            }
        });

        // If no specific countries, identify top relevant ones based on query type
        if (relevantCountries.length === 0) {
            relevantCountries.push(...this.getTopCountriesForQueryType(understanding.queryType));
        }

        return {
            relevantCountries: relevantCountries.slice(0, 5),
            relevantSectors,
            hasExplicitAfricaMention: lowerQuery.includes('africa') || lowerQuery.includes('african'),
            relevanceScore: relevantCountries.length > 0 ? 100 : 50
        };
    }

    /**
     * Step 3: Generate sub-queries for comprehensive search
     * All queries are Africa-focused to ensure African country specific results
     */
    async generateSubQueries(query, understanding, africaRelevance) {
        const subQueries = [];
        const lowerQuery = query.toLowerCase();
        
        // Always ensure Africa/African context in all queries
        const ensureAfricaContext = (q) => {
            const qLower = q.toLowerCase();
            if (!qLower.includes('africa') && !qLower.includes('african')) {
                return `${q} Africa`;
            }
            return q;
        };

        // Base query - always add Africa context
        subQueries.push(ensureAfricaContext(query));

        // Add country-specific queries if countries identified
        if (africaRelevance.relevantCountries.length > 0) {
            africaRelevance.relevantCountries.slice(0, 3).forEach(country => {
                subQueries.push(ensureAfricaContext(`${query} ${country.name}`));
            });
        } else {
            // If no specific countries, add top African countries
            const topCountries = this.getTopCountriesForQueryType(understanding.queryType);
            topCountries.slice(0, 2).forEach(country => {
                subQueries.push(ensureAfricaContext(`${query} ${country.name}`));
            });
        }

        // Add sector-specific queries with Africa context
        if (africaRelevance.relevantSectors.length > 0) {
            africaRelevance.relevantSectors.slice(0, 2).forEach(sector => {
                subQueries.push(`${query} ${sector} Africa`);
            });
        }

        // Add business/investment angle with Africa context
        if (understanding.queryType !== 'business' && !lowerQuery.includes('business') && !lowerQuery.includes('investment')) {
            subQueries.push(`${query} business opportunities Africa`);
        }

        // Add "African countries" variation
        if (!lowerQuery.includes('african countries')) {
            subQueries.push(`${query} African countries`);
        }

        return [...new Set(subQueries)]; // Remove duplicates
    }

    /**
     * Step 4: Search across multiple engines with all sub-queries
     */
    async multiQuerySearch(subQueries) {
        const allResults = {
            allItems: [],
            byQuery: {},
            byEngine: {}
        };

        // Search each sub-query across all engines (limit to first 3 sub-queries to avoid too many requests)
        const queriesToSearch = subQueries.slice(0, 3);
        
        for (const subQuery of queriesToSearch) {
            try {
                const results = await multiSearchService.searchAll(subQuery);
                allResults.byQuery[subQuery] = results;
                
                // Aggregate items
                if (results.allItems && results.allItems.length > 0) {
                    allResults.allItems.push(...results.allItems);
                }
                
                // Aggregate by engine
                Object.entries(results.byEngine || {}).forEach(([engine, items]) => {
                    if (!allResults.byEngine[engine]) {
                        allResults.byEngine[engine] = [];
                    }
                    if (items && items.length > 0) {
                        allResults.byEngine[engine].push(...items);
                    }
                });
            } catch (error) {
                console.warn(`Search failed for query "${subQuery}":`, error.message);
            }
        }

        // Deduplicate and rank
        const unique = allResults.allItems.length > 0 
            ? multiSearchService.deduplicateResults(allResults.allItems)
            : [];
        const ranked = unique.length > 0
            ? multiSearchService.rankResults(unique, subQueries[0]) // Rank by original query
            : [];

        return {
            ...allResults,
            uniqueItems: unique,
            rankedItems: ranked.slice(0, 20) // Top 20 results
        };
    }

    /**
     * Step 5: Analyze and synthesize results
     */
    async analyzeResults(query, searchResults, africaRelevance) {
        const rankedItems = searchResults.rankedItems || [];
        
        // Extract key insights
        const insights = rankedItems.length > 0 ? this.extractInsights(rankedItems) : [];
        
        // Match countries to results
        const countriesWithLinks = this.matchCountriesToResults(
            africaRelevance.relevantCountries,
            rankedItems
        );

        // Identify trends and patterns
        const trends = rankedItems.length > 0 ? this.identifyTrends(rankedItems) : [];

        return {
            totalResults: rankedItems.length,
            insights,
            countriesWithLinks: countriesWithLinks.length > 0 ? countriesWithLinks : africaRelevance.relevantCountries,
            trends,
            topSources: rankedItems.slice(0, 10)
        };
    }

    /**
     * Step 6: Generate comprehensive narrative
     */
    async generateNarrative(query, analysis, africaRelevance) {
        let narrative = `Based on comprehensive analysis of "${query}", `;
        
        // Add country context
        if (analysis.countriesWithLinks && analysis.countriesWithLinks.length > 0) {
            const countryNames = analysis.countriesWithLinks.map(c => c.name);
            narrative += `this topic is particularly relevant to ${this.formatCountryList(countryNames)}. `;
        } else if (africaRelevance.relevantCountries && africaRelevance.relevantCountries.length > 0) {
            const countryNames = africaRelevance.relevantCountries.map(c => c.name);
            narrative += `this topic is particularly relevant to ${this.formatCountryList(countryNames)}. `;
        }

        // Add insights if available
        if (analysis.insights && analysis.insights.length > 0) {
            const insightsText = analysis.insights.slice(0, 3).join('. ').substring(0, 200);
            if (insightsText) {
                narrative += `Key insights reveal: ${insightsText}. `;
            }
        }

        // Add country-specific information
        const countriesToShow = (analysis.countriesWithLinks || africaRelevance.relevantCountries || []).slice(0, 3);
        countriesToShow.forEach(country => {
            if (country && country.positiveAffirmation) {
                narrative += `${country.name} ${country.positiveAffirmation} `;
            }
        });

        // Add trends if available
        if (analysis.trends && analysis.trends.length > 0) {
            const trendsText = analysis.trends.slice(0, 2).join(', ');
            if (trendsText) {
                narrative += `Current trends indicate: ${trendsText}. `;
            }
        }

        // Add positive Africa-focused conclusion
        narrative += `Africa continues to demonstrate remarkable resilience and innovation, `;
        narrative += `offering exceptional opportunities for investment, partnership, and growth. `;
        narrative += `The continent's diverse economies, young population, and entrepreneurial spirit `;
        narrative += `position it as a leading destination for high-value business opportunities.`;

        return narrative;
    }

    // Helper methods

    extractEntities(query) {
        const entities = [];
        const words = query.split(/\s+/);
        
        // Check for country names
        africanCountries.forEach(country => {
            if (query.toLowerCase().includes(country.name.toLowerCase())) {
                entities.push({ type: 'country', value: country.name });
            }
        });

        return entities;
    }

    getTopCountriesForQueryType(queryType) {
        const typeMap = {
            business: ['Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Egypt'],
            technology: ['Nigeria', 'Kenya', 'South Africa', 'Rwanda', 'Ghana'],
            agriculture: ['Ghana', 'Ivory Coast', 'Ethiopia', 'Tanzania', 'Nigeria'],
            energy: ['Nigeria', 'Egypt', 'Algeria', 'Angola', 'Morocco'],
            infrastructure: ['Ethiopia', 'Rwanda', 'Kenya', 'Nigeria', 'Ghana'],
            general: ['Nigeria', 'South Africa', 'Kenya', 'Egypt', 'Ghana']
        };

        const countryNames = typeMap[queryType] || typeMap.general;
        return africanCountries.filter(c => countryNames.includes(c.name));
    }

    extractInsights(items) {
        const insights = [];
        const snippets = items.slice(0, 10).map(item => item.description || '').join(' ');
        
        // Extract key phrases (simplified - in production, use NLP)
        const sentences = snippets.split(/[.!?]+/).filter(s => s.trim().length > 20);
        insights.push(...sentences.slice(0, 5));

        return insights;
    }

    matchCountriesToResults(countries, items) {
        return countries.map(country => {
            const countryNameLower = country.name.toLowerCase();
            const links = [];

            items.forEach(item => {
                const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
                if (text.includes(countryNameLower)) {
                    links.push({
                        title: item.title || 'Untitled',
                        url: item.url || '#',
                        description: item.description || '',
                        engine: item.engine || 'unknown'
                    });
                }
            });

            return {
                ...country,
                links: links.slice(0, 3)
            };
        });
    }

    identifyTrends(items) {
        const trends = [];
        const commonWords = new Map();

        items.slice(0, 10).forEach(item => {
            const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
            const words = text.split(/\s+/).filter(w => w.length > 4);
            words.forEach(word => {
                commonWords.set(word, (commonWords.get(word) || 0) + 1);
            });
        });

        // Get most common words (trending topics)
        const sorted = Array.from(commonWords.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word]) => word);

        trends.push(...sorted);

        return trends;
    }

    formatCountryList(countries) {
        if (countries.length === 0) return '';
        if (countries.length === 1) return countries[0];
        if (countries.length === 2) return `${countries[0]} and ${countries[1]}`;
        const last = countries[countries.length - 1];
        const rest = countries.slice(0, -1);
        return `${rest.join(', ')}, and ${last}`;
    }
}

export default new DeepThinkingService();

