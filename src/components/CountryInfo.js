export class CountryInfo {
    constructor(country) {
        this.country = country;
        this.element = this.createCountryElement();
    }

    createCountryElement() {
        const element = document.createElement('div');
        element.className = 'country-info';
        element.innerHTML = this.generateHTML();
        return element;
    }

    generateHTML() {
        return `
            <div class="country-card">
                <div class="country-header">
                    <span class="country-flag">${this.country.flag}</span>
                    <h3 class="country-name">${this.country.name}</h3>
                </div>
                <div class="country-details">
                    <div class="detail-item">
                        <span class="detail-label">Capital:</span>
                        <span class="detail-value">${this.country.capital}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Population:</span>
                        <span class="detail-value">${this.country.population}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">GDP (PPP):</span>
                        <span class="detail-value">${this.country.gdp}</span>
                    </div>
                </div>
                <div class="key-sectors">
                    <h4>Key Economic Sectors</h4>
                    <div class="sectors-list">
                        ${this.country.keySectors.map(sector => 
                            `<span class="sector-tag">${sector}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="positive-outlook">
                    <h4>Positive Outlook</h4>
                    <p>${this.country.positiveAffirmation}</p>
                </div>
            </div>
        `;
    }
}
