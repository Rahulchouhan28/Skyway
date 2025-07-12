// Airport Autocomplete using AviationStack API
class AirportAutocomplete {
  constructor(inputElement, options = {}) {
    this.input = inputElement;
    this.apiKey = options.apiKey || '';
    this.minChars = options.minChars || 2;
    this.delay = options.delay || 300;
    this.maxResults = options.maxResults || 5;
    this.onSelect = options.onSelect || function() {};
    
    // Cache for search results
    this.cache = {};
    
    // Create the dropdown container
    this.createDropdown();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // For tracking the current query
    this.currentQuery = '';
    this.timeoutId = null;
  }
  
  createDropdown() {
    // Create container for the autocomplete
    this.container = document.createElement('div');
    this.container.className = 'autocomplete-container';
    
    // Insert container after the input
    this.input.parentNode.insertBefore(this.container, this.input.nextSibling);
    
    // Move the input into the container
    this.container.appendChild(this.input);
    
    // Create dropdown
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'autocomplete-dropdown';
    this.container.appendChild(this.dropdown);
  }
  
  setupEventListeners() {
    // Input event for detecting changes
    this.input.addEventListener('input', () => {
      const query = this.input.value.trim();
      
      if (query.length < this.minChars) {
        this.hideDropdown();
        return;
      }
      
      // Clear previous timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      // Set a new timeout to delay the search
      this.timeoutId = setTimeout(() => {
        if (query !== this.currentQuery) {
          this.currentQuery = query;
          this.search(query);
        }
      }, this.delay);
    });
    
    // Focus event to show dropdown if input has value
    this.input.addEventListener('focus', () => {
      const query = this.input.value.trim();
      if (query.length >= this.minChars && this.dropdown.children.length > 0) {
        this.showDropdown();
      }
    });
    
    // Handle keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      if (!this.dropdown.classList.contains('show')) return;
      
      const items = this.dropdown.querySelectorAll('.autocomplete-item');
      let activeItem = this.dropdown.querySelector('.autocomplete-item.active');
      let activeIndex = -1;
      
      if (activeItem) {
        activeIndex = Array.from(items).indexOf(activeItem);
      }
      
      // Down arrow
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeIndex < items.length - 1) {
          if (activeItem) activeItem.classList.remove('active');
          items[activeIndex + 1].classList.add('active');
          this.scrollToItem(items[activeIndex + 1]);
        }
      }
      
      // Up arrow
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeIndex > 0) {
          if (activeItem) activeItem.classList.remove('active');
          items[activeIndex - 1].classList.add('active');
          this.scrollToItem(items[activeIndex - 1]);
        }
      }
      
      // Enter key
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeItem) {
          this.selectItem(activeItem);
        }
      }
      
      // Escape key
      else if (e.key === 'Escape') {
        e.preventDefault();
        this.hideDropdown();
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }
  
  search(query) {
    // Check if we have this search cached
    if (this.cache[query]) {
      this.renderResults(this.cache[query]);
      return;
    }
    
    // Show loading indicator
    this.showLoading();
    
    // In a real implementation, you would call the AviationStack API here
    // For now, we'll use a mock function that returns sample data
    this.fetchAirports(query)
      .then(results => {
        // Cache the results
        this.cache[query] = results;
        
        // Render the results only if this is still the current query
        if (query === this.currentQuery) {
          this.renderResults(results);
        }
      })
      .catch(error => {
        console.error('Error fetching airports:', error);
        this.renderError();
      });
  }
  
  fetchAirports(query) {
    // Mock implementation - in production, replace with actual API call
    // Example with the real AviationStack API would be:
    /*
    const url = `http://api.aviationstack.com/v1/airports?access_key=${this.apiKey}&search=${query}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => data.data.slice(0, this.maxResults));
    */
    
    // For demonstration purposes, we'll use mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data simulating API response
        const mockAirports = [
          { airport_name: 'Heathrow Airport', iata_code: 'LHR', city_name: 'London', country_name: 'United Kingdom' },
          { airport_name: 'Los Angeles International Airport', iata_code: 'LAX', city_name: 'Los Angeles', country_name: 'United States' },
          { airport_name: 'LaGuardia Airport', iata_code: 'LGA', city_name: 'New York', country_name: 'United States' },
          { airport_name: 'London City Airport', iata_code: 'LCY', city_name: 'London', country_name: 'United Kingdom' },
          { airport_name: 'Las Vegas McCarran International Airport', iata_code: 'LAS', city_name: 'Las Vegas', country_name: 'United States' }
        ];
        
        // Filter airports based on the query
        const filtered = mockAirports.filter(airport => {
          const searchText = query.toLowerCase();
          return (
            airport.airport_name.toLowerCase().includes(searchText) ||
            airport.iata_code.toLowerCase().includes(searchText) ||
            airport.city_name.toLowerCase().includes(searchText)
          );
        }).slice(0, this.maxResults);
        
        resolve(filtered);
      }, 500); // Simulate network delay
    });
  }
  
  renderResults(results) {
    this.dropdown.innerHTML = '';
    
    if (results.length === 0) {
      this.renderEmpty();
      return;
    }
    
    results.forEach((airport, index) => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      if (index === 0) item.classList.add('active');
      
      item.innerHTML = `
        <span class="autocomplete-airport-code">${airport.iata_code}</span>
        <span class="autocomplete-airport-name">${airport.airport_name}</span>
        <span class="autocomplete-airport-city">${airport.city_name}, ${airport.country_name}</span>
      `;
      
      item.addEventListener('click', () => {
        this.selectItem(item, airport);
      });
      
      item.setAttribute('data-airport', JSON.stringify(airport));
      this.dropdown.appendChild(item);
    });
    
    this.showDropdown();
  }
  
  renderEmpty() {
    this.dropdown.innerHTML = '<div class="autocomplete-empty">No airports found</div>';
    this.showDropdown();
  }
  
  renderError() {
    this.dropdown.innerHTML = '<div class="autocomplete-empty">Error fetching results</div>';
    this.showDropdown();
  }
  
  showLoading() {
    this.dropdown.innerHTML = `
      <div class="autocomplete-loading">
        <span class="loading-spinner"></span>
        Searching airports...
      </div>
    `;
    this.showDropdown();
  }
  
  showDropdown() {
    this.dropdown.classList.add('show');
  }
  
  hideDropdown() {
    this.dropdown.classList.remove('show');
  }
  
  selectItem(item, airport = null) {
    const data = airport || JSON.parse(item.getAttribute('data-airport'));
    this.input.value = `${data.iata_code} - ${data.airport_name}`;
    this.hideDropdown();
    this.onSelect(data);
  }
  
  scrollToItem(item) {
    if (!item) return;
    
    const dropdownRect = this.dropdown.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    
    if (itemRect.bottom > dropdownRect.bottom) {
      this.dropdown.scrollTop += itemRect.bottom - dropdownRect.bottom;
    } else if (itemRect.top < dropdownRect.top) {
      this.dropdown.scrollTop -= dropdownRect.top - itemRect.top;
    }
  }
  
  // Public method to clear the input and dropdown
  clear() {
    this.input.value = '';
    this.hideDropdown();
    this.currentQuery = '';
  }
  
  // Public method to set a specific value
  setValue(value, airport = null) {
    this.input.value = value;
    if (airport) {
      this.onSelect(airport);
    }
  }
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
  // Find all inputs with data-autocomplete="airport" attribute
  const airportInputs = document.querySelectorAll('input[data-autocomplete="airport"]');
  
  airportInputs.forEach(input => {
    // Get custom options from data attributes
    const apiKey = input.dataset.apiKey || '';
    const minChars = parseInt(input.dataset.minChars || '2', 10);
    const delay = parseInt(input.dataset.delay || '300', 10);
    
    // Initialize the autocomplete
    new AirportAutocomplete(input, {
      apiKey,
      minChars,
      delay,
      onSelect: (airport) => {
        // You can dispatch a custom event or call a callback
        const event = new CustomEvent('airport-selected', { 
          detail: airport,
          bubbles: true
        });
        input.dispatchEvent(event);
        
        // Also store the selected airport data in a data attribute
        input.setAttribute('data-selected-airport', JSON.stringify(airport));
      }
    });
  });
}); 