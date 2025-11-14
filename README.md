# Fourier Analytics AI Search (FaaS)

**The most intelligent search engine for Africa**

FaaS is an AI-powered search engine that focuses on providing positive, high-value business information and insights about Africa. The application integrates with Google Search to deliver real-time results while providing narratives about which African countries the content relates to.

## Features

- **Multi-Search Engine Integration**: Aggregates results from Google, Bing, and DuckDuckGo for comprehensive coverage
- **Deep Thinking AI**: Advanced multi-step reasoning similar to DeepSeek, Gemini, and ChatGPT, but Africa-focused
- **Intelligent Query Processing**: Breaks down queries into sub-queries for thorough analysis
- **AI-Powered Narratives**: Intelligent responses about African business and opportunities
- **Country-Specific Insights**: Detailed information about African nations with positive affirmations
- **Africa-Focused Content**: All results are tailored to highlight positive business opportunities in Africa
- **Clickable Links**: Related links in AI responses and country cards for easy exploration
- **Clean Interface**: Modern, responsive design with excellent UX
- **Smart Country Matching**: Automatically identifies which African countries are most relevant to search queries

## Technology Stack

- **Frontend**: Vanilla JavaScript with ES6+ modules
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **Search API**: Google Custom Search API
- **Build Tool**: Vite for fast development and building
- **HTTP Client**: Axios for API requests

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Search Engines (Optional but Recommended)

The application supports multiple search engines for comprehensive results. You can configure one or more:

#### Google Custom Search API

1. **Get Google API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Custom Search API"
   - Create credentials (API Key)
   - Copy your API key

2. **Create a Custom Search Engine**:
   - Go to [Google Custom Search](https://programmablesearchengine.google.com/)
   - Click "Add" to create a new search engine
   - In "Sites to search", you can enter `*` to search the entire web, or specific African-focused sites
   - Click "Create"
   - Copy your Search Engine ID (CX)

3. **Configure the Application**:

   **Option A: Environment Variables (Recommended for Production)**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_API_KEY=your_api_key_here
   VITE_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
   ```

   **Option B: Browser Local Storage (For Development)**
   
   The application will work without Google Search API configured, using enhanced simulated responses. To enable Google Search, you can set the API key and Search Engine ID in the browser's developer console:
   ```javascript
   localStorage.setItem('google_api_key', 'your_api_key_here');
   localStorage.setItem('google_search_engine_id', 'your_search_engine_id_here');
   ```

#### Bing Search API (Optional)

For even more comprehensive results, you can also configure Bing Search:

1. **Get Bing API Key**:
   - Go to [Azure Portal](https://portal.azure.com/)
   - Create a new "Bing Search v7" resource
   - Copy your API key

2. **Configure in Application**:
   
   **Option A: Environment Variables**
   ```env
   VITE_BING_API_KEY=your_bing_api_key_here
   ```
   
   **Option B: Browser Console**
   ```javascript
   localStorage.setItem('bing_api_key', 'your_bing_api_key_here');
   ```

**Note**: DuckDuckGo search works automatically without any API key configuration.

### 3. Run the Application

**Development Mode:**
```bash
npm run dev
```

The application will open automatically at `http://localhost:5173`

**Build for Production:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

## How It Works

### Deep Thinking Process

The application uses a sophisticated multi-step reasoning approach:

1. **Query Understanding**: Analyzes the query to understand intent, type, and key entities
2. **Africa Relevance Analysis**: Identifies relevant African countries and sectors
3. **Sub-Query Generation**: Creates multiple related queries for comprehensive coverage
4. **Multi-Engine Search**: Searches across Google, Bing, and DuckDuckGo simultaneously
5. **Result Aggregation**: Combines and deduplicates results from all engines
6. **Deep Analysis**: Extracts insights, trends, and patterns from aggregated results
7. **Narrative Generation**: Synthesizes findings into comprehensive Africa-focused narratives

### Result Display

Results are displayed with:
   - AI-generated narrative about the topic
   - Related African countries with detailed information
   - Clickable links in both the AI response and country cards
   - Positive affirmations for each country
   - Source links from multiple search engines

## Fallback Mode

If Google Search API is not configured, the application uses an enhanced simulated response system that:
- Analyzes the query for African country mentions
- Matches keywords to relevant countries
- Generates positive, business-focused narratives
- Provides country-specific information and affirmations

## Project Structure

```
FaaS/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── app.js              # Main application entry point
│   ├── components/
│   │   ├── SearchBar.js    # Search input component
│   │   ├── SearchResults.js # Results display component
│   │   └── CountryInfo.js  # Country information component
│   ├── services/
│   │   └── aiService.js    # Google Search and AI service
│   ├── data/
│   │   └── africanCountries.js # African countries data
│   ├── styles/
│   │   └── main.css        # Main stylesheet
│   └── utils/
│       └── config.js       # Configuration management
├── package.json
├── vite.config.js
└── README.md
```

## African Countries Coverage

The application includes detailed information about 10 major African countries:
- Nigeria
- South Africa
- Kenya
- Egypt
- Ghana
- Ethiopia
- Rwanda
- Morocco
- Tanzania
- Ivory Coast

Each country entry includes:
- Capital city
- Population
- GDP (PPP)
- Key economic sectors
- Positive business affirmations

## Customization

### Adding More Countries

Edit `src/data/africanCountries.js` to add more African countries with their information.

### Styling

Modify `src/styles/main.css` to customize the appearance. The CSS uses CSS variables for easy theming.

### Search Behavior

Modify `src/services/aiService.js` to customize how queries are processed and how narratives are generated.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please visit: https://github.com/tiamica/FaaS/issues
