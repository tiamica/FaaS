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
        
        // Create main layout
        appElement.innerHTML = `
            <div class="main-header">
                ${this.searchBar.element.outerHTML}
            </div>
            <main class="main-content">
                ${this.searchResults.element.outerHTML}
            </main>
        `;

        // Re-initialize search bar with proper event listeners
        this.searchBar = new SearchBar(this.handleSearch.bind(this));
        appElement.querySelector('.main-header').innerHTML = '';
        appElement.querySelector('.main-header').appendChild(this.searchBar.element);
    }

    async handleSearch(query) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.searchBar.setLoading(true);
        this.searchResults.showLoading();

        try {
            const results = await AIService.generateResponse(query);
            this.searchResults.displayResults(results);
        } catch (error) {
            console.error('Search error:', error);
            this.searchResults.showError('Unable to generate response. Please try again.');
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

// Add some sample data display on initial load
document.addEventListener('DOMContentLoaded', () => {
    // Display welcome message after a short delay
    setTimeout(() => {
        const welcomeQuery = "business opportunities in Africa";
        AIService.generateResponse(welcomeQuery).then(results => {
            const searchResults = document.querySelector('.results-container');
            if (searchResults && !searchResults.querySelector('.ai-response').innerHTML.includes('response-bubble')) {
                const resultsComponent = new SearchResults();
                resultsComponent.displayResults(results);
                document.querySelector('.results-container').innerHTML = resultsComponent.element.innerHTML;
            }
        });
    }, 500);
});
