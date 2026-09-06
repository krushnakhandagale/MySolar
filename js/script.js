/**
 * ==========================================================================
 * MySolar - JavaScript Logic & Interactive Enhancements
 * Beginner-friendly code structured for learning Web Development & .NET integration.
 * ==========================================================================
 */

// Wait until the entire HTML Document Object Model (DOM) is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  
  // 1. HIGHLIGHT ACTIVE NAVBAR LINK BASED ON CURRENT PAGE
  highlightActiveNavLink();

  // 2. INITIALIZE BOOKING FORM SUBMISSION (If on booking page)
  setupBookingForm();

  // 3. INITIALIZE CONTACT FORM SUBMISSION (If on contact page)
  setupContactForm();

  // 4. AUTO-PREFILL SERVICE TYPE FROM URL PARAMETERS
  prefillServiceFromUrl();
});

/**
 * Automatically adds the 'active' class to the navbar link
 * matching the current page file name (e.g. services.html).
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Sets up client-side form validation and success message modal for Booking Form.
 */
function setupBookingForm() {
  const bookingForm = document.getElementById('solarBookingForm');
  if (!bookingForm) return; // Exit if form is not on current page

  // Set default preferred date to tomorrow
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent full page reload

    // Basic HTML5 validation check
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    // Capture form field values
    const customerName = document.getElementById('fullName').value;
    const panelCount = document.getElementById('panelCount').value;
    const preferredDate = document.getElementById('preferredDate').value;
    const preferredTime = document.getElementById('preferredTime').value;

    // Show dynamic success modal / alert box
    showBookingConfirmationModal(customerName, panelCount, preferredDate, preferredTime);

    // Reset form fields
    bookingForm.reset();
  });
}

/**
 * Creates and shows a bootstrap confirmation modal after successful booking submit.
 */
function showBookingConfirmationModal(name, panels, date, time) {
  // Construct modal HTML dynamically
  const modalHtml = `
    <div class="modal fade" id="bookingSuccessModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-lg">
          <div class="modal-body text-center p-4">
            <div class="mb-3 text-success">
              <i class="bi bi-check-circle-fill display-1"></i>
            </div>
            <h3 class="fw-bold text-dark mb-2">Booking Request Received!</h3>
            <p class="text-muted mb-4">
              Thank you, <strong>${escapeHtml(name)}</strong>! Your cleaning service request for <strong>${panels} solar panels</strong> has been submitted.
            </p>
            <div class="bg-light p-3 rounded-3 text-start mb-4 border">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted"><i class="bi bi-calendar3 me-2"></i>Date:</span>
                <span class="fw-semibold">${escapeHtml(date)}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted"><i class="bi bi-clock me-2"></i>Preferred Time:</span>
                <span class="fw-semibold">${escapeHtml(time)}</span>
              </div>
            </div>
            <p class="small text-muted mb-4">
              <i class="bi bi-info-circle me-1"></i> Our MySolar team will call your mobile number shortly to confirm your cleaner assignment.
            </p>
            <button type="button" class="btn btn-mysolar-primary px-4 py-2 w-100" data-bs-dismiss="modal">
              Done & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove old modal if exists
  const existingModal = document.getElementById('bookingSuccessModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Trigger Bootstrap Modal instance
  const modalElement = document.getElementById('bookingSuccessModal');
  const bsModal = new bootstrap.Modal(modalElement);
  bsModal.show();
}

/**
 * Handles Contact Us page form submission.
 */
function setupContactForm() {
  const contactForm = document.getElementById('mysolarContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const name = document.getElementById('contactName').value;

    // Show quick inline alert message
    const alertContainer = document.getElementById('contactAlertContainer');
    if (alertContainer) {
      alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          <strong>Message Sent!</strong> Thank you ${escapeHtml(name)}, our MySolar team will contact you within 24 hours.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
    }

    contactForm.reset();
  });
}

/**
 * Pre-selects service option on booking.html if 'service' query parameter is present in URL.
 * Example: booking.html?service=residential
 */
function prefillServiceFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  
  if (serviceParam) {
    const serviceSelect = document.getElementById('serviceType');
    if (serviceSelect) {
      serviceSelect.value = serviceParam;
    }
  }
}

/**
 * Helper function to escape HTML string to prevent XSS.
 */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}
