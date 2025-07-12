// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: false,
        mirror: false
    });

    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger) {
        burger.addEventListener('click', function() {
            nav.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Login and Signup Modal Functionality
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');

    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
        });
    }

    // Open signup modal
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            signupModal.classList.add('active');
        });
    }

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.classList.remove('active');
            signupModal.classList.remove('active');
        });
    });

    // Switch between login and signup
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.remove('active');
            signupModal.classList.add('active');
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            signupModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
        if (e.target === signupModal) {
            signupModal.classList.remove('active');
        }
    });

    // Trip type radio button functionality
    const tripTypeRadios = document.querySelectorAll('input[name="trip-type"]');
    const returnDateGroup = document.querySelector('.return-date');

    if (tripTypeRadios.length && returnDateGroup) {
        tripTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'one-way') {
                    returnDateGroup.style.display = 'none';
                } else {
                    returnDateGroup.style.display = 'block';
                }
            });
        });
    }

    // Airport Autocomplete for From/To fields
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const fromDropdown = document.getElementById('from-dropdown');
    const toDropdown = document.getElementById('to-dropdown');
    
    let fromSelectedAirport = null;
    let toSelectedAirport = null;
    
    // Setup autocomplete for From field
    if (fromInput && fromDropdown) {
        setupAirportAutocomplete(fromInput, fromDropdown, (airport) => {
            fromSelectedAirport = airport;
        });
    }
    
    // Setup autocomplete for To field
    if (toInput && toDropdown) {
        setupAirportAutocomplete(toInput, toDropdown, (airport) => {
            toSelectedAirport = airport;
        });
    }
    
    // Function to set up airport autocomplete
    function setupAirportAutocomplete(input, dropdown, onSelect) {
        let debounceTimer;
        
        input.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            
            // Show loading indicator
            const existingSpinner = input.parentNode.querySelector('.loading-spinner');
            if (!existingSpinner && input.value.length >= 2) {
                const spinner = document.createElement('span');
                spinner.className = 'loading-spinner';
                input.parentNode.appendChild(spinner);
            }
            
            debounceTimer = setTimeout(() => {
                const query = input.value.trim();
                
                if (query.length >= 2) {
                    // Use FlightAPI to search airports
                    FlightAPI.searchAirports(query)
                        .then(airports => {
                            // Remove loading spinner
                            const spinner = input.parentNode.querySelector('.loading-spinner');
                            if (spinner) {
                                spinner.remove();
                            }
                            
                            if (airports.length > 0) {
                                displayAirports(airports, dropdown, input, onSelect);
                            } else {
                                dropdown.innerHTML = '<div class="autocomplete-item">No airports found</div>';
                                dropdown.classList.add('active');
                            }
                        })
                        .catch(error => {
                            console.error('Error searching airports:', error);
                            // Remove loading spinner on error
                            const spinner = input.parentNode.querySelector('.loading-spinner');
                            if (spinner) {
                                spinner.remove();
                            }
                        });
                } else {
                    dropdown.classList.remove('active');
                    const spinner = input.parentNode.querySelector('.loading-spinner');
                    if (spinner) {
                        spinner.remove();
                    }
                }
            }, 300);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Focus handler to show dropdown again if there's content
        input.addEventListener('focus', function() {
            if (input.value.trim().length >= 2) {
                FlightAPI.searchAirports(input.value.trim())
                    .then(airports => {
                        if (airports.length > 0) {
                            displayAirports(airports, dropdown, input, onSelect);
                        }
                    });
            }
        });
    }
    
    // Function to display airports in dropdown
    function displayAirports(airports, dropdown, input, onSelect) {
        dropdown.innerHTML = '';
        
        airports.forEach(airport => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.innerHTML = `
                <span class="airport-code">${airport.code}</span>
                <span class="airport-name">${airport.name}</span>
                <span class="airport-location">${airport.city}, ${airport.country}</span>
            `;
            
            item.addEventListener('click', function() {
                input.value = `${airport.city} (${airport.code})`;
                dropdown.classList.remove('active');
                onSelect(airport);
            });
            
            dropdown.appendChild(item);
        });
        
        dropdown.classList.add('active');
    }

    // From/To field swap functionality
    const swapIcon = document.querySelector('.swap-icon');

    if (swapIcon && fromInput && toInput) {
        swapIcon.addEventListener('click', function() {
            const tempValue = fromInput.value;
            const tempAirport = fromSelectedAirport;
            
            fromInput.value = toInput.value;
            fromSelectedAirport = toSelectedAirport;
            
            toInput.value = tempValue;
            toSelectedAirport = tempAirport;

            // Add animation classes for the swap effect
            fromInput.classList.add('swap-animate');
            toInput.classList.add('swap-animate');

            setTimeout(() => {
                fromInput.classList.remove('swap-animate');
                toInput.classList.remove('swap-animate');
            }, 500);
        });
    }

    // Flight search form submission
    const searchForm = document.getElementById('flight-search-form');
    const resultsSection = document.getElementById('flight-results');
    const resultsList = document.getElementById('results-list');

    if (searchForm && resultsSection && resultsList) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate from and to inputs
            if (!fromInput.value || !toInput.value) {
                alert('Please select both origin and destination airports');
                return;
            }
            
            // Validate dates
            const departDate = document.getElementById('depart').value;
            const returnDate = document.getElementById('return').value;
            const tripType = document.querySelector('input[name="trip-type"]:checked').value;
            
            if (!departDate) {
                alert('Please select a departure date');
                return;
            }
            
            if (tripType === 'round-trip' && !returnDate) {
                alert('Please select a return date');
                return;
            }
            
            // Show loading animation
            resultsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Searching for real-time flights...</div>';
            resultsSection.classList.remove('hidden');
            
            // Smooth scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Get search parameters
            const searchParams = {
                from: fromInput.value,
                to: toInput.value,
                date: departDate,
                passengers: document.getElementById('passengers').value,
                returnDate: returnDate
            };
            
            try {
                // Use the real-time API to search for flights
                const flights = await FlightAPI.searchFlights(searchParams);
                
                if (flights && flights.length > 0) {
                    displayFlightResults(flights);
                } else {
                    resultsList.innerHTML = '<div class="no-results">No flights found for your search criteria. Please try different dates or destinations.</div>';
                }
            } catch (error) {
                console.error('Error searching flights:', error);
                resultsList.innerHTML = '<div class="error-message">An error occurred while searching for flights. Please try again later.</div>';
            }
        });
    }

    // Flight filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Sort flight results based on filter
                const filterType = this.dataset.filter;
                sortFlightResults(filterType);
            });
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            
            if (input.value.trim() !== '') {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing!';
                
                // Replace form with success message
                this.innerHTML = '';
                this.appendChild(successMsg);
                
                // Animate success message
                successMsg.style.animation = 'fadeIn 0.5s ease';
            }
        });
    }

    // Login form validation and submission
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                // Mock login functionality
                this.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i> Login successful! Redirecting...</div>';
                
                // Close modal after delay
                setTimeout(() => {
                    loginModal.classList.remove('active');
                    // Reset form
                    loginForm.innerHTML = `
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn-primary">Login</button>
                        </div>
                        <div class="form-footer">
                            <p>Don't have an account? <a href="#" id="signup-link">Sign Up</a></p>
                            <p><a href="#" id="forgot-password">Forgot Password?</a></p>
                        </div>
                        <div class="social-login">
                            <p>Or login with</p>
                            <div class="social-buttons">
                                <button type="button" class="btn-google"><i class="fab fa-google"></i> Google</button>
                                <button type="button" class="btn-github"><i class="fab fa-github"></i> GitHub</button>
                            </div>
                        </div>
                    `;
                    
                    // Re-attach event listeners
                    document.getElementById('signup-link').addEventListener('click', function(e) {
                        e.preventDefault();
                        loginModal.classList.remove('active');
                        signupModal.classList.add('active');
                    });
                }, 2000);
            }
        });
    }

    // Signup form validation and submission
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            if (name && email && password && password === confirmPassword) {
                // Mock signup functionality
                this.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i> Account created successfully! Please check your email.</div>';
                
                // Close modal after delay
                setTimeout(() => {
                    signupModal.classList.remove('active');
                    // Reset form
                    signupForm.innerHTML = `
                        <div class="form-group">
                            <label for="signup-name">Full Name</label>
                            <input type="text" id="signup-name" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-email">Email</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password">Password</label>
                            <input type="password" id="signup-password" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-confirm">Confirm Password</label>
                            <input type="password" id="signup-confirm" required>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn-primary">Sign Up</button>
                        </div>
                        <div class="form-footer">
                            <p>Already have an account? <a href="#" id="login-link">Login</a></p>
                        </div>
                        <div class="social-login">
                            <p>Or sign up with</p>
                            <div class="social-buttons">
                                <button type="button" class="btn-google"><i class="fab fa-google"></i> Google</button>
                                <button type="button" class="btn-github"><i class="fab fa-github"></i> GitHub</button>
                            </div>
                        </div>
                    `;
                    
                    // Re-attach event listeners
                    document.getElementById('login-link').addEventListener('click', function(e) {
                        e.preventDefault();
                        signupModal.classList.remove('active');
                        loginModal.classList.add('active');
                    });
                }, 2000);
            } else if (password !== confirmPassword) {
                // Show password mismatch error
                alert('Passwords do not match!');
            }
        });
    }

    // Social media login buttons
    const socialButtons = document.querySelectorAll('.btn-google, .btn-github');
    
    if (socialButtons.length) {
        socialButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const provider = this.classList.contains('btn-google') ? 'Google' : 'GitHub';
                alert(`${provider} authentication would be integrated here.`);
            });
        });
    }

    // Set minimum date for departure and return date inputs
    const departInput = document.getElementById('depart');
    const returnInput = document.getElementById('return');
    
    if (departInput && returnInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        departInput.min = formatDate(today);
        returnInput.min = formatDate(tomorrow);
        
        // Update return minimum date when depart date changes
        departInput.addEventListener('change', function() {
            const departDate = new Date(this.value);
            const nextDay = new Date(departDate);
            nextDay.setDate(nextDay.getDate() + 1);
            returnInput.min = formatDate(nextDay);
            
            // If return date is before depart date, update it
            if (new Date(returnInput.value) <= departDate) {
                returnInput.value = formatDate(nextDay);
            }
        });
    }
});

// Function to display flight results
function displayFlightResults(flights) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';
    
    // Sort by price initially
    let sortedFlights = [...flights].sort((a, b) => a.price - b.price);
    
    // Render flight cards with staggered animations
    sortedFlights.forEach((flight, index) => {
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        flightCard.setAttribute('data-aos', 'fade-up');
        flightCard.setAttribute('data-aos-delay', `${index * 100}`);
        flightCard.setAttribute('data-id', flight.id);
        flightCard.setAttribute('data-price', flight.price);
        flightCard.setAttribute('data-duration', flight.duration.replace(/\D/g, ''));
        flightCard.setAttribute('data-rating', flight.rating);
        
        // Extract flight duration for display
        let durationText = flight.duration;
        let stopsText = flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stop`;
        
        // Format price in Indian Rupees
        const formattedPrice = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(flight.price);
        
        flightCard.innerHTML = `
            <div class="airline-info">
                <img src="${flight.logo}" alt="${flight.airline}" class="airline-logo">
                <div>
                    <h3>${flight.airline}</h3>
                    <p>${stopsText}</p>
                    ${flight.flightNumber ? `<small>Flight ${flight.flightNumber}</small>` : ''}
                </div>
            </div>
            <div class="flight-details">
                <div class="time-info">
                    <h3>${flight.departTime}</h3>
                    <p>${flight.departAirport || 'Depart'}</p>
                </div>
                <div class="time-info">
                    <p class="duration">${durationText}</p>
                    <div class="flight-path">
                        <span class="dot"></span>
                        <span class="line"></span>
                        ${flight.stops ? '<span class="stop-dot"></span>' : ''}
                        <span class="line"></span>
                        <span class="dot"></span>
                    </div>
                </div>
                <div class="time-info">
                    <h3>${flight.arriveTime}</h3>
                    <p>${flight.arriveAirport || 'Arrive'}</p>
                </div>
            </div>
            <div class="price-info">
                <div class="price">${formattedPrice}</div>
                <button class="btn-primary book-btn">Book Now</button>
            </div>
        `;
        
        resultsList.appendChild(flightCard);
    });
    
    // Add event listeners to book buttons
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const flightId = this.closest('.flight-card').dataset.id;
            const flight = flights.find(f => f.id == flightId);
            const formattedPrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(flight.price);
            alert(`Booking process would start for ${flight.airline} at ${formattedPrice}`);
        });
    });
    
    // Refresh AOS for newly added elements
    AOS.refresh();
}

// Function to sort flight results
function sortFlightResults(filterType) {
    const resultsList = document.getElementById('results-list');
    const flightCards = Array.from(resultsList.getElementsByClassName('flight-card'));
    
    // Sort based on filter type
    flightCards.sort((a, b) => {
        if (filterType === 'cheapest') {
            return parseInt(a.dataset.price) - parseInt(b.dataset.price);
        } else if (filterType === 'fastest') {
            return parseInt(a.dataset.duration) - parseInt(b.dataset.duration);
        } else if (filterType === 'best') {
            return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        }
    });
    
    // Clear and re-append cards in new order
    resultsList.innerHTML = '';
    flightCards.forEach((card, index) => {
        // Add staggered animation delay
        card.setAttribute('data-aos-delay', `${index * 100}`);
        resultsList.appendChild(card);
    });
    
    // Add animation class to flight cards for re-ordering effect
    flightCards.forEach(card => {
        card.classList.add('reorder');
        setTimeout(() => {
            card.classList.remove('reorder');
        }, 500);
    });
    
    // Refresh AOS animations
    AOS.refresh();
}

// Add CSS for additional animations
const style = document.createElement('style');
style.textContent = `
    @keyframes swap {
        0% { transform: translateY(0); opacity: 1; }
        50% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    
    .swap-animate {
        animation: swap 0.5s ease;
    }
    
    .flight-path {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px 0;
    }
    
    .dot {
        width: 10px;
        height: 10px;
        background-color: var(--primary-color);
        border-radius: 50%;
    }
    
    .stop-dot {
        width: 8px;
        height: 8px;
        background-color: var(--secondary-color);
        border-radius: 50%;
        margin: 0 -4px;
        z-index: 5;
    }
    
    .line {
        flex: 1;
        height: 2px;
        background-color: var(--primary-color);
        position: relative;
        margin: 0 5px;
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        font-size: 1.2rem;
        color: var(--text-light);
    }
    
    .loading i {
        margin-right: 10px;
        color: var(--primary-color);
    }
    
    .success-message {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #28a745;
        font-weight: 500;
        font-size: 1.1rem;
        padding: 1rem;
    }
    
    .success-message i {
        margin-right: 10px;
        font-size: 1.5rem;
    }
    
    .reorder {
        animation: fadeIn 0.5s ease;
    }
    
    .no-results, .error-message {
        text-align: center;
        padding: 3rem;
        color: var(--text-light);
        font-size: 1.1rem;
    }
    
    .error-message {
        color: var(--secondary-color);
    }
`;

document.head.appendChild(style);

// Flight Database
const flights = {
    domestic: {
        // Air India Domestic Routes
        'AI': [
            { from: 'DEL', to: 'BOM', flightNumber: 'AI865', price: 12500, type: 'Direct Flight' },
            { from: 'DEL', to: 'BLR', flightNumber: 'AI503', price: 14500, type: 'Direct Flight' },
            { from: 'BOM', to: 'CCU', flightNumber: 'AI773', price: 15800, type: '1 Stop' },
            { from: 'DEL', to: 'HYD', flightNumber: 'AI542', price: 13200, type: 'Direct Flight' },
            { from: 'BLR', to: 'CCU', flightNumber: 'AI776', price: 16800, type: '1 Stop' }
        ],
        // IndiGo Domestic Routes
        '6E': [
            { from: 'DEL', to: 'BOM', flightNumber: '6E2112', price: 9800, type: 'Direct Flight' },
            { from: 'BLR', to: 'DEL', flightNumber: '6E2341', price: 11200, type: 'Direct Flight' },
            { from: 'HYD', to: 'CCU', flightNumber: '6E678', price: 14500, type: '1 Stop' },
            { from: 'BOM', to: 'MAA', flightNumber: '6E897', price: 10800, type: 'Direct Flight' },
            { from: 'CCU', to: 'BLR', flightNumber: '6E555', price: 13800, type: '1 Stop' }
        ],
        // SpiceJet Domestic Routes
        'SG': [
            { from: 'DEL', to: 'BOM', flightNumber: 'SG123', price: 10200, type: 'Direct Flight' },
            { from: 'BLR', to: 'HYD', flightNumber: 'SG456', price: 8800, type: 'Direct Flight' },
            { from: 'CCU', to: 'DEL', flightNumber: 'SG789', price: 14200, type: '1 Stop' },
            { from: 'MAA', to: 'BOM', flightNumber: 'SG234', price: 11500, type: 'Direct Flight' },
            { from: 'HYD', to: 'BLR', flightNumber: 'SG567', price: 9200, type: 'Direct Flight' }
        ],
        // Vistara Domestic Routes
        'UK': [
            { from: 'DEL', to: 'BOM', flightNumber: 'UK970', price: 13500, type: 'Direct Flight' },
            { from: 'BLR', to: 'DEL', flightNumber: 'UK872', price: 14800, type: 'Direct Flight' },
            { from: 'HYD', to: 'CCU', flightNumber: 'UK765', price: 16200, type: '1 Stop' },
            { from: 'BOM', to: 'MAA', flightNumber: 'UK543', price: 12800, type: 'Direct Flight' },
            { from: 'CCU', to: 'HYD', flightNumber: 'UK234', price: 15500, type: '1 Stop' }
        ],
        // Air India Express Domestic Routes
        'IX': [
            { from: 'BOM', to: 'CCU', flightNumber: 'IX213', price: 11000, type: 'Direct Flight' },
            { from: 'DEL', to: 'MAA', flightNumber: 'IX546', price: 12500, type: '1 Stop' },
            { from: 'BLR', to: 'HYD', flightNumber: 'IX789', price: 9500, type: 'Direct Flight' }
        ],
        // Alliance Air Domestic Routes
        '9I': [
            { from: 'DEL', to: 'LKO', flightNumber: '9I825', price: 8500, type: 'Direct Flight' },
            { from: 'BOM', to: 'AMD', flightNumber: '9I347', price: 7800, type: 'Direct Flight' },
            { from: 'HYD', to: 'VTZ', flightNumber: '9I654', price: 9200, type: 'Direct Flight' }
        ]
    },
    international: {
        // Air India International Routes
        'AI': [
            { from: 'DEL', to: 'LHR', flightNumber: 'AI161', price: 68500, type: 'Direct Flight' },
            { from: 'BOM', to: 'DXB', flightNumber: 'AI983', price: 42500, type: 'Direct Flight' },
            { from: 'DEL', to: 'JFK', flightNumber: 'AI101', price: 94500, type: '1 Stop' },
            { from: 'BLR', to: 'SIN', flightNumber: 'AI342', price: 51200, type: 'Direct Flight' }
        ],
        // IndiGo International Routes
        '6E': [
            { from: 'DEL', to: 'DXB', flightNumber: '6E1455', price: 38500, type: 'Direct Flight' },
            { from: 'BOM', to: 'BKK', flightNumber: '6E1234', price: 42500, type: 'Direct Flight' },
            { from: 'DEL', to: 'IST', flightNumber: '6E1789', price: 56500, type: '1 Stop' }
        ],
        // Vistara International Routes
        'UK': [
            { from: 'DEL', to: 'LHR', flightNumber: 'UK133', price: 72500, type: 'Direct Flight' },
            { from: 'BOM', to: 'SIN', flightNumber: 'UK115', price: 48500, type: 'Direct Flight' },
            { from: 'DEL', to: 'FRA', flightNumber: 'UK149', price: 64500, type: '1 Stop' }
        ]
    }
};

// Airport Database
const airports = {
    // Indian Airports
    'DEL': 'Delhi (DEL), Indira Gandhi International Airport',
    'BOM': 'Mumbai (BOM), Chhatrapati Shivaji International Airport',
    'BLR': 'Bangalore (BLR), Kempegowda International Airport',
    'HYD': 'Hyderabad (HYD), Rajiv Gandhi International Airport',
    'MAA': 'Chennai (MAA), Chennai International Airport',
    'CCU': 'Kolkata (CCU), Netaji Subhas Chandra Bose International Airport',
    'LKO': 'Lucknow (LKO), Chaudhary Charan Singh International Airport',
    'AMD': 'Ahmedabad (AMD), Sardar Vallabhbhai Patel International Airport',
    'VTZ': 'Vishakhapatnam (VTZ), Visakhapatnam Airport',
    // International Airports
    'LHR': 'London (LHR), Heathrow Airport',
    'DXB': 'Dubai (DXB), Dubai International Airport',
    'JFK': 'New York (JFK), John F. Kennedy International Airport',
    'SIN': 'Singapore (SIN), Singapore Changi Airport',
    'BKK': 'Bangkok (BKK), Suvarnabhumi Airport',
    'IST': 'Istanbul (IST), Istanbul Airport',
    'FRA': 'Frankfurt (FRA), Frankfurt Airport'
};

// Airline Information
const airlines = {
    'AI': {
        name: 'Air India',
        logo: 'airindia',
        fullName: 'Air India'
    },
    '6E': {
        name: 'IndiGo',
        logo: 'indigo',
        fullName: 'IndiGo Airlines'
    },
    'SG': {
        name: 'SpiceJet',
        logo: 'spicejet',
        fullName: 'SpiceJet Airways'
    },
    'UK': {
        name: 'Vistara',
        logo: 'vistara',
        fullName: 'Vistara Airlines'
    },
    'IX': {
        name: 'Air India Express',
        logo: 'airindiaexpress',
        fullName: 'Air India Express'
    },
    '9I': {
        name: 'Alliance Air',
        logo: 'allianceair',
        fullName: 'Alliance Air'
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const searchForm = document.getElementById('flight-search-form');
    const resultsSection = document.getElementById('flight-results');
    const resultsList = document.getElementById('results-list');
    const tripTypeInputs = document.querySelectorAll('input[name="trip-type"]');

    // Setup autocomplete for airports
    setupAirportAutocomplete(fromInput);
    setupAirportAutocomplete(toInput);

    // Handle trip type change
    tripTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            const returnDate = document.querySelector('.return-date');
            if (this.value === 'one-way') {
                returnDate.style.display = 'none';
            } else {
                returnDate.style.display = 'block';
            }
        });
    });

    // Handle form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fromCode = fromInput.value.split('(')[1].split(')')[0];
        const toCode = toInput.value.split('(')[1].split(')')[0];
        const tripType = document.querySelector('input[name="trip-type"]:checked').value;

        // Search for flights
        const matchedFlights = searchFlights(fromCode, toCode, tripType);
        displayFlights(matchedFlights);

        // Show results section
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Search flights function
function searchFlights(from, to, tripType) {
    let matchedFlights = [];

    // Search in both domestic and international flights
    for (const category in flights) {
        for (const airline in flights[category]) {
            const airlineFlights = flights[category][airline];
            const matches = airlineFlights.filter(flight => 
                flight.from === from && flight.to === to
            );
            matchedFlights = [...matchedFlights, ...matches.map(flight => ({
                ...flight,
                airline: airline,
                airlineName: airlines[airline].name,
                airlineLogo: airlines[airline].logo
            }))];
        }
    }

    return matchedFlights;
}

// Display flights function
function displayFlights(matchedFlights) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    if (matchedFlights.length === 0) {
        resultsList.innerHTML = `
            <div class="no-flights">
                <h3>No flights found</h3>
                <p>Try different dates or destinations</p>
            </div>
        `;
        return;
    }

    matchedFlights.forEach((flight, index) => {
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        flightCard.setAttribute('data-aos', 'fade-up');
        if (index > 0) flightCard.setAttribute('data-aos-delay', index * 100);

        // Format price in Indian Rupees
        const formattedPrice = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(flight.price);

        flightCard.innerHTML = `
            <div class="airline-info">
                <div class="airline-logo-custom ${flight.airlineLogo}"></div>
                <div class="flight-details">
                    <h3>${flight.airlineName}</h3>
                    <p>${flight.type}</p>
                    <p class="flight-number">Flight ${flight.flightNumber}</p>
                </div>
            </div>
            <div class="price-section">
                <span class="price">${formattedPrice}</span>
                <button class="btn-book">Book Now</button>
            </div>
        `;

        resultsList.appendChild(flightCard);
    });
}

// Setup airport autocomplete
function setupAirportAutocomplete(input) {
    let currentFocus;
    
    input.addEventListener('input', function(e) {
        let val = this.value;
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;

        const autocompleteList = document.createElement('div');
        autocompleteList.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(autocompleteList);

        for (const code in airports) {
            const airportName = airports[code];
            if (airportName.toLowerCase().includes(val.toLowerCase())) {
                const item = document.createElement('div');
                item.innerHTML = airportName;
                item.addEventListener('click', function(e) {
                    input.value = this.innerHTML;
                    closeAllLists();
                });
                autocompleteList.appendChild(item);
            }
        }
    });

    function closeAllLists(elmnt) {
        const x = document.getElementsByClassName('autocomplete-items');
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener('click', function(e) {
        closeAllLists(e.target);
    });
} 

// FlightAPI Service for Real-time Flight Data
const FlightAPI = {
    // API Keys (you'll need to get these from the respective services)
    apiKeys: {
        skyscanner: 'YOUR_SKYSCANNER_API_KEY', // Get from https://rapidapi.com/skyscanner/api/skyscanner-flight-search
        amadeus: 'YOUR_AMADEUS_API_KEY', // Get from https://developers.amadeus.com/
        aviationstack: 'YOUR_AVIATIONSTACK_API_KEY' // Get from https://aviationstack.com/
    },

    // Search for real-time flights
    async searchFlights(searchParams) {
        try {
            // Try multiple APIs for better coverage
            const results = await Promise.allSettled([
                this.searchSkyscanner(searchParams),
                this.searchAmadeus(searchParams),
                this.searchAviationStack(searchParams)
            ]);

            // Combine results from all APIs
            let allFlights = [];
            results.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    allFlights = [...allFlights, ...result.value];
                }
            });

            // Remove duplicates and sort by price
            const uniqueFlights = this.removeDuplicates(allFlights);
            return uniqueFlights.sort((a, b) => a.price - b.price);

        } catch (error) {
            console.error('Error searching flights:', error);
            // Fallback to mock data if APIs fail
            return this.getMockFlights(searchParams);
        }
    },

    // Skyscanner API integration
    async searchSkyscanner(params) {
        try {
            const response = await fetch(`https://skyscanner-api.p.rapidapi.com/v3/flights/live/search/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': this.apiKeys.skyscanner,
                    'X-RapidAPI-Host': 'skyscanner-api.p.rapidapi.com'
                },
                body: JSON.stringify({
                    query: {
                        market: "IN",
                        locale: "en-IN",
                        currency: "INR",
                        queryLegs: [{
                            originPlaceId: this.getAirportCode(params.from),
                            destinationPlaceId: this.getAirportCode(params.to),
                            date: params.date
                        }],
                        adults: parseInt(params.passengers) || 1,
                        childrenAges: [],
                        cabinClass: "CABIN_CLASS_ECONOMY"
                    }
                })
            });

            if (!response.ok) throw new Error('Skyscanner API error');
            
            const data = await response.json();
            return this.parseSkyscannerResults(data);

        } catch (error) {
            console.error('Skyscanner API error:', error);
            return [];
        }
    },

    // Amadeus API integration
    async searchAmadeus(params) {
        try {
            const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.amadeus}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    originLocationCode: this.getAirportCode(params.from),
                    destinationLocationCode: this.getAirportCode(params.to),
                    departureDate: params.date,
                    adults: params.passengers || 1,
                    currencyCode: 'INR',
                    max: 50
                }
            });

            if (!response.ok) throw new Error('Amadeus API error');
            
            const data = await response.json();
            return this.parseAmadeusResults(data);

        } catch (error) {
            console.error('Amadeus API error:', error);
            return [];
        }
    },

    // AviationStack API integration
    async searchAviationStack(params) {
        try {
            const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${this.apiKeys.aviationstack}&dep_iata=${this.getAirportCode(params.from)}&arr_iata=${this.getAirportCode(params.to)}&date=${params.date}`);

            if (!response.ok) throw new Error('AviationStack API error');
            
            const data = await response.json();
            return this.parseAviationStackResults(data);

        } catch (error) {
            console.error('AviationStack API error:', error);
            return [];
        }
    },

    // Parse Skyscanner results
    parseSkyscannerResults(data) {
        const flights = [];
        if (data.content && data.content.results) {
            data.content.results.itineraries.forEach(itinerary => {
                const pricingOptions = itinerary.pricingOptions;
                if (pricingOptions && pricingOptions.length > 0) {
                    const price = pricingOptions[0].price.amount;
                    const airline = this.getAirlineInfo(itinerary.legs[0].carriers.marketing[0].name);
                    
                    flights.push({
                        id: `skyscanner_${itinerary.legs[0].id}`,
                        airline: airline.name,
                        airlineCode: airline.code,
                        logo: airline.logo,
                        flightNumber: itinerary.legs[0].carriers.marketing[0].flightNumber,
                        price: Math.round(price * 100), // Convert to paise for consistency
                        departTime: itinerary.legs[0].departure,
                        arriveTime: itinerary.legs[0].arrival,
                        duration: this.calculateDuration(itinerary.legs[0].departure, itinerary.legs[0].arrival),
                        stops: itinerary.legs.length - 1,
                        departAirport: itinerary.legs[0].origin.placeId,
                        arriveAirport: itinerary.legs[0].destination.placeId,
                        source: 'Skyscanner'
                    });
                }
            });
        }
        return flights;
    },

    // Parse Amadeus results
    parseAmadeusResults(data) {
        const flights = [];
        if (data.data) {
            data.data.forEach(offer => {
                const segment = offer.itineraries[0].segments[0];
                const airline = this.getAirlineInfo(segment.carrierCode);
                
                flights.push({
                    id: `amadeus_${offer.id}`,
                    airline: airline.name,
                    airlineCode: airline.code,
                    logo: airline.logo,
                    flightNumber: segment.carrierCode + segment.number,
                    price: Math.round(parseFloat(offer.price.total) * 100),
                    departTime: segment.departure.at,
                    arriveTime: segment.arrival.at,
                    duration: offer.itineraries[0].duration,
                    stops: offer.itineraries[0].segments.length - 1,
                    departAirport: segment.departure.iataCode,
                    arriveAirport: segment.arrival.iataCode,
                    source: 'Amadeus'
                });
            });
        }
        return flights;
    },

    // Parse AviationStack results
    parseAviationStackResults(data) {
        const flights = [];
        if (data.data) {
            data.data.forEach(flight => {
                const airline = this.getAirlineInfo(flight.airline.iata);
                
                flights.push({
                    id: `aviationstack_${flight.flight.number}`,
                    airline: airline.name,
                    airlineCode: airline.code,
                    logo: airline.logo,
                    flightNumber: flight.flight.number,
                    price: this.estimatePrice(flight), // AviationStack doesn't provide prices
                    departTime: flight.departure.scheduled,
                    arriveTime: flight.arrival.scheduled,
                    duration: this.calculateDuration(flight.departure.scheduled, flight.arrival.scheduled),
                    stops: 0, // AviationStack doesn't provide stop information
                    departAirport: flight.departure.iata,
                    arriveAirport: flight.arrival.iata,
                    source: 'AviationStack'
                });
            });
        }
        return flights;
    },

    // Get airport code from input
    getAirportCode(input) {
        const match = input.match(/\(([A-Z]{3})\)/);
        return match ? match[1] : input;
    },

    // Get airline information
    getAirlineInfo(code) {
        const airlines = {
            'AI': { name: 'Air India', code: 'AI', logo: 'airindia' },
            '6E': { name: 'IndiGo', code: '6E', logo: 'indigo' },
            'SG': { name: 'SpiceJet', code: 'SG', logo: 'spicejet' },
            'UK': { name: 'Vistara', code: 'UK', logo: 'vistara' },
            'IX': { name: 'Air India Express', code: 'IX', logo: 'airindiaexpress' },
            '9I': { name: 'Alliance Air', code: '9I', logo: 'allianceair' },
            'EK': { name: 'Emirates', code: 'EK', logo: 'emirates' },
            'QR': { name: 'Qatar Airways', code: 'QR', logo: 'qatar' },
            'BA': { name: 'British Airways', code: 'BA', logo: 'british' },
            'LH': { name: 'Lufthansa', code: 'LH', logo: 'lufthansa' },
            'AF': { name: 'Air France', code: 'AF', logo: 'airfrance' },
            'KL': { name: 'KLM', code: 'KL', logo: 'klm' },
            'SQ': { name: 'Singapore Airlines', code: 'SQ', logo: 'singapore' },
            'TK': { name: 'Turkish Airlines', code: 'TK', logo: 'turkish' },
            'AC': { name: 'Air Canada', code: 'AC', logo: 'aircanada' },
            'JL': { name: 'Japan Airlines', code: 'JL', logo: 'jal' },
            'NH': { name: 'ANA', code: 'NH', logo: 'ana' },
            'QF': { name: 'Qantas', code: 'QF', logo: 'qantas' },
            'EY': { name: 'Etihad Airways', code: 'EY', logo: 'etihad' },
            'CX': { name: 'Cathay Pacific', code: 'CX', logo: 'cathay' },
            'CA': { name: 'Air China', code: 'CA', logo: 'airchina' },
            'KE': { name: 'Korean Air', code: 'KE', logo: 'korean' }
        };
        
        return airlines[code] || { name: 'Unknown Airline', code: code, logo: 'default' };
    },

    // Calculate flight duration
    calculateDuration(departure, arrival) {
        const depart = new Date(departure);
        const arrive = new Date(arrival);
        const diff = arrive - depart;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    },

    // Estimate price for AviationStack (since it doesn't provide prices)
    estimatePrice(flight) {
        const basePrices = {
            'DEL-BOM': 12000,
            'DEL-BLR': 14000,
            'BOM-BLR': 11000,
            'DEL-HYD': 13000,
            'BOM-HYD': 10000,
            'DEL-CCU': 15000,
            'BOM-CCU': 14000,
            'BLR-CCU': 16000,
            'DEL-LHR': 65000,
            'BOM-DXB': 40000,
            'DEL-JFK': 90000,
            'BLR-SIN': 50000
        };
        
        const route = `${flight.departure.iata}-${flight.arrival.iata}`;
        return basePrices[route] || 15000; // Default price
    },

    // Remove duplicate flights
    removeDuplicates(flights) {
        const seen = new Set();
        return flights.filter(flight => {
            const key = `${flight.airlineCode}_${flight.flightNumber}_${flight.departTime}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    },

    // Mock data fallback
    getMockFlights(params) {
        // Return the existing mock data as fallback
        const fromCode = this.getAirportCode(params.from);
        const toCode = this.getAirportCode(params.to);
        
        return searchFlights(fromCode, toCode, 'one-way');
    },

    // Search airports for autocomplete
    async searchAirports(query) {
        try {
            // Use AviationStack for airport search
            const response = await fetch(`http://api.aviationstack.com/v1/cities?access_key=${this.apiKeys.aviationstack}&search=${query}`);
            
            if (!response.ok) {
                // Fallback to local airport database
                return this.searchLocalAirports(query);
            }
            
            const data = await response.json();
            return data.data.map(airport => ({
                code: airport.iata_code,
                name: airport.airport_name,
                city: airport.city_name,
                country: airport.country_name
            }));

        } catch (error) {
            console.error('Airport search error:', error);
            return this.searchLocalAirports(query);
        }
    },

    // Local airport search fallback
    searchLocalAirports(query) {
        const airports = {
            'DEL': { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' },
            'BOM': { code: 'BOM', name: 'Chhatrapati Shivaji International Airport', city: 'Mumbai', country: 'India' },
            'BLR': { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
            'HYD': { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
            'MAA': { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
            'CCU': { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
            'LHR': { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
            'DXB': { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
            'JFK': { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
            'SIN': { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
            'BKK': { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
            'IST': { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
            'FRA': { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' }
        };

        return Object.values(airports).filter(airport => 
            airport.name.toLowerCase().includes(query.toLowerCase()) ||
            airport.city.toLowerCase().includes(query.toLowerCase()) ||
            airport.code.toLowerCase().includes(query.toLowerCase())
        );
    }
}; 