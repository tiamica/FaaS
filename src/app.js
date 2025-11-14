import { SearchBar } from './components/SearchBar.js';
import { SearchResults } from './components/SearchResults.js';
import AIService from './services/aiService.js';

class FourierAnalyticsAISearch {
    constructor() {
        this.searchBar = new SearchBar(this.handleSearch.bind(this));
        this.searchResults = new SearchResults();
        this.isLoading = false;
        
        this.init();
    }

    init() {
        const appElement = document.getElementById('app');
        
        if (!appElement) {
            console.error('App element not found. Make sure there is an element with id="app" in the HTML.');
            return;
        }
        
        // Create main structure
        appElement.innerHTML = `
            <div class="main-header"></div>
            <main class="main-content"></main>
        `;

        // Append components properly to preserve event listeners
        const headerElement = appElement.querySelector('.main-header');
        const mainElement = appElement.querySelector('.main-content');
        
        if (!headerElement || !mainElement) {
            console.error('Failed to create main structure elements');
            return;
        }
        
        headerElement.appendChild(this.searchBar.element);
        mainElement.appendChild(this.searchResults.element);

        // Display welcome message
        this.showWelcomeMessage();
    }

    async showWelcomeMessage() {
        // Show welcome message initially using SearchResults method
        this.searchResults.showWelcomeMessage();
        // Clear AI response to show blank/pending state
        this.searchResults.clearAIResponse();
    }

    async handleSearch(query) {
        if (this.isLoading) return;
        
        if (!query || query.trim().length === 0) {
            return;
        }
        
        this.isLoading = true;
        this.searchBar.setLoading(true);
        this.searchResults.showLoading();

        try {
            const trimmedQuery = query.trim();
            console.log('Searching for:', trimmedQuery);
            
            const results = await AIService.generateResponse(trimmedQuery);
            
            console.log('Search results received:', {
                hasAnswer: !!results?.answer,
                countriesCount: results?.relatedCountries?.length || 0,
                sourcesCount: results?.sources?.length || 0
            });
            
            // Ensure results have required structure
            if (!results || !results.answer) {
                throw new Error('Invalid response format');
            }
            
            // Ensure relatedCountries is an array
            if (!Array.isArray(results.relatedCountries)) {
                results.relatedCountries = [];
            }
            
            // Ensure sources is an array
            if (!Array.isArray(results.sources)) {
                results.sources = [];
            }
            
            this.searchResults.displayResults(results);
        } catch (error) {
            console.error('Search error:', error);
            const errorMessage = error.message || 'Unable to generate response. Please try again.';
            this.searchResults.showError(errorMessage);
        } finally {
            this.isLoading = false;
            this.searchBar.setLoading(false);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FourierAnalyticsAISearch();
});
