import { getFlagImage } from '../utils/flagUtils.js';

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
        if (!data) {
            this.showError('No results returned. Please try again.');
            return;
        }
        
        // Display AI response with links
        if (data.answer) {
            this.displayAIResponse(data.answer, data.sources);
        } else {
            this.displayAIResponse('No response generated. Please try a different search query.', data.sources);
        }
        
        // Display related countries
        if (data.relatedCountries && Array.isArray(data.relatedCountries) && data.relatedCountries.length > 0) {
            this.displayRelatedCountries(data.relatedCountries);
        } else {
            this.element.querySelector('.countries-grid').innerHTML = 
                '<p style="color: var(--text-light); text-align: center; padding: 2rem;">No specific countries identified for this search.</p>';
        }
        
        // Display sources
        if (data.sources && Array.isArray(data.sources) && data.sources.length > 0) {
            this.displaySources(data.sources);
        } else {
            this.element.querySelector('.sources-list').innerHTML = 
                '<p style="color: var(--text-light); text-align: center; padding: 1rem;">No additional sources available.</p>';
        }
    }

    displayAIResponse(response, sources = []) {
        const responseElement = this.element.querySelector('.ai-response');
        if (!responseElement) {
            console.error('AI response element not found');
            return;
        }
        
        // Escape HTML to prevent XSS (though response should be trusted)
        const safeResponse = String(response || 'No response available');
        
        // Create clickable links section if sources are available
        let linksSection = '';
        if (sources && Array.isArray(sources) && sources.length > 0) {
            const topLinks = sources.slice(0, 5); // Show top 5 links
            linksSection = `
                <div class="response-links">
                    <strong style="display: block; margin-top: 1rem; margin-bottom: 0.5rem; color: var(--text-dark); font-size: 0.9rem;">Related Links:</strong>
                    <div class="links-list">
                        ${topLinks.map(link => {
                            const engine = link.engine || 'unknown';
                            const engineBadge = engine !== 'unknown' ? `<span class="engine-badge engine-${engine}">${engine}</span>` : '';
                            return `
                                <a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer" class="response-link">
                                    <span class="link-icon">🔗</span>
                                    <span class="link-text">${link.title || 'Untitled'}</span>
                                    ${engineBadge}
                                </a>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        responseElement.innerHTML = `
            <div class="response-bubble">
                <div class="response-content">${safeResponse}</div>
                ${linksSection}
                <div class="ai-badge">Fourier AI</div>
            </div>
        `;
    }

    displayRelatedCountries(countries) {
        const grid = this.element.querySelector('.countries-grid');
        if (!grid) {
            console.error('Countries grid element not found');
            return;
        }
        
        if (!Array.isArray(countries) || countries.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 2rem;">No specific countries identified for this search.</p>';
            return;
        }
        
        grid.innerHTML = countries.map(country => {
            if (!country) return '';
            const name = country.name || 'Unknown';
            const flagImage = getFlagImage(name, 'w80');
            const capital = country.capital || 'N/A';
            const population = country.population || 'N/A';
            const gdp = country.gdp || 'N/A';
            const keySectors = Array.isArray(country.keySectors) ? country.keySectors : [];
            const affirmation = country.positiveAffirmation || 'A country with great potential.';
            const links = Array.isArray(country.links) ? country.links : [];
            const rulingParty = country.rulingParty || 'N/A';
            const leader = country.leader || 'N/A';
            
            // Create links section for country
            let linksSection = '';
            if (links.length > 0) {
                linksSection = `
                    <div class="country-links">
                        <strong style="display: block; margin-top: 1rem; margin-bottom: 0.5rem; color: var(--text-dark); font-size: 0.85rem;">Related Links:</strong>
                        <div class="country-links-list">
                            ${links.map(link => {
                                const engine = link.engine || 'unknown';
                                const engineBadge = engine !== 'unknown' ? `<span class="engine-badge engine-${engine}">${engine}</span>` : '';
                                return `
                                    <a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer" class="country-link">
                                        <span class="link-icon">🔗</span>
                                        <span class="link-text">${link.title || 'Untitled'}</span>
                                        ${engineBadge}
                                    </a>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
            
            return `
                <div class="country-card">
                    <div class="country-header">
                        <div class="country-flag-container">${flagImage}</div>
                        <h4 class="country-name">${name}</h4>
                    </div>
                    <div class="country-info">
                        <div class="info-item">
                            <span class="info-label">Capital:</span>
                            <span class="info-value">${capital}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Population:</span>
                            <span class="info-value">${population}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Economy:</span>
                            <span class="info-value">${gdp}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Ruling Party:</span>
                            <span class="info-value">${rulingParty}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Leader:</span>
                            <span class="info-value">${leader}</span>
                        </div>
                    </div>
                    <div class="key-sectors">
                        <strong>Key Sectors:</strong>
                        <div class="sectors-tags">
                            ${keySectors.map(sector => `<span class="sector-tag">${sector}</span>`).join('')}
                        </div>
                    </div>
                    <div class="positive-affirmation">
                        ${affirmation}
                    </div>
                    ${linksSection}
                </div>
            `;
        }).filter(html => html).join('');
    }

    displaySources(sources) {
        const sourcesList = this.element.querySelector('.sources-list');
        if (!sourcesList) {
            console.error('Sources list element not found');
            return;
        }
        
        if (!Array.isArray(sources) || sources.length === 0) {
            sourcesList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 1rem;">No additional sources available.</p>';
            return;
        }
        
        sourcesList.innerHTML = sources.map(source => {
            if (!source) return '';
            const url = source.url || '#';
            const title = source.title || 'Untitled';
            const description = source.description || 'No description available';
            const engine = source.engine || 'unknown';
            const engineBadge = engine !== 'unknown' ? `<span class="engine-badge engine-${engine}">${engine}</span>` : '';
            
            return `
                <div class="source-item">
                    <a href="${url}" target="_blank" rel="noopener noreferrer" class="source-link">
                        <div style="display: flex; justify-content: space-between; align-items: start; gap: 0.5rem;">
                            <div style="flex: 1;">
                                <h4 class="source-title">${title}</h4>
                                <p class="source-description">${description}</p>
                            </div>
                            ${engineBadge}
                        </div>
                    </a>
                </div>
            `;
        }).filter(html => html).join('');
    }

    showLoading() {
        const responseElement = this.element.querySelector('.ai-response');
        if (responseElement) {
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
        }
        
        const countriesGrid = this.element.querySelector('.countries-grid');
        if (countriesGrid) {
            countriesGrid.innerHTML = '';
        }
        
        const sourcesList = this.element.querySelector('.sources-list');
        if (sourcesList) {
            sourcesList.innerHTML = '';
        }
    }

    showError(message) {
        const responseElement = this.element.querySelector('.ai-response');
        if (!responseElement) {
            console.error('AI response element not found for error display');
            return;
        }
        
        const errorMessage = String(message || 'An error occurred');
        responseElement.innerHTML = `
            <div class="response-bubble error">
                <div class="error-content">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>${errorMessage}</span>
                </div>
            </div>
        `;
    }

    showWelcomeMessage() {
        const responseElement = this.element.querySelector('.ai-response');
        if (responseElement) {
            responseElement.innerHTML = `
                <div class="response-bubble">
                    <div class="response-content" style="text-align: center; padding: 2rem 1rem;">
                        <h2 style="font-size: 2rem; margin-bottom: 1rem; font-weight: 600; color: var(--text-dark);">Welcome to Fourier Analytics AI Search</h2>
                        <p style="font-size: 1.1rem; color: var(--text-light); margin-bottom: 0.5rem;">The most intelligent search engine for Africa</p>
                        <p style="margin-top: 1rem; font-size: 0.95rem; color: var(--text-muted);">
                            Search for business opportunities, investments, and information about Africa
                        </p>
                    </div>
                    <div class="ai-badge">Fourier AI</div>
                </div>
            `;
        }
        
        // Clear countries and sources sections
        const countriesGrid = this.element.querySelector('.countries-grid');
        if (countriesGrid) {
            countriesGrid.innerHTML = 
                '<p style="color: var(--text-light); text-align: center; padding: 2rem;">Start searching to discover African business opportunities...</p>';
        }
        
        const sourcesList = this.element.querySelector('.sources-list');
        if (sourcesList) {
            sourcesList.innerHTML = 
                '<p style="color: var(--text-light); text-align: center; padding: 1rem;">Search results will appear here.</p>';
        }
    }

    clearAIResponse() {
        const responseElement = this.element.querySelector('.ai-response');
        if (responseElement) {
            responseElement.innerHTML = `
                <div class="response-bubble">
                    <div class="response-content" style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
                        <p>AI insights will appear here after search...</p>
                    </div>
                </div>
            `;
        }
    }
}
