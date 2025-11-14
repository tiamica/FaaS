# Setup Guide for Fourier Analytics AI Search (FaaS)

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Google Search API (Optional but Recommended)**

   The application works without Google Search API, but for real-time search results, you'll need to configure it.

   **Step 1: Get Google API Key**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable "Custom Search API"
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy your API key

   **Step 2: Create Custom Search Engine**
   - Visit [Google Custom Search](https://programmablesearchengine.google.com/)
   - Click "Add" to create new search engine
   - In "Sites to search", enter `*` to search entire web
   - Click "Create"
   - Copy your Search Engine ID (CX)

   **Step 3: Configure in Application**

   **Option A: Environment Variables (Recommended)**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_API_KEY=your_api_key_here
   VITE_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
   ```

   **Option B: Browser Console (For Testing)**
   
   Open browser console and run:
   ```javascript
   localStorage.setItem('google_api_key', 'your_api_key_here');
   localStorage.setItem('google_search_engine_id', 'your_search_engine_id_here');
   ```

3. **Run the Application**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

## Features

- ✅ Google Search Integration (when configured)
- ✅ Africa-focused search results
- ✅ Country-specific narratives
- ✅ Positive business affirmations
- ✅ Clean, modern UI
- ✅ Responsive design
- ✅ Fallback mode (works without API)

## Troubleshooting

### Google Search API Not Working

1. **Check API Key**: Ensure your API key is correct and has Custom Search API enabled
2. **Check Billing**: Google Custom Search API requires billing to be enabled (free tier: 100 queries/day)
3. **Check Search Engine ID**: Verify your CX (Search Engine ID) is correct
4. **Check Quota**: Free tier allows 100 queries per day

### Application Not Loading

1. Clear browser cache
2. Check browser console for errors
3. Ensure all dependencies are installed: `npm install`
4. Try rebuilding: `npm run build`

### No Results Showing

- The app works in fallback mode without Google API
- Check browser console for error messages
- Try different search queries
- Ensure internet connection is active

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
FaaS/
├── public/
│   └── index.html          # Main HTML
├── src/
│   ├── app.js              # Main application
│   ├── components/         # UI components
│   ├── services/           # API services
│   ├── data/              # Data files
│   ├── styles/            # CSS styles
│   └── utils/             # Utilities
├── package.json
├── vite.config.js
└── README.md
```

## API Configuration

The application supports two configuration methods:

1. **Environment Variables** (`.env` file)
   - `VITE_GOOGLE_API_KEY`: Your Google API key
   - `VITE_GOOGLE_SEARCH_ENGINE_ID`: Your Search Engine ID

2. **Local Storage** (Browser)
   - `google_api_key`: API key
   - `google_search_engine_id`: Search Engine ID

Environment variables take precedence over local storage.

## Support

For issues, visit: https://github.com/tiamica/FaaS/issues

