/**
 * SkyWay Flight Booking — Advanced Engine
 * @module SkyWay
 * @description Dynamic flight search, seat selection, multi-step booking wizard,
 *   localStorage persistence, dark-mode, and responsive UI.
 * @version 2.0.0
 * @license MIT
 */

document.addEventListener('DOMContentLoaded', () => {
    SkyWay.init();
});

/** @returns {string} Saved theme or system preference */
const getStoredTheme = () => {
    try {
        return localStorage.getItem('theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch {
        return 'light';
    }
};

/** @returns {Array} Saved bookings from localStorage */
const getStoredBookings = () => {
    try {
        return JSON.parse(localStorage.getItem('skyway_bookings') ?? '[]');
    } catch {
        return [];
    }
};

const SkyWay = {
    theme: getStoredTheme(),
    bookings: getStoredBookings(),
    currentBooking: null,
    bookingStep: 1,

    init() {
        this.initAOS();
        this.initTheme();
        this.initNavigation();
        this.initModals();
        this.initSearchForm();
        this.initFlightResults();
        this.initTravelerDropdown();
        this.initBookingWizard();
        this.initMyBookings();
        this.initAuthModals();
        this.initNewsletter();
        this.initScrollEffects();
        this.initHeroParticles();
        this.initAccessibility();
        this.updateCopyright();
        
        // Initial theme apply
        document.documentElement.setAttribute('data-theme', this.theme);
    },

    /** Scroll progress bar + back-to-top button */
    initScrollEffects() {
        const progressBar = document.getElementById('scroll-progress');
        const backToTop = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            if (progressBar) progressBar.style.width = `${pct}%`;

            if (backToTop) {
                backToTop.style.display = scrollTop > 400 ? 'flex' : 'none';
            }
        });

        backToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    /** Animated floating particles in hero section */
    initHeroParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
        hero.style.position = 'relative';
        hero.insertBefore(canvas, hero.firstChild);

        // Ensure hero-content stays above particles
        const content = hero.querySelector('.hero-content');
        if (content) content.style.position = 'relative';
        if (content) content.style.zIndex = '2';

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId = null;

        const resize = () => {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 1,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.3 - 0.2,
                alpha: Math.random() * 0.4 + 0.1
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) { p.y = canvas.height; p.alpha = Math.random() * 0.4 + 0.1; }
            }
            animId = requestAnimationFrame(draw);
        };
        draw();
    },

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, easing: 'ease-out-cubic', once: false });
        }
    },

    initTheme() {
        const toggle = document.getElementById('theme-toggle');
        this.updateThemeIcon(toggle);
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.theme = this.theme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', this.theme);
                localStorage.setItem('theme', this.theme);
                this.updateThemeIcon(toggle);
            });
        }
    },

    updateThemeIcon(btn) {
        if (!btn) return;
        const icon = btn.querySelector('i');
        icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    },

    initNavigation() {
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 80);
        });

        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        if (burger && nav) {
            burger.addEventListener('click', (e) => {
                e.stopPropagation();
                nav.classList.toggle('active');
                burger.classList.toggle('active');
            });
            
            // Close mobile menu when any interactive element inside is clicked (except theme toggle)
            nav.querySelectorAll('a, button:not(.theme-toggle)').forEach(el => {
                el.addEventListener('click', () => {
                    nav.classList.remove('active');
                    burger.classList.remove('active');
                });
            });

            // Close when clicking outside of the menu
            document.addEventListener('click', (e) => {
                if (nav.classList.contains('active') && !nav.contains(e.target) && !burger.contains(e.target)) {
                    nav.classList.remove('active');
                    burger.classList.remove('active');
                }
            });
        }
    },

    initModals() {
        const closeBtns = document.querySelectorAll('.close-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
                document.body.style.overflow = 'auto';
            });
        });

        // Close confirmation modal
        document.querySelector('.close-confirmation')?.addEventListener('click', () => {
            document.getElementById('confirmation-modal').classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    },

    // --- Traveler / Passenger Select ---
    initTravelerDropdown() {
        const trigger = document.getElementById('traveler-trigger');
        const dropdown = document.getElementById('traveler-dropdown');
        const doneBtn = document.getElementById('traveler-done');

        if (!trigger || !dropdown) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Traveler trigger clicked');
            dropdown.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== trigger) {
                dropdown.classList.remove('active');
            }
        });

        // Counters
        dropdown.querySelectorAll('.counter').forEach(counter => {
            const input = counter.querySelector('input');
            const plus = counter.querySelector('.plus');
            const minus = counter.querySelector('.minus');

            plus.addEventListener('click', () => {
                input.value = parseInt(input.value) + 1;
                this.updateTravelerTrigger();
            });

            minus.addEventListener('click', () => {
                const min = parseInt(input.getAttribute('min'));
                if (parseInt(input.value) > min) {
                    input.value = parseInt(input.value) - 1;
                    this.updateTravelerTrigger();
                }
            });
        });

        document.getElementById('cabin-class').addEventListener('change', () => this.updateTravelerTrigger());
        doneBtn.addEventListener('click', () => dropdown.classList.remove('active'));
    },

    updateTravelerTrigger() {
        const adults = document.getElementById('adults').value;
        const children = document.getElementById('children').value;
        const cabin = document.getElementById('cabin-class').value;
        const total = parseInt(adults) + parseInt(children);
        const trigger = document.getElementById('traveler-trigger');
        trigger.textContent = `${total} Traveler${total > 1 ? 's' : ''}, ${cabin.charAt(0).toUpperCase() + cabin.slice(1)}`;
    },

    // --- Search Engine ---
    initSearchForm() {
        const form = document.getElementById('flight-search-form');

        const swap = document.querySelector('.swap-icon');
        if (swap) {
            const fromInput = document.getElementById('from');
            const toInput = document.getElementById('to');
            swap.addEventListener('click', () => {
                const temp = fromInput.value;
                fromInput.value = toInput.value;
                toInput.value = temp;
                swap.style.transform = `rotate(${Math.random() * 360}deg)`;
            });
        }

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performEnhancedSearch();
        });
    },

    performEnhancedSearch() {
        this.showLoadingOverlay('Generating Real-time Options...');
        this.toggleProgressBar(true);

        setTimeout(() => {
            this.hideLoadingOverlay();
            this.toggleProgressBar(false);
            
            const resultsSection = document.getElementById('flight-results');
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });

            const matched = this.generateDynamicFlights();
            this.displayFlights(matched);
            this.showNotification(`Found ${matched.length} flights for your trip!`, 'success');
        }, 1500);
    },

    generateDynamicFlights() {
        const from = document.getElementById('from').value;
        const to = document.getElementById('to').value;
        const results = [];
        const airlines = Object.keys(this.airlineData);
        
        for (let i = 0; i < 8; i++) {
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const price = Math.floor(Math.random() * 400) + 150;
            results.push({
                id: 'FL' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                airlineCode: airline,
                airlineName: this.airlineData[airline].name,
                airlineLogo: this.airlineData[airline].logo,
                from: from.match(/\((.*?)\)/)?.[1] || 'XYZ',
                to: to.match(/\((.*?)\)/)?.[1] || 'ABC',
                depart: '10:30 AM',
                arrive: '02:45 PM',
                duration: '4h 15m',
                price: price,
                type: Math.random() > 0.7 ? '1 Stop' : 'Non-stop'
            });
        }
        return results.sort((a,b) => a.price - b.price);
    },

    displayFlights(flights) {
        const list = document.getElementById('results-list');
        list.innerHTML = flights.map((f, idx) => `
            <div class="flight-card" data-aos="fade-up" data-aos-delay="${idx * 50}">
                <div class="airline-info">
                    <div class="airline-logo-custom ${f.airlineLogo}">${f.airlineCode}</div>
                    <div class="flight-details">
                        <h3>${f.airlineName}</h3>
                        <p>${f.type} | ${f.depart} - ${f.arrive}</p>
                        <p class="flight-number">Flight ${f.id}</p>
                    </div>
                </div>
                <div class="price-section">
                    <span class="price">$${f.price}</span>
                    <button class="btn-book" onclick="SkyWay.startBooking('${f.id}', ${f.price}, '${f.airlineName}')">
                        <i class="fas fa-ticket-alt"></i> Book
                    </button>
                </div>
            </div>
        `).join('');
    },

    // --- Booking Logic ---
    startBooking(id, price, airline) {
        this.currentBooking = { id, price, airline, passengers: [], seats: [] };
        this.bookingStep = 1;
        this.updateWizard();
        document.getElementById('booking-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    updateWizard() {
        const content = document.getElementById('wizard-content');
        const nextBtn = document.getElementById('next-step');
        const prevBtn = document.getElementById('prev-step');
        
        // Update Steps UI
        document.querySelectorAll('.step').forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.step) === this.bookingStep);
        });

        prevBtn.style.display = this.bookingStep > 1 ? 'block' : 'none';
        nextBtn.textContent = this.bookingStep === 3 ? 'Confirm & Pay' : 'Next';

        switch(this.bookingStep) {
            case 1: content.innerHTML = this.renderSeatMap(); break;
            case 2: content.innerHTML = this.renderPassengerForm(); break;
            case 3: content.innerHTML = this.renderPaymentForm(); break;
        }
    },

    initBookingWizard() {
        const nextBtn = document.getElementById('next-step');
        const prevBtn = document.getElementById('prev-step');

        console.log('Wizard buttons initialized:', { nextBtn, prevBtn });

        nextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next step clicked. Current step:', this.bookingStep);
            if (this.bookingStep < 3) {
                if (this.validateWizardStep()) {
                    this.bookingStep++;
                    this.updateWizard();
                }
            } else {
                this.finalizeBooking();
            }
        });

        prevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Prev step clicked. Current step:', this.bookingStep);
            this.bookingStep--;
            this.updateWizard();
        });
    },

    validateWizardStep() {
        console.log('Validating step:', this.bookingStep);
        if (this.bookingStep === 1) {
            if (this.currentBooking.seats.length === 0) {
                this.showNotification('Please select a seat', 'warning');
                return false;
            }
        }
        return true;
    },

    renderSeatMap() {
        let html = `<div class="seat-map-container">
            <h4>Select Seats for ${this.currentBooking.airline}</h4>
            <div class="seat-map-grid">`;
        
        for (let i = 1; i <= 36; i++) {
            const isAisle = i % 7 === 4;
            const row = Math.ceil(i/7);
            const letter = ['A','B','C','','D','E','F'][i % 7];
            const seatId = `${row}${letter}`;
            
            if (isAisle) {
                html += `<div class="seat aisle"></div>`;
            } else {
                const isOccupied = Math.random() > 0.8;
                const isSelected = this.currentBooking.seats.includes(seatId);
                html += `<div class="seat ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}" 
                        onclick="SkyWay.toggleSeat('${seatId}', this)">${seatId}</div>`;
            }
        }
        html += `</div><div class="seat-legend">
            <span><div class="seat"></div> Available</span>
            <span><div class="seat occupied"></div> Occupied</span>
            <span><div class="seat selected"></div> Selected</span>
        </div></div>`;
        return html;
    },

    toggleSeat(id, el) {
        if (el.classList.contains('occupied')) return;
        const idx = this.currentBooking.seats.indexOf(id);
        if (idx === -1) {
            this.currentBooking.seats.push(id);
            el.classList.add('selected');
        } else {
            this.currentBooking.seats.splice(idx, 1);
            el.classList.remove('selected');
        }
    },

    renderPassengerForm() {
        return `
            <div class="passenger-form p-3">
                <h4>Traveler Information</h4>
                <div class="form-group mb-3">
                    <label>Full Name (as per Passport)</label>
                    <input type="text" class="form-control" id="p-name" placeholder="John Doe">
                </div>
                <div class="form-row">
                    <div class="form-group col">
                        <label>Passport Number</label>
                        <input type="text" class="form-control" id="p-passport" placeholder="Z1234567">
                    </div>
                    <div class="form-group col">
                        <label>Nationality</label>
                        <input type="text" class="form-control" id="p-nat" placeholder="United States">
                    </div>
                </div>
            </div>
        `;
    },

    renderPaymentForm() {
        return `
            <div class="payment-form p-3">
                <h4>Secure Payment</h4>
                <p class="text-muted">Total to pay: <strong>$${this.currentBooking.price}</strong></p>
                <div class="form-group mb-3">
                    <label>Card Number</label>
                    <input type="text" class="form-control" placeholder="0000 0000 0000 0000">
                </div>
                <div class="form-row">
                    <div class="form-group col">
                        <label>Expiry</label>
                        <input type="text" class="form-control" placeholder="MM/YY">
                    </div>
                    <div class="form-group col">
                        <label>CVV</label>
                        <input type="password" class="form-control" placeholder="***">
                    </div>
                </div>
                <div class="mt-4"><i class="fas fa-lock"></i> Secured by SkyWay SSL</div>
            </div>
        `;
    },

    finalizeBooking() {
        this.showLoadingOverlay('Securing your seat...');
        setTimeout(() => {
            const pName = document.getElementById('p-name')?.value || 'Guest traveler';
            const booking = {
                ...this.currentBooking,
                passengerName: pName,
                date: new Date().toLocaleDateString(),
                ref: 'SW' + Math.floor(100000 + Math.random() * 900000)
            };
            this.bookings.push(booking);
            localStorage.setItem('skyway_bookings', JSON.stringify(this.bookings));
            
            this.hideLoadingOverlay();
            document.getElementById('booking-modal').classList.remove('active');
            this.showTicket(booking);
        }, 2000);
    },

    showTicket(b) {
        const modal = document.getElementById('confirmation-modal');
        const content = document.getElementById('ticket-content');
        
        content.innerHTML = `
            <div class="e-ticket">
                <div class="ticket-header">
                    <div>
                        <h2>TICKET CONFIRMED</h2>
                        <p class="text-muted">Ref: <strong>${b.ref}</strong></p>
                    </div>
                    <i class="fas fa-plane-departure fa-3x text-primary"></i>
                </div>
                <div class="ticket-route">
                    <div class="route-item"><h2>${b.from}</h2><p>Origin</p></div>
                    <div class="route-icon"><i class="fas fa-long-arrow-alt-right"></i></div>
                    <div class="route-item"><h2>${b.to}</h2><p>Destination</p></div>
                </div>
                <div class="ticket-info row">
                    <div class="col-6"><strong>Passenger:</strong> ${b.passengerName}</div>
                    <div class="col-6"><strong>Flight:</strong> ${b.id}</div>
                    <div class="col-6 mt-2"><strong>Seat:</strong> ${b.seats.join(', ')}</div>
                    <div class="col-6 mt-2"><strong>Airline:</strong> ${b.airline}</div>
                </div>
            </div>
        `;
        modal.classList.add('active');
    },

    initMyBookings() {
        document.getElementById('view-bookings')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.renderMyBookings();
            document.getElementById('my-bookings-modal').classList.add('active');
        });
    },

    renderMyBookings() {
        const list = document.getElementById('bookings-list');
        if (this.bookings.length === 0) {
            list.innerHTML = `<div class="p-5 text-center">No bookings found. <br> Start searching to book your first trip!</div>`;
            return;
        }
        list.innerHTML = this.bookings.map(b => `
            <div class="booking-card">
                <div>
                    <h5 class="mb-1">${b.from} → ${b.to}</h5>
                    <p class="small text-muted mb-0">${b.date} | Ref: ${b.ref}</p>
                </div>
                <div class="text-end">
                    <div class="badge bg-success mb-2">Confirmed</div>
                    <div><strong>$${b.price}</strong></div>
                </div>
            </div>
        `).join('');
    },

    // --- Utilities ---
    showNotification(msg, type) {
        const container = document.getElementById('notification-container');
        const note = document.createElement('div');
        note.className = `notification ${type}`;
        note.innerHTML = `<span>${msg}</span>`;
        container.appendChild(note);
        setTimeout(() => note.remove(), 4000);
    },

    showLoadingOverlay(msg) {
        const overlay = document.getElementById('loading-overlay');
        overlay.querySelector('p').textContent = msg;
        overlay.classList.add('active');
    },

    hideLoadingOverlay() { document.getElementById('loading-overlay').classList.remove('active'); },
    toggleProgressBar(show) { document.getElementById('progress-bar').classList.toggle('active', show); },

    initFlightResults() {
        // Hide results section on load
        const resultsSection = document.getElementById('flight-results');
        if (resultsSection) resultsSection.style.display = 'none';

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Static book buttons
        document.querySelectorAll('.btn-book').forEach(btn => {
            if (!btn.getAttribute('onclick')) {
                btn.addEventListener('click', () => {
                    const card = btn.closest('.flight-card');
                    const airline = card?.querySelector('h3')?.textContent || 'Airline';
                    const priceText = card?.querySelector('.price')?.textContent || '$500';
                    const price = parseInt(priceText.replace('$', ''));
                    const id = 'FL' + Math.random().toString(36).substr(2, 6).toUpperCase();
                    SkyWay.startBooking(id, price, airline);
                });
            }
        });
    },

    initAuthModals() {
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');

        document.querySelector('.btn-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        document.querySelector('.btn-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        document.getElementById('signup-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            signupModal.classList.add('active');
        });

        document.getElementById('login-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.classList.remove('active');
            loginModal.classList.add('active');
        });

        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.showNotification('Logged in successfully!', 'success');
        });

        document.getElementById('signup-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            signupModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.showNotification('Account created successfully!', 'success');
        });
    },

    initNewsletter() {
        document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = e.target.querySelector('input[type="email"]');
            if (input && input.value) {
                this.showNotification('Subscribed successfully! Check your inbox.', 'success');
                input.value = '';
            }
        });
    },

    updateCopyright() {
        const el = document.querySelector('.copyright p');
        if (el) el.innerHTML = `&copy; ${new Date().getFullYear()} SkyWay. All rights reserved.`;
    },

    initAccessibility() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
                document.body.style.overflow = 'auto';
            }
        });
    },

    /** @type {Record<string,string>} IATA code → display name */
    airports: {
        'DEL': 'Delhi (DEL)', 'BOM': 'Mumbai (BOM)', 'BLR': 'Bangalore (BLR)',
        'HYD': 'Hyderabad (HYD)', 'MAA': 'Chennai (MAA)', 'CCU': 'Kolkata (CCU)',
        'DXB': 'Dubai (DXB)', 'LHR': 'London (LHR)', 'JFK': 'New York (JFK)',
        'LAX': 'Los Angeles (LAX)', 'CDG': 'Paris (CDG)', 'SIN': 'Singapore (SIN)',
        'NRT': 'Tokyo (NRT)', 'SYD': 'Sydney (SYD)', 'FRA': 'Frankfurt (FRA)',
        'BKK': 'Bangkok (BKK)', 'IST': 'Istanbul (IST)'
    },

    /** @type {Record<string, {name:string, logo:string}>} */
    airlineData: {
        'AI': { name: 'Air India', logo: 'airindia' },
        '6E': { name: 'IndiGo', logo: 'indigo' },
        'EK': { name: 'Emirates', logo: 'emirates' },
        'LH': { name: 'Lufthansa', logo: 'lufthansa' },
        'QR': { name: 'Qatar Airways', logo: 'qatar' },
        'SQ': { name: 'Singapore Airlines', logo: 'singapore' },
        'BA': { name: 'British Airways', logo: 'british' },
        'TK': { name: 'Turkish Airlines', logo: 'turkish' },
        'SG': { name: 'SpiceJet', logo: 'spicejet' },
        'EY': { name: 'Etihad Airways', logo: 'etihad' }
    }
};