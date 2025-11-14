import axios from 'axios';
import { africanCountries, africanKeywords } from '../data/africanCountries.js';
import Config from '../utils/config.js';
import deepThinkingService from './deepThinkingService.js';
import multiSearchService from './multiSearchService.js';

class AIService {
    constructor() {
        this.googleSearchEnabled = false;
        this.useDeepThinking = true; // Enable deep thinking by default
    }

    /**
     * Main method to generate response with Deep Thinking and Multi-Search integration
     */
    async generateResponse(query) {
        try {
            // Use deep thinking approach for comprehensive results
            if (this.useDeepThinking) {
                try {
                    const deepThinkingResult = await deepThinkingService.thinkDeeply(query);
                    return this.processDeepThinkingResults(deepThinkingResult);
                } catch (error) {
                    console.warn('Deep thinking failed, falling back to standard search:', error.message);
                    // Fallback to standard multi-search
                    return await this.generateMultiSearchResponse(query);
                }
            }
            
            // Standard multi-search approach
            return await this.generateMultiSearchResponse(query);
        } catch (error) {
            console.error('Search error:', error);
            // Final fallback to enhanced simulated response
            return await this.generateEnhancedResponse(query);
        }
    }

    /**
     * Process deep thinking results into display format
     */
    processDeepThinkingResults(deepThinkingResult) {
        const { narrative, analysis, searchResults } = deepThinkingResult;
        
        // Extract sources from ranked items with engine info
        const sources = (searchResults.rankedItems || []).slice(0, 10).map(item => ({
            title: item.title || 'Untitled',
            url: item.url || '#',
            description: item.description || '',
            engine: item.engine || 'unknown'
        }));

        return {
            answer: narrative,
            relatedCountries: analysis.countriesWithLinks || [],
            sources: sources,
            searchResults: searchResults.rankedItems || [],
            reasoningSteps: deepThinkingResult.reasoningSteps // For debugging/insights
        };
    }

    /**
     * Generate response using multi-search (without deep thinking)
     */
    async generateMultiSearchResponse(query) {
        try {
            // Search across all engines
            const searchResults = await multiSearchService.searchAll(query);
            
            // Deduplicate and rank
            const unique = multiSearchService.deduplicateResults(searchResults.allItems);
            const ranked = multiSearchService.rankResults(unique, query);
            
            // Process results
            const relatedCountries = this.findRelatedCountriesFromResults(query, ranked);
            const narrative = this.generateCountryNarrative(query, ranked, relatedCountries);
            
            // Match sources to countries
            const countriesWithLinks = this.matchSourcesToCountries(relatedCountries, ranked);
            
            // Extract sources with engine info
            const sources = ranked.slice(0, 10).map(item => ({
                title: item.title || 'Untitled',
                url: item.url || '#',
                description: item.description || '',
                engine: item.engine || 'unknown'
            }));

            return {
                answer: narrative,
                relatedCountries: countriesWithLinks,
                sources: sources,
                searchResults: ranked
            };
        } catch (error) {
            console.error('Multi-search failed:', error);
            throw error;
        }
    }

    /**
     * Perform Google Custom Search API call
     */
    async performGoogleSearch(query) {
        const apiKey = Config.getGoogleApiKey();
        const searchEngineId = Config.getGoogleSearchEngineId();
        
        if (!apiKey || !searchEngineId) {
            throw new Error('Google Search API not configured');
        }

        // Enhance query with Africa-focused terms
        const enhancedQuery = this.enhanceQueryForAfrica(query);
        
        const url = 'https://www.googleapis.com/customsearch/v1';
        const params = {
            key: apiKey,
            cx: searchEngineId,
            q: enhancedQuery,
            num: 10,
            safe: 'active',
            fields: 'items(title,link,snippet,htmlSnippet),searchInformation'
        };

        try {
            const response = await axios.get(url, { params });
            
            // Check if response has error
            if (response.data.error) {
                console.error('Google Search API error:', response.data.error);
                throw new Error(response.data.error.message || 'Google Search API error');
            }
            
            // Ensure we have items
            if (!response.data.items || response.data.items.length === 0) {
                throw new Error('No search results found');
            }
            
            return response.data;
        } catch (error) {
            console.error('Google Search API error:', error);
            
            // Provide more helpful error messages
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    throw new Error('Invalid search request. Please check your API configuration.');
                } else if (status === 403) {
                    throw new Error('Google Search API access denied. Please check your API key and billing.');
                } else if (status === 429) {
                    throw new Error('Google Search API quota exceeded. Please try again later.');
                } else {
                    throw new Error(`Google Search API error: ${status}`);
                }
            } else if (error.request) {
                throw new Error('Unable to connect to Google Search API. Please check your internet connection.');
            } else {
                throw error;
            }
        }
    }

    /**
     * Enhance search query with Africa-focused terms
     */
    enhanceQueryForAfrica(query) {
        const lowerQuery = query.toLowerCase();
        
        // List of African country names and related terms
        const africanTerms = africanCountries.map(c => c.name.toLowerCase());
        africanTerms.push('africa', 'african');
        
        // Check if query already mentions Africa or any African country
        const hasAfricaContext = africanTerms.some(term => lowerQuery.includes(term));
        
        // If no Africa context, enhance the query
        if (!hasAfricaContext) {
            // Add Africa context while preserving original query intent
            return `${query} Africa business opportunities investment`;
        }
        
        // If Africa context exists, ensure it's business-focused
        const businessTerms = ['business', 'investment', 'opportunity', 'economy', 'market', 'sector', 'industry', 'growth', 'development'];
        const hasBusinessContext = businessTerms.some(term => lowerQuery.includes(term));
        
        if (!hasBusinessContext) {
            return `${query} business opportunities Africa`;
        }
        
        return query;
    }

    /**
     * Process Google Search results and generate Africa-focused narrative
     */
    processGoogleResults(query, googleData) {
        const items = googleData.items || [];
        const relatedCountries = this.findRelatedCountriesFromResults(query, items);
        
        // Generate narrative based on search results
        const narrative = this.generateCountryNarrative(query, items, relatedCountries);
        
        // Extract sources from Google results
        const sources = items.slice(0, 10).map(item => ({
            title: item.title || 'Untitled',
            url: item.link || '#',
            description: item.snippet || item.htmlSnippet || ''
        }));

        // Match sources to countries
        const countriesWithLinks = this.matchSourcesToCountries(relatedCountries, items);

        return {
            answer: narrative,
            relatedCountries: countriesWithLinks,
            sources: sources,
            searchResults: items
        };
    }

    /**
     * Match sources to countries based on country mentions in search results
     */
    matchSourcesToCountries(countries, items) {
        return countries.map(country => {
            const countryNameLower = country.name.toLowerCase();
            const countryLinks = [];
            
            // Find items that mention this country
            items.forEach(item => {
                const text = `${item.title || ''} ${item.snippet || ''}`.toLowerCase();
                if (text.includes(countryNameLower)) {
                    countryLinks.push({
                        title: item.title || 'Untitled',
                        url: item.link || '#',
                        description: item.snippet || item.htmlSnippet || ''
                    });
                }
            });
            
            // Limit to top 3 links per country
            return {
                ...country,
                links: countryLinks.slice(0, 3)
            };
        });
    }

    /**
     * Find related African countries from search results
     */
    findRelatedCountriesFromResults(query, items) {
        const countryMatches = new Map();
        const lowerQuery = query.toLowerCase();
        
        // Check query for country names (exact and partial matches)
        africanCountries.forEach(country => {
            const countryNameLower = country.name.toLowerCase();
            if (lowerQuery.includes(countryNameLower)) {
                countryMatches.set(country.name, { country, score: 10 });
            }
            // Also check for partial matches
            const countryWords = countryNameLower.split(' ');
            countryWords.forEach(word => {
                if (word.length > 3 && lowerQuery.includes(word)) {
                    const existing = countryMatches.get(country.name);
                    const score = existing ? existing.score + 2 : 3;
                    countryMatches.set(country.name, { country, score });
                }
            });
        });

        // Check search results for country mentions
        items.forEach(item => {
            const text = `${item.title || ''} ${item.snippet || ''}`.toLowerCase();
            africanCountries.forEach(country => {
                const countryNameLower = country.name.toLowerCase();
                if (text.includes(countryNameLower)) {
                    const existing = countryMatches.get(country.name);
                    const score = existing ? existing.score + 2 : 2;
                    countryMatches.set(country.name, { country, score });
                }
            });
        });

        // Check for keywords
        Object.entries(africanKeywords).forEach(([keyword, countries]) => {
            if (lowerQuery.includes(keyword)) {
                countries.forEach(countryName => {
                    const country = africanCountries.find(c => c.name === countryName);
                    if (country) {
                        const existing = countryMatches.get(country.name);
                        const score = existing ? existing.score + 3 : 3;
                        countryMatches.set(country.name, { country, score });
                    }
                });
            }
        });

        // Sort by score and return top countries
        const sorted = Array.from(countryMatches.values())
            .sort((a, b) => b.score - a.score)
            .map(item => item.country);

        // If no specific countries found, return top African innovators
        return sorted.length > 0 ? sorted.slice(0, 5) : this.getTopAfricanCountries();
    }

    /**
     * Get top African countries for general queries
     */
    getTopAfricanCountries() {
        const topCountries = ['Nigeria', 'South Africa', 'Kenya', 'Egypt', 'Ghana'];
        return africanCountries.filter(c => topCountries.includes(c.name));
    }

    /**
     * Generate narrative about African countries based on search results
     */
    generateCountryNarrative(query, items, countries) {
        let narrative = `Based on current information about "${query}", `;
        
        if (countries.length > 0) {
            const countryNames = countries.map(c => c.name);
            narrative += `this topic is particularly relevant to ${this.formatCountryList(countryNames)}. `;
            
            // Add country-specific insights
            countries.slice(0, 3).forEach((country, index) => {
                narrative += `${country.name} ${country.positiveAffirmation} `;
            });
        } else {
            // If no specific countries found, provide general Africa-focused narrative
            narrative += `this topic presents significant opportunities across the African continent. `;
        }

        // Add insights from search results if available
        if (items.length > 0) {
            // Extract key information from top search results
            const topSnippets = items.slice(0, 3)
                .map(item => item.snippet || item.htmlSnippet || '')
                .filter(snippet => snippet.length > 0)
                .join(' ');
            
            if (topSnippets.length > 0) {
                // Clean HTML tags from snippets
                const cleanSnippets = topSnippets.replace(/<[^>]*>/g, '').substring(0, 300);
                narrative += ` Current information indicates: ${cleanSnippets}... `;
            }
        }

        // Add positive business affirmation
        narrative += `Africa continues to demonstrate remarkable resilience and innovation, `;
        narrative += `offering exceptional opportunities for investment, partnership, and growth. `;
        narrative += `The continent's diverse economies, young population, and entrepreneurial spirit `;
        narrative += `position it as a leading destination for high-value business opportunities. `;
        narrative += `Recent developments show positive trends across multiple sectors, `;
        narrative += `reinforcing Africa's position as a dynamic and promising market.`;

        return narrative;
    }

    /**
     * Format country list for natural language
     */
    formatCountryList(countries) {
        if (countries.length === 0) return '';
        if (countries.length === 1) return countries[0];
        if (countries.length === 2) return `${countries[0]} and ${countries[1]}`;
        const last = countries[countries.length - 1];
        const rest = countries.slice(0, -1);
        return `${rest.join(', ')}, and ${last}`;
    }

    /**
     * Enhanced simulated response (fallback when Google Search is not available)
     */
    async generateEnhancedResponse(query) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const lowerQuery = query.toLowerCase();
        const relatedCountries = this.findRelatedCountries(lowerQuery);
        
        const narrative = this.createPositiveNarrative(query, relatedCountries);
        
        // Add links to countries from general sources
        const sources = this.findRelevantSources(lowerQuery);
        const countriesWithLinks = relatedCountries.map(country => ({
            ...country,
            links: sources.slice(0, 2) // Add 2 general links to each country
        }));
        
        return {
            answer: narrative,
            relatedCountries: countriesWithLinks,
            sources: sources
        };
    }

    /**
     * Find related countries from query
     */
    findRelatedCountries(query) {
        const related = new Set();
        
        // Check for country names
        africanCountries.forEach(country => {
            const countryNameLower = country.name.toLowerCase();
            if (query.includes(countryNameLower)) {
                related.add(country);
            }
        });
        
        // Check for keywords
        Object.entries(africanKeywords).forEach(([keyword, countries]) => {
            if (query.includes(keyword)) {
                countries.forEach(countryName => {
                    const country = africanCountries.find(c => c.name === countryName);
                    if (country) related.add(country);
                });
            }
        });
        
        // If no specific countries found, return top African innovators
        if (related.size === 0) {
            return this.getTopAfricanCountries();
        }
        
        return Array.from(related).slice(0, 5);
    }

    /**
     * Create positive narrative about Africa
     */
    createPositiveNarrative(query, countries) {
        const businessThemes = [
            "showing remarkable growth and innovation in",
            "leading the continent in business development and",
            "demonstrating exceptional progress in",
            "pioneering new opportunities in",
            "showcasing Africa's potential through",
            "emerging as a leader in"
        ];
        
        const theme = businessThemes[Math.floor(Math.random() * businessThemes.length)];
        
        let narrative = `Africa is ${theme} ${query}. `;
        
        if (countries.length > 0) {
            narrative += `This is particularly evident in countries like ${this.formatCountryList(countries.map(c => c.name))} `;
            narrative += `where innovation meets opportunity across various sectors including `;
            
            const sectors = new Set();
            countries.forEach(country => {
                country.keySectors.forEach(sector => sectors.add(sector));
            });
            
            const sectorArray = Array.from(sectors).slice(0, 4);
            if (sectorArray.length > 0) {
                narrative += sectorArray.join(', ');
                narrative += ". ";
            }
        }
        
        countries.slice(0, 3).forEach(country => {
            narrative += `${country.name} ${country.positiveAffirmation} `;
        });
        
        narrative += "The African continent continues to demonstrate resilience, innovation, and tremendous growth potential, ";
        narrative += "making it an ideal destination for investment and partnership opportunities. ";
        narrative += "With a young and dynamic population, abundant natural resources, and increasing digital connectivity, ";
        narrative += "Africa represents one of the world's most promising markets for sustainable business growth.";

        return narrative;
    }

    /**
     * Find relevant sources
     */
    findRelevantSources(query) {
        const sources = [
            {
                title: "African Development Bank Group",
                url: "https://www.afdb.org",
                description: "Latest reports on African economic outlook and development opportunities"
            },
            {
                title: "Africa Investment Forum",
                url: "https://www.africainvestmentforum.com",
                description: "Investment opportunities and partnerships across Africa"
            },
            {
                title: "African Union",
                url: "https://au.int",
                description: "Pan-African organization promoting unity, development, and economic integration"
            },
            {
                title: "World Bank - Africa",
                url: "https://www.worldbank.org/en/region/afr",
                description: "Economic data and development projects across African countries"
            }
        ];
        
        return sources;
    }
}

export default new AIService();
