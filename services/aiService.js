import { africanCountries, africanKeywords } from '../data/africanCountries.js';

class AIService {
    constructor() {
        this.baseURLs = {
            huggingface: 'https://api-inference.huggingface.co/models',
            together: 'https://api.together.xyz/v1'
        };
    }

    // Simulated AI response - in production, you'd integrate with actual LLM APIs
    async generateResponse(query) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const lowerQuery = query.toLowerCase();
        const relatedCountries = this.findRelatedCountries(lowerQuery);
        
        // Generate positive, business-focused response
        const response = this.createPositiveResponse(query, relatedCountries);
        
        return {
            answer: response,
            relatedCountries: relatedCountries,
            sources: this.findRelevantSources(lowerQuery)
        };
    }

    findRelatedCountries(query) {
        const related = new Set();
        
        // Check for country names
        africanCountries.forEach(country => {
            if (query.includes(country.name.toLowerCase())) {
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
            return africanCountries.slice(0, 3);
        }
        
        return Array.from(related);
    }

    createPositiveResponse(query, countries) {
        const businessThemes = [
            "showing remarkable growth and innovation in",
            "leading the continent in business development and",
            "demonstrating exceptional progress in",
            "pioneering new opportunities in",
            "showcasing Africa's potential through"
        ];
        
        const theme = businessThemes[Math.floor(Math.random() * businessThemes.length)];
        
        let response = `Africa is ${theme} ${query}. `;
        
        if (countries.length > 0) {
            response += `This is particularly evident in countries like ${countries.map(c => c.name).join(', ')} `;
            response += `where innovation meets opportunity across various sectors including `;
            
            const sectors = new Set();
            countries.forEach(country => {
                country.keySectors.forEach(sector => sectors.add(sector));
            });
            
            response += Array.from(sectors).slice(0, 4).join(', ');
            response += ". ";
        }
        
        response += "The African continent continues to demonstrate resilience, innovation, and tremendous growth potential, making it an ideal destination for investment and partnership opportunities.";
        
        return response;
    }

    findRelevantSources(query) {
        const sources = [
            {
                title: "African Development Bank Group",
                url: "https://www.afdb.org",
                description: "Latest reports on African economic outlook"
            },
            {
                title: "Africa Investment Forum",
                url: "https://www.africainvestmentforum.com",
                description: "Investment opportunities across Africa"
            },
            {
                title: "African Union Development Agency",
                url: "https://www.nepad.org",
                description: "Development initiatives and success stories"
            }
        ];
        
        return sources.slice(0, 2);
    }

    // Method to integrate with actual free LLM APIs (commented for implementation)
    /*
    async queryHuggingFaceAPI(query) {
        try {
            const response = await fetch(`${this.baseURLs.huggingface}/microsoft/DialoGPT-large`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_HUGGING_FACE_TOKEN',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: `Provide positive, business-focused information about Africa regarding: ${query}. Focus on growth, opportunities, and success stories.`
                })
            });
            
            const result = await response.json();
            return result[0]?.generated_text || 'Unable to generate response at this time.';
        } catch (error) {
            console.error('HuggingFace API error:', error);
            return this.generateResponse(query);
        }
    }
    */
}

export default new AIService();
