# Fourier Analytics AI Search (FaaS)

**The most intelligent search engine for Africa**

FaaS is an AI-powered search engine that focuses on providing positive, high-value business information and insights about Africa. The application integrates with Google Search to deliver real-time results while providing narratives about which African countries the content relates to.

## Features

- **Google Search Integration**: Real-time search results from Google Custom Search API
- **AI-Powered Narratives**: Intelligent responses about African business and opportunities
- **Country-Specific Insights**: Detailed information about African nations with positive affirmations
- **Africa-Focused Content**: All results are tailored to highlight positive business opportunities in Africa
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

### 2. Configure Google Custom Search API

To enable Google Search functionality, you need to set up Google Custom Search API:

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

1. **User enters a search query** in the search bar
2. **Query is enhanced** with Africa-focused terms if not already present
3. **Google Search API** is called (if configured) to get real-time results
4. **AI Service processes results** to identify relevant African countries
5. **Narrative is generated** highlighting positive business opportunities
6. **Results are displayed** with:
   - AI-generated narrative about the topic
   - Related African countries with detailed information
   - Positive affirmations for each country
   - Source links from Google Search results

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
