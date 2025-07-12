// API Configuration for Real-time Flight Data
// =============================================

// To enable real-time flight prices, you need to sign up for API keys from the following services:

// 1. SKYSCANNER API (Recommended for pricing)
//    - Go to: https://rapidapi.com/skyscanner/api/skyscanner-flight-search
//    - Sign up for a free account
//    - Subscribe to the Skyscanner Flight Search API
//    - Copy your API key and replace 'YOUR_SKYSCANNER_API_KEY' below

// 2. AMADEUS API (Good for flight schedules and pricing)
//    - Go to: https://developers.amadeus.com/
//    - Create a free account
//    - Get your API key and secret
//    - Copy your API key and replace 'YOUR_AMADEUS_API_KEY' below

// 3. AVIATIONSTACK API (Good for flight tracking and schedules)
//    - Go to: https://aviationstack.com/
//    - Sign up for a free account
//    - Copy your API key and replace 'YOUR_AVIATIONSTACK_API_KEY' below

// IMPORTANT: Keep your API keys secure and never commit them to public repositories!

const API_CONFIG = {
    // Replace these with your actual API keys
    SKYSCANNER_API_KEY: 'YOUR_SKYSCANNER_API_KEY',
    AMADEUS_API_KEY: 'YOUR_AMADEUS_API_KEY',
    AVIATIONSTACK_API_KEY: 'YOUR_AVIATIONSTACK_API_KEY',
    
    // API endpoints
    ENDPOINTS: {
        SKYSCANNER: 'https://skyscanner-api.p.rapidapi.com/v3/flights/live/search/create',
        AMADEUS: 'https://test.api.amadeus.com/v2/shopping/flight-offers',
        AVIATIONSTACK: 'http://api.aviationstack.com/v1'
    },
    
    // Default settings
    DEFAULT_CURRENCY: 'INR',
    DEFAULT_MARKET: 'IN',
    DEFAULT_LOCALE: 'en-IN',
    MAX_RESULTS: 50
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}

// For browser usage, make it globally available
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
}

// Usage Instructions:
// ==================
// 1. Sign up for the APIs mentioned above
// 2. Replace the placeholder API keys with your actual keys
// 3. Include this file in your HTML before script.js:
//    <script src="api-config.js"></script>
//    <script src="script.js"></script>
// 4. Update the FlightAPI.apiKeys in script.js to use these config values

console.log('API Configuration loaded. Please update the API keys with your actual keys.'); 