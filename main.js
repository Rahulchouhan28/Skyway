// Initialize the airport autocomplete functionality
document.addEventListener('DOMContentLoaded', function() {
  // Find all input fields with data-autocomplete="airport" attribute
  const airportInputs = document.querySelectorAll('input[data-autocomplete="airport"]');
  
  // Initialize autocomplete for each airport input field
  airportInputs.forEach(input => {
    // Get custom options from data attributes
    const minChars = parseInt(input.dataset.minChars) || 2;
    const delay = parseInt(input.dataset.delay) || 300;
    
    // Initialize autocomplete with options
    new AirportAutocomplete(input, {
      minChars: minChars,
      delay: delay,
      onSelect: function(airport) {
        console.log('Selected airport:', airport);
        // Dispatch a custom event that can be used by other components
        const event = new CustomEvent('airport-selected', {
          detail: airport,
          bubbles: true
        });
        input.dispatchEvent(event);
      }
    });
  });
  
  // Handle airport swap button if it exists
  const swapButton = document.querySelector('.swap-icon');
  if (swapButton) {
    swapButton.addEventListener('click', function() {
      // Get the from and to inputs using their IDs as shown in the HTML
      const fromInput = document.getElementById('from');
      const toInput = document.getElementById('to');
      
      if (fromInput && toInput) {
        // Get the current values
        const fromValue = fromInput.value;
        const toValue = toInput.value;
        
        // Swap the values
        fromInput.value = toValue;
        toInput.value = fromValue;
        
        // Also swap any selected airport data stored in attributes
        const fromAirportData = fromInput.getAttribute('data-selected-airport');
        const toAirportData = toInput.getAttribute('data-selected-airport');
        
        if (fromAirportData) {
          fromInput.setAttribute('data-selected-airport', toAirportData || '');
        }
        
        if (toAirportData) {
          toInput.setAttribute('data-selected-airport', fromAirportData || '');
        }
        
        // Add animation classes for the swap effect if it exists in stylesheet
        fromInput.classList.add('swap-animate');
        toInput.classList.add('swap-animate');
        
        // Remove animation classes after animation completes
        setTimeout(() => {
          fromInput.classList.remove('swap-animate');
          toInput.classList.remove('swap-animate');
        }, 500);
      }
    });
  }
}); 