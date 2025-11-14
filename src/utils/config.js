// Import API keys from config file
import { API_KEYS } from '../config/apiKeys.js';

// Configuration management for the application
export class Config {
    // Google Custom Search API Configuration
    // Priority: 1. Code config (apiKeys.js) > 2. Environment variables > 3. LocalStorage
    static getGoogleApiKey() {
        return API_KEYS.GOOGLE_API_KEY || 
               import.meta.env.VITE_GOOGLE_API_KEY || 
               localStorage.getItem('google_api_key') || 
               '';
    }

    static setGoogleApiKey(apiKey) {
        localStorage.setItem('google_api_key', apiKey);
    }

    static getGoogleSearchEngineId() {
        return API_KEYS.GOOGLE_SEARCH_ENGINE_ID || 
               import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID || 
               localStorage.getItem('google_search_engine_id') || 
               '';
    }

    static setGoogleSearchEngineId(engineId) {
        localStorage.setItem('google_search_engine_id', engineId);
    }

    static isGoogleSearchEnabled() {
        return !!(this.getGoogleApiKey() && this.getGoogleSearchEngineId());
    }

    // Bing Search API Configuration
    // Priority: 1. Code config (apiKeys.js) > 2. Environment variables > 3. LocalStorage
    static getBingApiKey() {
        return API_KEYS.BING_API_KEY || 
               import.meta.env.VITE_BING_API_KEY || 
               localStorage.getItem('bing_api_key') || 
               '';
    }

    static setBingApiKey(apiKey) {
        localStorage.setItem('bing_api_key', apiKey);
    }

    static isBingSearchEnabled() {
        return !!this.getBingApiKey();
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
