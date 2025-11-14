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
        
        // Create main structure
        appElement.innerHTML = `
            <div class="main-header"></div>
            <main class="main-content"></main>
        `;

        // Append components properly to preserve event listeners
        const headerElement = appElement.querySelector('.main-header');
        const mainElement = appElement.querySelector('.main-content');
        
        headerElement.appendChild(this.searchBar.element);
        mainElement.appendChild(this.searchResults.element);

        // Display welcome message
        this.showWelcomeMessage();
    }

    async showWelcomeMessage() {
        // Show welcome message initially
        const resultsContainer = document.querySelector('.results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem 1rem; color: var(--text-dark);">
                    <h2 style="font-size: 2rem; margin-bottom: 1rem; font-weight: 600; color: var(--text-dark);">Welcome to Fourier Analytics AI Search</h2>
                    <p style="font-size: 1.1rem; color: var(--text-light); margin-bottom: 0.5rem;">The most intelligent search engine for Africa</p>
                    <p style="margin-top: 1rem; font-size: 0.95rem; color: var(--text-muted);">
                        Search for business opportunities, investments, and information about Africa
                    </p>
                </div>
            `;
        }

        // Load initial results after a short delay
        setTimeout(async () => {
            const welcomeQuery = "business opportunities in Africa";
            try {
                const results = await AIService.generateResponse(welcomeQuery);
                this.searchResults.displayResults(results);
            } catch (error) {
                console.error('Welcome message error:', error);
            }
        }, 1500);
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
            const results = await AIService.generateResponse(query.trim());
            
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
