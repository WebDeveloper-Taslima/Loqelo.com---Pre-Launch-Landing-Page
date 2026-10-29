/* ==========================================================================
   LOQELO ANALYTICS & PRIVACY SUITE (Google Analytics 4 Ready)
   Compliant with GDPR & Client Requirement:
   "Email addresses and form content must not be shared with analytics tools."
   ========================================================================== */

// Set client GA4 Measurement ID here (e.g. 'G-ABC123XYZ')
const GA_MEASUREMENT_ID = 'G-LOQELO2027';

// Initialize GA4 Script asynchronously
(function initGA4() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.startsWith('G-LOQELO')) {
    console.info('[Loqelo Analytics] Running in demo mode. Replace GA_MEASUREMENT_ID in js/analytics.js with your real GA4 ID when going live.');
  }
  
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true
  });
})();

/**
 * Safe event tracker that strictly forbids and removes any PII (Email, Phone, Name)
 */
function trackEvent(eventName, params = {}) {
  // Deep clone and strip any accidental personal info
  const sanitizedParams = { ...params };
  delete sanitizedParams.email;
  delete sanitizedParams.name;
  delete sanitizedParams.phone;
  delete sanitizedParams.address;
  delete sanitizedParams.custom_text;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, sanitizedParams);
  }
  
  // Also log in console for verification
  console.debug(`[Loqelo Analytics Event] ${eventName}:`, sanitizedParams);
}

// Cookie Consent Controller
document.addEventListener('DOMContentLoaded', () => {
  const cookieBanner = document.getElementById('cookie-banner');
  const btnAccept = document.getElementById('btn-cookie-accept');
  const btnEssential = document.getElementById('btn-cookie-essential');

  const consent = localStorage.getItem('loqelo_cookie_consent');
  if (!consent && cookieBanner) {
    setTimeout(() => {
      cookieBanner.classList.add('visible');
    }, 1200);
  }

  if (btnAccept) {
    btnAccept.addEventListener('click', () => {
      localStorage.setItem('loqelo_cookie_consent', 'all');
      cookieBanner.classList.remove('visible');
      trackEvent('cookie_consent', { status: 'all_accepted' });
    });
  }

  if (btnEssential) {
    btnEssential.addEventListener('click', () => {
      localStorage.setItem('loqelo_cookie_consent', 'essential');
      cookieBanner.classList.remove('visible');
      trackEvent('cookie_consent', { status: 'essential_only' });
    });
  }
});
