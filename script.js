// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initMobileMenu();
  initScrollAnimations();
  initBackToTop();
  initFormValidation();
  
  // Show an initial animation on the first elements
  animateOnScroll();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navList = document.querySelector('.nav-list');
  
  if (mobileMenuBtn && navList) {
    mobileMenuBtn.addEventListener('click', function() {
      navList.classList.toggle('active');
      
      // Toggle aria-expanded for accessibility
      const isExpanded = navList.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
      
      // Toggle hamburger animation
      this.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.main-nav') && navList.classList.contains('active')) {
        navList.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Active link highlighting
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
}

// Scroll Animations
function initScrollAnimations() {
  // Get all elements with animate__animated class
  const animatedElements = document.querySelectorAll('.animate__animated');
  
  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the element is in the viewport
      if (entry.isIntersecting) {
        // Get animation delay if it exists
        const delay = entry.target.dataset.aosDelay || 0;
        
        // Apply the animation after the delay
        setTimeout(() => {
          entry.target.classList.add('animate__fadeIn');
        }, delay);
        
        // Unobserve the element after it has been animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 // Trigger when at least 10% of the element is visible
  });
  
  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Initial animation function
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate__animated');
  elements.forEach(element => {
    if (isElementInViewport(element)) {
      element.classList.add('animate__fadeIn');
    }
  });
}

// Check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Back to Top Button
function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
    
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Form Validation
function initFormValidation() {
  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateForm(contactForm)) {
        // Get the form data
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          service: document.getElementById('service').value,
          message: document.getElementById('message').value
        };
        
        // Send email using EmailJS
        sendEmail(formData);
      }
    });
  }
  
  // Add input validation on blur
  const formInputs = document.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateInput(this);
    });
    
    // Clear error when user starts typing
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        const errorMessage = this.parentElement.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.classList.remove('show');
        }
      }
    });
  });
}

// Validate individual input
function validateInput(input) {
  if (!input.hasAttribute('required')) return true;
  
  const errorMessage = input.parentElement.querySelector('.error-message');
  let isValid = true;
  let errorText = '';
  
  // Check for empty fields
  if (input.value.trim() === '') {
    isValid = false;
    errorText = 'This field is required';
  }
  // Email validation
  else if (input.type === 'email' && !validateEmail(input.value)) {
    isValid = false;
    errorText = 'Please enter a valid email address';
  }
  // Phone validation
  else if (input.type === 'tel' && input.value.trim() !== '' && !validatePhone(input.value)) {
    isValid = false;
    errorText = 'Please enter a valid phone number';
  }
  
  // Show/hide error message
  if (!isValid) {
    input.classList.add('error');
    if (errorMessage) {
      errorMessage.textContent = errorText;
      errorMessage.classList.add('show');
    }
  } else {
    input.classList.remove('error');
    if (errorMessage) {
      errorMessage.classList.remove('show');
    }
  }
  
  return isValid;
}

// Validate entire form
function validateForm(form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  let isValid = true;
  
  inputs.forEach(input => {
    const inputValid = validateInput(input);
    if (!inputValid) {
      isValid = false;
    }
  });
  
  // Find the first invalid field and focus on it
  if (!isValid) {
    const firstInvalid = form.querySelector('.error');
    if (firstInvalid) {
      firstInvalid.focus();
    }
  }
  
  return isValid;
}

// Helper function to validate email format
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Helper function to validate phone number
function validatePhone(phone) {
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return re.test(String(phone));
}

// Send form data to our backend and to EmailJS
function sendEmail(formData) {
  // First, send to our PostgreSQL database via our API
  fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success storing in database:', data);
    
    // After successful database storage, you could also send an email notification
    // via a service like EmailJS. For now, we'll just display success message.
    showSuccess('Your message has been sent successfully and stored in our database. We will get back to you soon!');
    document.getElementById('contact-form').reset();
    
    /* 
    // Uncomment to enable EmailJS integration
    return emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      name: formData.name,
      email: formData.email,
      service: formData.service,
      message: formData.message
    });
    */
  })
  /*
  // Uncomment if using EmailJS
  .then(function(response) {
    console.log('Email sent successfully!', response?.status, response?.text);
    showSuccess('Your message has been sent successfully. We will get back to you soon!');
    document.getElementById('contact-form').reset();
  })
  */
  .catch(function(error) {
    console.error('Error in submission process:', error);
    showError('Sorry, there was an error sending your message. Please try again later or contact us directly by phone.');
  });
}

// Show success message
function showSuccess(message) {
  const successMessage = document.getElementById('success-message');
  const successText = document.getElementById('success-text');
  
  if (successMessage && successText) {
    successText.textContent = message;
    successMessage.classList.add('active');
    
    // Set focus to the success message for accessibility
    successMessage.focus();
    
    // Add click event to close button if it exists
    const closeSuccess = document.querySelector('.close-success');
    if (closeSuccess) {
      closeSuccess.addEventListener('click', function() {
        successMessage.classList.remove('active');
      });
    }
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      successMessage.classList.remove('active');
    }, 5000);
  }
}

// Show error message
function showError(message) {
  alert(message); // Simple fallback
  // You could implement a more sophisticated error message display here
}

// Smooth scrolling for navigation links
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
    const targetId = e.target.getAttribute('href');
    
    // Skip if it's an empty hash
    if (targetId === '#') return;
    
    e.preventDefault();
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Close mobile menu if open
      const navList = document.querySelector('.nav-list');
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      
      if (navList && navList.classList.contains('active')) {
        navList.classList.remove('active');
        if (mobileMenuBtn) {
          mobileMenuBtn.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
      
      // Smooth scroll to the element
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Account for header height
        behavior: 'smooth'
      });
    }
  }
});

// Handle dark mode toggle based on user's system preference
function toggleDarkMode(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Check user's preferred color scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  toggleDarkMode(true);
}

// Listen for changes in the user's color scheme preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  toggleDarkMode(e.matches);
});