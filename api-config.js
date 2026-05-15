/**
 * API Configuration for SkyWay Flight Booking
 * @module APIConfig
 * @description All API keys, endpoints, and settings are loaded from the
 *   server's /api/config endpoint (which reads from .env).
 *   Nothing is hardcoded — edit .env to configure.
 */

const API_CONFIG = {
    // API keys — populated from .env via server
    SKYSCANNER_API_KEY: '',
    AMADEUS_API_KEY: '',
    AMADEUS_API_SECRET: '',
    AVIATIONSTACK_API_KEY: '',

    // API endpoints — populated from .env via server
    ENDPOINTS: {
        SKYSCANNER: '',
        AMADEUS: '',
        AVIATIONSTACK: ''
    },

    // App settings — populated from .env via server
    DEFAULT_CURRENCY: 'INR',
    DEFAULT_MARKET: 'IN',
    DEFAULT_LOCALE: 'en-IN',
    MAX_RESULTS: 50,

    /** @returns {boolean} Whether real API keys are configured */
    isConfigured() {
        return this.SKYSCANNER_API_KEY !== '' &&
               this.SKYSCANNER_API_KEY !== 'YOUR_SKYSCANNER_API_KEY';
    }
};

/**
 * Load all config from server environment (.env).
 * Falls back gracefully to demo mode if unavailable.
 */
(async () => {
    try {
        const res = await fetch('/api/config');
        if (res.ok) {
            const env = await res.json();
            // Keys
            API_CONFIG.SKYSCANNER_API_KEY = env.SKYSCANNER_API_KEY ?? '';
            API_CONFIG.AMADEUS_API_KEY = env.AMADEUS_API_KEY ?? '';
            API_CONFIG.AMADEUS_API_SECRET = env.AMADEUS_API_SECRET ?? '';
            API_CONFIG.AVIATIONSTACK_API_KEY = env.AVIATIONSTACK_API_KEY ?? '';
            // Endpoints
            API_CONFIG.ENDPOINTS.SKYSCANNER = env.SKYSCANNER_API_URL ?? '';
            API_CONFIG.ENDPOINTS.AMADEUS = env.AMADEUS_API_URL ?? '';
            API_CONFIG.ENDPOINTS.AVIATIONSTACK = env.AVIATIONSTACK_API_URL ?? '';
            // Settings
            API_CONFIG.DEFAULT_CURRENCY = env.DEFAULT_CURRENCY ?? 'INR';
            API_CONFIG.DEFAULT_MARKET = env.DEFAULT_MARKET ?? 'IN';
            API_CONFIG.DEFAULT_LOCALE = env.DEFAULT_LOCALE ?? 'en-IN';
            API_CONFIG.MAX_RESULTS = env.MAX_RESULTS ?? 50;

            console.log('✅ API config loaded from .env');
        }
    } catch {
        console.log('ℹ️ Running in demo mode (no API server detected).');
    }
})();

if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
}