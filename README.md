# SkyWay Flight Booking Website

A modern, responsive flight booking website with real-time pricing and comprehensive search functionality.

## Features

- ✈️ **Real-time Flight Search** - Live pricing from multiple APIs
- 🎯 **Smart Autocomplete** - Airport search with suggestions
- 💰 **Indian Rupee Pricing** - All prices displayed in ₹
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI/UX** - Beautiful animations and interactions
- 🔍 **Advanced Filtering** - Sort by price, duration, and rating
- 🌍 **Global Coverage** - Domestic and international flights

## Real-time Flight Data Setup

To enable real-time flight prices, you need to set up API keys from the following services:

### 1. Skyscanner API (Recommended)
**Best for:** Real-time pricing and availability
- Go to: https://rapidapi.com/skyscanner/api/skyscanner-flight-search
- Sign up for a free account
- Subscribe to the Skyscanner Flight Search API
- Copy your API key

### 2. Amadeus API
**Best for:** Flight schedules and detailed pricing
- Go to: https://developers.amadeus.com/
- Create a free account
- Get your API key and secret
- Copy your API key

### 3. AviationStack API
**Best for:** Flight tracking and schedules
- Go to: https://aviationstack.com/
- Sign up for a free account
- Copy your API key

## Installation & Setup

### Step 1: Clone or Download
```bash
git clone <repository-url>
cd skyway-flight-booking
```

### Step 2: Configure API Keys
1. Open `api-config.js`
2. Replace the placeholder API keys with your actual keys:
```javascript
const API_CONFIG = {
    SKYSCANNER_API_KEY: 'your_actual_skyscanner_key',
    AMADEUS_API_KEY: 'your_actual_amadeus_key',
    AVIATIONSTACK_API_KEY: 'your_actual_aviationstack_key'
};
```

### Step 3: Update FlightAPI Configuration
1. Open `script.js`
2. Find the FlightAPI object
3. Update the apiKeys section:
```javascript
apiKeys: {
    skyscanner: 'your_actual_skyscanner_key',
    amadeus: 'your_actual_amadeus_key',
    aviationstack: 'your_actual_aviationstack_key'
}
```

### Step 4: Run the Website
- Open `index.html` in a web browser
- Or serve it using a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

## API Features

### Real-time Search
- Searches multiple APIs simultaneously
- Combines results for comprehensive coverage
- Removes duplicates automatically
- Sorts by price (lowest first)

### Fallback System
- If APIs fail, falls back to mock data
- Ensures website always works
- Graceful error handling

### Price Formatting
- All prices in Indian Rupees (₹)
- Proper number formatting (e.g., ₹12,500)
- Currency conversion handled automatically

## File Structure

```
skyway-flight-booking/
├── index.html              # Main HTML file
├── styles.css              # CSS styles
├── script.js               # Main JavaScript functionality
├── api-config.js           # API configuration
├── api.js                  # API service functions
├── autocomplete.js         # Airport autocomplete
├── main.js                 # Additional functionality
└── README.md              # This file
```

## Supported Airlines

### Indian Airlines
- Air India (AI)
- IndiGo (6E)
- SpiceJet (SG)
- Vistara (UK)
- Air India Express (IX)
- Alliance Air (9I)

### International Airlines
- Emirates (EK)
- Qatar Airways (QR)
- British Airways (BA)
- Lufthansa (LH)
- Air France (AF)
- Singapore Airlines (SQ)
- And many more...

## Supported Routes

### Domestic (India)
- Delhi (DEL) ↔ Mumbai (BOM)
- Delhi (DEL) ↔ Bangalore (BLR)
- Mumbai (BOM) ↔ Kolkata (CCU)
- Delhi (DEL) ↔ Hyderabad (HYD)
- And more...

### International
- Delhi (DEL) ↔ London (LHR)
- Mumbai (BOM) ↔ Dubai (DXB)
- Delhi (DEL) ↔ New York (JFK)
- Bangalore (BLR) ↔ Singapore (SIN)
- And more...

## Features in Detail

### Search Functionality
- **One-way & Round-trip** flights
- **Date selection** with minimum date validation
- **Passenger count** (1-5+)
- **Airport autocomplete** with real-time suggestions
- **Swap destinations** with animation

### Results Display
- **Real-time pricing** from multiple sources
- **Airline logos** with custom styling
- **Flight details** (duration, stops, times)
- **Price sorting** (cheapest, fastest, best)
- **Booking buttons** for each flight

### User Experience
- **Loading animations** during search
- **Smooth scrolling** to results
- **Responsive design** for all devices
- **Error handling** with user-friendly messages
- **Fallback data** when APIs are unavailable

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## Performance

- **Fast loading** with optimized assets
- **Efficient API calls** with debouncing
- **Cached results** for better performance
- **Progressive enhancement** for older browsers

## Security Notes

⚠️ **Important:** Never commit API keys to public repositories!

- Keep API keys secure
- Use environment variables in production
- Implement rate limiting for APIs
- Add CORS headers for cross-origin requests

## Troubleshooting

### Common Issues

1. **No flights found**
   - Check API keys are correct
   - Verify airport codes are valid
   - Try different dates

2. **API errors**
   - Check internet connection
   - Verify API service status
   - Check API key permissions

3. **Prices not showing**
   - Ensure API keys are set
   - Check browser console for errors
   - Verify currency settings

### Debug Mode
Add this to browser console for debugging:
```javascript
localStorage.setItem('debug', 'true');
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review API documentation

---

**Happy Flying! ✈️** 