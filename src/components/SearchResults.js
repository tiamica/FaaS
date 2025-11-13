export class SearchResults {
    constructor() {
        this.element = this.createResultsContainer();
    }

    createResultsContainer() {
        const container = document.createElement('div');
        container.className = 'results-container';
        container.innerHTML = `
            <div class="results-content">
                <div class="ai-response-section">
                    <h3 class="section-title">AI Insights</h3>
                    <div class="ai-response"></div>
                </div>
                <div class="countries-section">
                    <h3 class="section-title">Related African Nations</h3>
                    <div class="countries-grid"></div>
                </div>
                <div class="sources-section">
                    <h3 class="section-title">Additional Resources</h3>
                    <div class="sources-list"></div>
                </div>
            </div>
        `;
        return container;
    }

    displayResults(data) {
        this.displayAIResponse(data.answer);
        this.displayRelatedCountries(data.relatedCountries);
        this.displaySources(data.sources);
    }

    displayAIResponse(response) {
        const responseElement = this.element.querySelector('.ai-response');
        responseElement.innerHTML = `
            <div class="response-bubble">
                <div class="response-content">${response}</div>
                <div class="ai-badge">Fourier AI</div>
            </div>
        `;
    }

    displayRelatedCountries(countries) {
        const grid = this.element.querySelector('.countries-grid');
        grid.innerHTML = countries.map(country => `
            <div class="country-card">
                <div class="country-header">
                    <span class="country-flag">${country.flag}</span>
                    <h4 class="country-name">${country.name}</h4>
                </div>
                <div class="country-info">
                    <div class="info-item">
                        <span class="info-label">Capital:</span>
                        <span class="info-value">${country.capital}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Population:</span>
                        <span class="info-value">${country.population}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Economy:</span>
                        <span class="info-value">${country.gdp}</span>
                    </div>
                </div>
                <div class="key-sectors">
                    <strong>Key Sectors:</strong>
                    <div class="sectors-tags">
                        ${country.keySectors.map(sector => `<span class="sector-tag">${sector}</span>`).join('')}
                    </div>
                </div>
                <div class="positive-affirmation">
                    ${country.positiveAffirmation}
                </div>
            </div>
        `).join('');
    }

    displaySources(sources) {
        const sourcesList = this.element.querySelector('.sources-list');
        sourcesList.innerHTML = sources.map(source => `
            <div class="source-item">
                <a href="${source.url}" target="_blank" class="source-link">
                    <h4 class="source-title">${source.title}</h4>
                    <p class="source-description">${source.description}</p>
                </a>
            </div>
        `).join('');
    }

    showLoading() {
        const responseElement = this.element.querySelector('.ai-response');
        responseElement.innerHTML = `
            <div class="response-bubble loading">
                <div class="loading-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="loading-text">Fourier AI is analyzing African opportunities...</div>
            </div>
        `;
        
        this.element.querySelector('.countries-grid').innerHTML = '';
        this.element.querySelector('.sources-list').innerHTML = '';
    }

    showError(message) {
        const responseElement = this.element.querySelector('.ai-response');
        responseElement.innerHTML = `
            <div class="response-bubble error">
                <div class="error-content">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>${message}</span>
                </div>
            </div>
        `;
    }
}
