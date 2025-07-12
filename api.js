// Aviation Stack API service for flight data
// Free tier: https://aviationstack.com/product (up to 500 requests per month)

const API_CONFIG = {
    // Replace with your API key when registering at AviationStack
    API_KEY: 'your_api_key_here',
    BASE_URL: 'http://api.aviationstack.com/v1'
};

// Flight search API service
const FlightAPI = {
    /**
     * Search for flights based on parameters
     * @param {Object} params - Search parameters
     * @returns {Promise} - Promise with flight data
     */
    searchFlights: async function(params) {
        try {
            // In a real implementation, this would call the actual API
            // For demo purposes, we'll use mock data with a delay to simulate API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.getMockFlightData(params));
                }, 1500);
            });
            
            /* Actual API implementation would look like this:
            const queryParams = new URLSearchParams({
                access_key: API_CONFIG.API_KEY,
                dep_iata: params.from,
                arr_iata: params.to,
                flight_date: params.date,
                ...params
            });

            const response = await fetch(`${API_CONFIG.BASE_URL}/flights?${queryParams}`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.info);
            }
            
            return this.formatFlightData(data.data);
            */
        } catch (error) {
            console.error('Error fetching flight data:', error);
            throw error;
        }
    },
    
    /**
     * Get airport information by query
     * @param {String} query - Airport name or code
     * @returns {Promise} - Promise with airport data
     */
    searchAirports: async function(query) {
        try {
            // Mock airport search with a delay
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.filterAirports(query));
                }, 300);
            });
        } catch (error) {
            console.error('Error searching airports:', error);
            throw error;
        }
    },
    
    /**
     * Format raw API data into a consistent format
     * @param {Array} flights - Raw flight data from API
     * @returns {Array} - Formatted flight data
     */
    formatFlightData: function(flights) {
        return flights.map(flight => ({
            id: flight.flight.iata,
            airline: flight.airline.name,
            logo: `https://pics.avs.io/200/200/${flight.airline.iata}.png`, // Airline logo
            flightNumber: flight.flight.iata,
            departTime: this.formatTime(flight.departure.scheduled),
            arriveTime: this.formatTime(flight.arrival.scheduled),
            duration: this.calculateDuration(flight.departure.scheduled, flight.arrival.scheduled),
            departAirport: flight.departure.airport,
            arriveAirport: flight.arrival.airport,
            stops: 0, // Direct flights only for simplicity
            price: this.generatePrice(), // API doesn't provide prices
            rating: (3.5 + Math.random() * 1.5).toFixed(1) // Random rating between 3.5-5.0
        }));
    },
    
    /**
     * Calculate flight duration from departure and arrival times
     * @param {String} departTime - Departure time
     * @param {String} arriveTime - Arrival time
     * @returns {String} - Formatted duration (e.g., "2h 15m")
     */
    calculateDuration: function(departTime, arriveTime) {
        const departure = new Date(departTime);
        const arrival = new Date(arriveTime);
        const durationMs = arrival - departure;
        
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m`;
    },
    
    /**
     * Format time from ISO string to HH:MM format
     * @param {String} timeString - ISO time string
     * @returns {String} - Formatted time (e.g., "08:25")
     */
    formatTime: function(timeString) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    },
    
    /**
     * Generate a random price within a realistic range
     * @returns {Number} - Price in USD
     */
    generatePrice: function() {
        return Math.floor(200 + Math.random() * 400);
    },
    
    /**
     * Get mock flight data for demo
     * @param {Object} params - Search parameters
     * @returns {Array} - Mock flight data
     */
    getMockFlightData: function(params) {
        // Create variations based on from/to params
        const fromCity = params.from || 'Unknown';
        const toCity = params.to || 'Unknown';
        
        // Generate random flight times based on departure date
        const departDate = params.date ? new Date(params.date) : new Date();
        departDate.setHours(6, 0, 0, 0); // Start at 6 AM
        
        const flights = [];
        const airlines = [
            { name: 'SkyWay Airlines', code: 'SW' },
            { name: 'Global Airways', code: 'GA' },
            { name: 'Sky Express', code: 'SE' },
            { name: 'Jet Connect', code: 'JC' },
            { name: 'Air Prime', code: 'AP' }
        ];
        
        // Generate 5-8 flights
        const flightCount = 5 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < flightCount; i++) {
            // Create departure time (starting from 6 AM, incrementing by 1-3 hours)
            const departTime = new Date(departDate);
            departTime.setHours(departTime.getHours() + i * (1 + Math.floor(Math.random() * 3)));
            
            // Random duration between 1h 30m and 4h
            const durationMinutes = 90 + Math.floor(Math.random() * 150);
            const durationHours = Math.floor(durationMinutes / 60);
            const remainingMinutes = durationMinutes % 60;
            
            // Create arrival time
            const arriveTime = new Date(departTime);
            arriveTime.setMinutes(arriveTime.getMinutes() + durationMinutes);
            
            // Random airline
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            
            // Random flight number
            const flightNumber = airline.code + Math.floor(100 + Math.random() * 900);
            
            // Generate price (more realistic based on duration and time of day)
            let price = 200 + (durationMinutes / 3);
            
            // Peak hours cost more (8-10 AM, 5-7 PM)
            const hour = departTime.getHours();
            if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
                price += 50;
            }
            
            // Weekend flights cost more
            const day = departTime.getDay();
            if (day === 0 || day === 6) {
                price += 30;
            }
            
            // Add some randomness
            price += Math.floor(Math.random() * 50);
            price = Math.floor(price);
            
            // Add stops randomly (70% direct, 30% with 1 stop)
            const stops = Math.random() > 0.7 ? 1 : 0;
            
            // Some flights have longer durations due to stops
            if (stops > 0) {
                // Add 1-2 hours for connection
                const connectionTime = 60 + Math.floor(Math.random() * 60);
                arriveTime.setMinutes(arriveTime.getMinutes() + connectionTime);
            }
            
            flights.push({
                id: i + 1,
                airline: airline.name,
                logo: `https://via.placeholder.com/50?text=${airline.code}`,
                flightNumber: flightNumber,
                departTime: departTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                arriveTime: arriveTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                duration: `${durationHours}h ${remainingMinutes}m${stops ? ' (1 stop)' : ''}`,
                departAirport: fromCity,
                arriveAirport: toCity,
                stops: stops,
                price: price,
                rating: (3.5 + Math.random() * 1.5).toFixed(1) // Between 3.5-5.0
            });
        }
        
        // Sort by departure time
        return flights.sort((a, b) => {
            return this.timeToMinutes(a.departTime) - this.timeToMinutes(b.departTime);
        });
    },
    
    /**
     * Convert time string to minutes for sorting
     * @param {String} timeStr - Time in format "HH:MM"
     * @returns {Number} - Minutes
     */
    timeToMinutes: function(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    },
    
    // Mock airports database for autocomplete
    airports: [
        { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
        { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
        { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
        { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
        { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
        { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
        { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
        { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
        { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China' },
        { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
        { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
        { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome', country: 'Italy' },
        { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain' },
        { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
        { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States' },
        { code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'United States' },
        { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
        { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
        { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
        { code: 'BCN', name: 'Barcelona–El Prat Airport', city: 'Barcelona', country: 'Spain' }
    ],
    
    /**
     * Filter airports by query string
     * @param {String} query - Search query
     * @returns {Array} - Filtered airports
     */
    filterAirports: function(query) {
        if (!query || query.length < 2) return [];
        
        query = query.toLowerCase();
        return this.airports.filter(airport => 
            airport.code.toLowerCase().includes(query) ||
            airport.name.toLowerCase().includes(query) ||
            airport.city.toLowerCase().includes(query) ||
            airport.country.toLowerCase().includes(query)
        ).slice(0, 5); // Return at most 5 results
    }
};

// Export the API service
window.FlightAPI = FlightAPI; 