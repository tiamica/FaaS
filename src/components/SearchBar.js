export class SearchBar {
    constructor(onSearch) {
        this.onSearch = onSearch;
        this.element = this.createSearchBar();
        this.setupEventListeners();
    }

    createSearchBar() {
        const container = document.createElement('div');
        container.className = 'search-bar-container';
        container.innerHTML = `
            <div class="search-header">
                <div class="logo-section">
                    <h1 class="app-title">Fourier Analytics AI Search</h1>
                    <p class="app-tagline">The most intelligent search engine for Africa</p>
                </div>
            </div>
            <div class="search-input-wrapper">
                <div class="search-box">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input 
                        type="text" 
                        id="searchInput" 
                        class="search-input" 
                        placeholder="Search for business opportunities, investments, or information about Africa..."
                        autocomplete="off"
                    />
                    <button id="searchButton" class="search-button" aria-label="Search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        return container;
    }

    setupEventListeners() {
        const searchInput = this.element.querySelector('#searchInput');
        const searchButton = this.element.querySelector('#searchButton');

        if (!searchInput || !searchButton) {
            console.error('Search input or button not found');
            return;
        }

        // Search on button click
        searchButton.addEventListener('click', () => {
            this.performSearch();
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Clear loading state on input change
        searchInput.addEventListener('input', () => {
            if (this.isLoading) {
                this.setLoading(false);
            }
        });
    }

    performSearch() {
        const searchInput = this.element.querySelector('#searchInput');
        const query = searchInput.value.trim();
        
        if (query.length === 0) {
            return;
        }

        this.onSearch(query);
    }

    setLoading(loading) {
        this.isLoading = loading;
        const searchButton = this.element.querySelector('#searchButton');
        const searchInput = this.element.querySelector('#searchInput');
        
        if (!searchButton || !searchInput) {
            console.error('Search button or input not found');
            return;
        }
        
        if (loading) {
            searchButton.disabled = true;
            searchInput.disabled = true;
            searchButton.innerHTML = `
                <div class="spinner"></div>
            `;
        } else {
            searchButton.disabled = false;
            searchInput.disabled = false;
            searchButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            `;
        }
    }

    getQuery() {
        return this.element.querySelector('#searchInput').value.trim();
    }

    clear() {
        this.element.querySelector('#searchInput').value = '';
    }
}

