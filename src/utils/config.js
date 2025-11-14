// Configuration management for the application
export class Config {
    // Google Custom Search API Configuration
    static getGoogleApiKey() {
        return localStorage.getItem('google_api_key') || import.meta.env.VITE_GOOGLE_API_KEY;
    }

    static setGoogleApiKey(apiKey) {
        localStorage.setItem('google_api_key', apiKey);
    }

    static getGoogleSearchEngineId() {
        return localStorage.getItem('google_search_engine_id') || import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;
    }

    static setGoogleSearchEngineId(engineId) {
        localStorage.setItem('google_search_engine_id', engineId);
    }

    static isGoogleSearchEnabled() {
        return !!(this.getGoogleApiKey() && this.getGoogleSearchEngineId());
    }

    // Legacy DeepSeek API Configuration (kept for backward compatibility)
    static getApiKey() {
        return localStorage.getItem('deepseek_api_key');
    }

    static setApiKey(apiKey) {
        localStorage.setItem('deepseek_api_key', apiKey);
    }

    static clearApiKey() {
        localStorage.removeItem('deepseek_api_key');
        localStorage.removeItem('google_api_key');
        localStorage.removeItem('google_search_engine_id');
    }

    static isAiEnabled() {
        return !!this.getApiKey();
    }

    static getApiConfig() {
        return {
            baseURL: 'https://api.deepseek.com/v1',
            model: 'deepseek-chat',
            maxTokens: 1000,
            temperature: 0.7
        };
    }
}

export default Config;
