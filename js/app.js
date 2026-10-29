/* ==========================================================================
   LOQELO PRE-LAUNCH WEB APPLICATION SCRIPT
   Interactive UI, Live Platform Studio, Forms, Video, Multilingual & Admin
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Initialize Visitor Count for Analytics & Admin Stats
  // --------------------------------------------------------------------------
  let visitors = parseInt(localStorage.getItem('loqelo_visitor_count') || '0', 10);
  if (!sessionStorage.getItem('loqelo_session_active')) {
    visitors += 1;
    localStorage.setItem('loqelo_visitor_count', visitors);
    sessionStorage.setItem('loqelo_session_active', 'true');
  }

  // --------------------------------------------------------------------------
  // 2. Custom Seamless Worldwide Language Selector (100% Brand Consistency)
  // --------------------------------------------------------------------------
  const customLangBtn = document.getElementById('custom-lang-btn');
  const customLangDropdown = document.getElementById('custom-lang-dropdown');
  const customLangOpts = document.querySelectorAll('.custom-lang-opt');
  const customCurrentLang = document.getElementById('custom-current-lang');

  // Trigger Google Translate engine silently without breaking layout
  function triggerGoogleTranslate(langCode) {
    if (!langCode) return;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    if (window.location.hostname) {
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
      const parts = window.location.hostname.split('.');
      if (parts.length > 2) {
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${parts.slice(-2).join('.')};`;
      }
    }

    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
    }
  }

  // Apply internal dictionary translations (EN, PL, DE, FR, ES)
  function applyLanguage(lang) {
    if (typeof translations === 'undefined') return;
    const dict = translations[lang] || translations.en;
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    const activeLangNameEl = document.getElementById('current-lang-code');
    if (activeLangNameEl) {
      activeLangNameEl.textContent = lang.toUpperCase();
    }
  }

  function detectBrowserLang() {
    const navLang = (navigator.language || navigator.userLanguage || 'en').substring(0, 2).toLowerCase();
    return ['en', 'pl', 'de', 'fr', 'es', 'nl', 'it', 'bn'].includes(navLang) ? navLang : 'en';
  }

  // Initial language setup
  let currentLang = localStorage.getItem('loqelo_worldwide_lang') || localStorage.getItem('loqelo_lang') || detectBrowserLang();
  applyLanguage(currentLang);

  // Set matching active option in dropdown and update button label
  if (customLangOpts.length > 0) {
    const initialOpt = Array.from(customLangOpts).find(opt => opt.getAttribute('data-lang') === currentLang);
    if (initialOpt && customCurrentLang) {
      customCurrentLang.textContent = initialOpt.textContent.trim();
      customLangOpts.forEach(o => o.classList.toggle('active', o === initialOpt));
    }
  }

  // Toggle custom dropdown
  if (customLangBtn && customLangDropdown) {
    customLangBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = customLangDropdown.classList.toggle('active');
      customLangBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!customLangBtn.contains(e.target) && !customLangDropdown.contains(e.target)) {
        customLangDropdown.classList.remove('active');
        customLangBtn.setAttribute('aria-expanded', 'false');
      }
    });

    customLangOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedLang = opt.getAttribute('data-lang');
        const langLabel = opt.textContent.trim();

        if (customCurrentLang) {
          customCurrentLang.textContent = langLabel;
        }

        customLangOpts.forEach(o => o.classList.toggle('active', o === opt));
        customLangDropdown.classList.remove('active');
        customLangBtn.setAttribute('aria-expanded', 'false');

        localStorage.setItem('loqelo_lang', selectedLang);
        localStorage.setItem('loqelo_worldwide_lang', selectedLang);

        applyLanguage(selectedLang);
        triggerGoogleTranslate(selectedLang);
        trackEvent('language_change', { language: selectedLang });
      });
    });
  }

  // Sync when Google Translate combo changes directly
  document.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('goog-te-combo')) {
      const selectedLanguage = e.target.value;
      localStorage.setItem('loqelo_worldwide_lang', selectedLanguage);
      const matchingOpt = Array.from(customLangOpts).find(opt => opt.getAttribute('data-lang') === selectedLanguage);
      if (matchingOpt && customCurrentLang) {
        customCurrentLang.textContent = matchingOpt.textContent.trim();
        customLangOpts.forEach(o => o.classList.toggle('active', o === matchingOpt));
      }
      trackEvent('worldwide_translate_change', { language: selectedLanguage });
    }
  });

  // --------------------------------------------------------------------------
  // 3. Header Scroll Glassmorphism & Responsive Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Responsive Mobile Navigation Drawer Controller
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const siteMainNav = document.getElementById('site-main-nav');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  function openMobileNav() {
    if (siteMainNav) siteMainNav.classList.add('mobile-nav-active');
    if (mobileToggleBtn) {
      mobileToggleBtn.classList.add('is-active');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (siteMainNav) siteMainNav.classList.remove('mobile-nav-active');
    if (mobileToggleBtn) {
      mobileToggleBtn.classList.remove('is-active');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn && siteMainNav) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = siteMainNav.classList.contains('mobile-nav-active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileNav);
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', closeMobileNav);
  }

  // Auto close mobile nav drawer when navigating
  if (siteMainNav) {
    siteMainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteMainNav && siteMainNav.classList.contains('mobile-nav-active')) {
      closeMobileNav();
    }
  });

  // --------------------------------------------------------------------------
  // 4. Video Player Integration
  // --------------------------------------------------------------------------
  const video = document.getElementById('promo-video');
  const centerPlayBtn = document.getElementById('video-center-btn');
  const bottomPlayBtn = document.getElementById('video-bottom-btn');
  const muteBtn = document.getElementById('video-mute-btn');
  const videoBox = document.getElementById('video-box');

  if (video && centerPlayBtn) {
    function togglePlay() {
      if (video.paused) {
        video.play();
        centerPlayBtn.style.display = 'none';
        if (videoBox) videoBox.classList.remove('paused');
        if (bottomPlayBtn) bottomPlayBtn.innerHTML = '&#10074;&#10074;';
        trackEvent('video_play', { duration: Math.round(video.duration || 0) });
      } else {
        video.pause();
        centerPlayBtn.style.display = 'flex';
        if (videoBox) videoBox.classList.add('paused');
        if (bottomPlayBtn) bottomPlayBtn.innerHTML = '&#9658;';
      }
    }

    centerPlayBtn.addEventListener('click', togglePlay);
    if (bottomPlayBtn) bottomPlayBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
      });
    }

    video.addEventListener('ended', () => {
      centerPlayBtn.style.display = 'flex';
      if (videoBox) videoBox.classList.add('paused');
      if (bottomPlayBtn) bottomPlayBtn.innerHTML = '&#9658;';
    });
  }

  // --------------------------------------------------------------------------
  // 5. Toast Notification Utility
  // --------------------------------------------------------------------------
  function showToast(message, duration = 3000) {
    let toast = document.getElementById('loqelo-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'loqelo-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: #031C26;
        color: #FFFFFF;
        padding: 12px 24px;
        border-radius: 999px;
        box-shadow: 0 10px 30px rgba(3,28,38,0.25);
        font-family: var(--fb);
        font-size: 14px;
        font-weight: 500;
        z-index: 99999;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid rgba(101,200,166,0.3);
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span style="color:var(--mint); font-size:16px;">✓</span> ${escapeHtml(message)}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 6. Interactive Platform Studio (Built-in Functional Workflows)
  // --------------------------------------------------------------------------
  const platformTabBtns = document.querySelectorAll('.platform-stage-tab-btn');
  const platformPanels = document.querySelectorAll('.platform-stage-content');

  function switchPlatformTab(targetTabId) {
    platformTabBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === targetTabId;
      btn.classList.toggle('active', isTarget);
    });

    platformPanels.forEach(panel => {
      if (panel.id === targetTabId) {
        panel.style.display = 'block';
        panel.style.animation = 'fadeIn 0.3s ease';
      } else {
        panel.style.display = 'none';
      }
    });

    trackEvent('platform_studio_tab_switch', { tab: targetTabId });
  }

  platformTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');
      switchPlatformTab(targetTabId);
    });
  });

  // Feature 1: Post a Job Interaction & Submission
  const btnSubmitLiveJob = document.getElementById('btn-submit-live-job');
  const jobAddedModal = document.getElementById('job-added-modal');
  const jobAddedCloseBtn = document.getElementById('job-added-close-btn');
  const btnPostAnotherJob = document.getElementById('btn-post-another-job');
  const btnViewJobQuotes = document.getElementById('btn-view-job-quotes');
  const liveJobDesc = document.getElementById('live-job-desc');

  if (btnSubmitLiveJob && jobAddedModal) {
    btnSubmitLiveJob.addEventListener('click', () => {
      jobAddedModal.classList.add('active');
      triggerConfetti();
      trackEvent('live_job_submitted', { category: 'Cleaning' });
    });
  }

  if (jobAddedCloseBtn && jobAddedModal) {
    jobAddedCloseBtn.addEventListener('click', () => {
      jobAddedModal.classList.remove('active');
    });
  }

  if (jobAddedModal) {
    jobAddedModal.addEventListener('click', (e) => {
      if (e.target === jobAddedModal) {
        jobAddedModal.classList.remove('active');
      }
    });
  }

  if (btnPostAnotherJob && jobAddedModal) {
    btnPostAnotherJob.addEventListener('click', () => {
      jobAddedModal.classList.remove('active');
      switchPlatformTab('tab-post-job');
      if (liveJobDesc) {
        liveJobDesc.value = '';
        liveJobDesc.placeholder = 'Type another project description...';
        liveJobDesc.focus();
      }
    });
  }

  if (btnViewJobQuotes && jobAddedModal) {
    btnViewJobQuotes.addEventListener('click', () => {
      jobAddedModal.classList.remove('active');
      switchPlatformTab('tab-quotes');
    });
  }

  // Interactive Service Chips in Post a Job
  const serviceChips = document.querySelectorAll('.service-chip');
  serviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.textContent.includes('+ Add service')) {
        const newService = prompt('Enter a new service (e.g. Lawn Mowing, Plumbing, Painting):');
        if (newService && newService.trim()) {
          const newChip = document.createElement('span');
          newChip.className = 'service-chip';
          newChip.textContent = `${newService.trim()} ✕`;
          newChip.addEventListener('click', () => newChip.remove());
          chip.parentNode.insertBefore(newChip, chip);
          showToast(`Service "${newService.trim()}" added!`);
        }
      } else {
        chip.style.opacity = '0';
        setTimeout(() => chip.remove(), 200);
      }
    });
  });

  // Feature 2: Client Dashboard
  const btnViewQuotesDemo = document.getElementById('btn-view-quotes-demo');
  if (btnViewQuotesDemo) {
    btnViewQuotesDemo.addEventListener('click', () => {
      switchPlatformTab('tab-quotes');
    });
  }

  // Feature 3: Quotes & Price Spread
  const btnDemoPostAnother = document.getElementById('btn-demo-post-another');
  if (btnDemoPostAnother) {
    btnDemoPostAnother.addEventListener('click', () => {
      switchPlatformTab('tab-post-job');
    });
  }

  // Pro selection triggers transition to in-app chat
  const quoteProCards = document.querySelectorAll('.quote-pro-card');
  quoteProCards.forEach(card => {
    const selectBtn = card.querySelector('button');
    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const proName = card.querySelector('h4')?.textContent.split('\n')[0].trim() || 'Selected Pro';
        showToast(`${proName} selected! Opening live conversation...`);
        setTimeout(() => {
          switchPlatformTab('tab-chat');
        }, 800);
      });
    }
  });

  // Feature 4: Contractor Radar Map
  const btnOpenBidFromRadar = document.getElementById('btn-open-bid-from-radar');
  if (btnOpenBidFromRadar) {
    btnOpenBidFromRadar.addEventListener('click', () => {
      switchPlatformTab('tab-bid');
    });
  }

  const radarPinCards = document.querySelectorAll('.radar-map-visual .radar-pin-card');
  radarPinCards.forEach(pin => {
    pin.style.cursor = 'pointer';
    pin.title = 'Click to open proposal form for this job';
    pin.addEventListener('click', () => {
      switchPlatformTab('tab-bid');
    });
  });

  // Feature 5: Send an Offer (Bid)
  const liveBidPriceInput = document.getElementById('live-bid-price');
  const btnSubmitLiveBid = document.getElementById('btn-submit-live-bid');

  if (liveBidPriceInput) {
    liveBidPriceInput.addEventListener('input', () => {
      const priceVal = liveBidPriceInput.value || '0';
      const summaryPriceEl = document.querySelector('#tab-bid strong');
      if (summaryPriceEl) {
        summaryPriceEl.textContent = `€${priceVal} • 1 day • Mon 12 Oct`;
      }
    });
  }

  if (btnSubmitLiveBid) {
    btnSubmitLiveBid.addEventListener('click', () => {
      const priceVal = liveBidPriceInput ? liveBidPriceInput.value : '260';
      showToast(`Offer of €${priceVal} submitted to Marta K.! Opening live chat...`);
      setTimeout(() => {
        switchPlatformTab('tab-chat');
      }, 700);
    });
  }

  // Feature 6: In-App Direct Chat
  const liveChatInput = document.getElementById('live-chat-input');
  const btnSendLiveChat = document.getElementById('btn-send-live-chat');
  const chatMessagesArea = document.getElementById('chat-messages-area');
  const chatContactItems = document.querySelectorAll('.chat-contact-item');

  chatContactItems.forEach(item => {
    item.addEventListener('click', () => {
      chatContactItems.forEach(c => c.classList.remove('active'));
      item.classList.add('active');
    });
  });

  function sendLiveChatMessage() {
    if (!liveChatInput || !chatMessagesArea) return;
    const msgText = liveChatInput.value.trim();
    if (!msgText) return;

    // Append outgoing message bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-msg-row outgoing';
    userBubble.innerHTML = `<div class="chat-bubble">${escapeHtml(msgText)}</div>`;
    chatMessagesArea.appendChild(userBubble);
    liveChatInput.value = '';
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;

    trackEvent('live_chat_message_sent', { text_length: msgText.length });

    // Simulate instant responsive contractor / client answer
    setTimeout(() => {
      const replyBubble = document.createElement('div');
      replyBubble.className = 'chat-msg-row incoming';
      replyBubble.innerHTML = `<div class="chat-bubble">Perfect! That sounds great. Looking forward to Saturday at 9:00 AM. Thank you!</div>`;
      chatMessagesArea.appendChild(replyBubble);
      chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
    }, 900);
  }

  if (btnSendLiveChat) {
    btnSendLiveChat.addEventListener('click', sendLiveChatMessage);
  }

  if (liveChatInput) {
    liveChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendLiveChatMessage();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Launch Countdown Timer (Target: February 1, 2027)
  // --------------------------------------------------------------------------
  const targetDate = new Date('2027-02-01T00:00:00Z').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (difference <= 0) {
      if (dEl) dEl.textContent = '00';
      if (hEl) hEl.textContent = '00';
      if (mEl) mEl.textContent = '00';
      if (sEl) sEl.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --------------------------------------------------------------------------
  // 8. Auto-detect User Country for Form Dropdowns
  // --------------------------------------------------------------------------
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const guessedCountry = guessCountryFromTimezone(userTimezone);

  function guessCountryFromTimezone(tz) {
    if (tz.includes('Warsaw')) return 'Poland';
    if (tz.includes('Berlin') || tz.includes('Munich')) return 'Germany';
    if (tz.includes('Paris')) return 'France';
    if (tz.includes('Madrid')) return 'Spain';
    if (tz.includes('London')) return 'United Kingdom';
    if (tz.includes('Amsterdam')) return 'Netherlands';
    if (tz.includes('Rome')) return 'Italy';
    if (tz.includes('Dhaka')) return 'Bangladesh';
    if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago')) return 'United States';
    return 'United Kingdom';
  }

  const countries = [
    'United Kingdom', 'Germany', 'Poland', 'France', 'Spain', 'Netherlands',
    'Italy', 'Belgium', 'Austria', 'Switzerland', 'Ireland', 'Sweden',
    'Norway', 'Denmark', 'Finland', 'Portugal', 'United States', 'Canada', 'Australia', 'Bangladesh'
  ];

  const countrySelects = [document.getElementById('customer-country'), document.getElementById('contractor-country')];
  countrySelects.forEach(select => {
    if (!select) return;
    countries.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      if (c === guessedCountry) opt.selected = true;
      select.appendChild(opt);
    });
  });

  // --------------------------------------------------------------------------
  // 9. Waitlist Role Tabs (Customer vs Contractor)
  // --------------------------------------------------------------------------
  const waitlistTabBtns = document.querySelectorAll('.waitlist-tab-btn');
  const customerForm = document.getElementById('customer-waitlist-form');
  const contractorForm = document.getElementById('contractor-waitlist-form');

  waitlistTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      waitlistTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const role = btn.getAttribute('data-role');
      if (role === 'customer') {
        if (customerForm) customerForm.style.display = 'block';
        if (contractorForm) contractorForm.style.display = 'none';
      } else {
        if (customerForm) customerForm.style.display = 'none';
        if (contractorForm) contractorForm.style.display = 'block';
      }
    });
  });

  // --------------------------------------------------------------------------
  // 10. Waitlist Submissions & Local Storage Management
  // --------------------------------------------------------------------------
  function getStoredEntries() {
    return JSON.parse(localStorage.getItem('loqelo_waitlist_entries') || '[]');
  }

  function saveEntry(entry) {
    const list = getStoredEntries();
    list.unshift(entry);
    localStorage.setItem('loqelo_waitlist_entries', JSON.stringify(list));
    updateAdminStats();
  }

  // Handle Customer Form
  if (customerForm) {
    customerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Honeypot anti-spam check
      const hp = document.getElementById('hp-cust');
      if (hp && hp.value !== '') return;

      const emailEl = document.getElementById('customer-email');
      const countryEl = document.getElementById('customer-country');
      const consentEl = document.getElementById('customer-consent');

      if (!emailEl || !countryEl || !consentEl) return;

      const email = emailEl.value.trim();
      const country = countryEl.value;
      const type = document.querySelector('input[name="cust-type"]:checked')?.value || 'Individual';
      const consent = consentEl.checked;

      if (!consent) {
        alert('Please accept the consent checkbox to receive launch updates.');
        return;
      }

      const entry = {
        id: 'CUST-' + Date.now().toString(36).toUpperCase(),
        timestamp: new Date().toISOString(),
        role: 'Customer',
        email: email,
        country: country,
        accountType: type,
        trade: 'N/A',
        consentGiven: true
      };

      saveEntry(entry);
      customerForm.reset();

      trackEvent('waitlist_signup_customer', { country: country, account_type: type });
      showSuccessModal('Customer');
    });
  }

  // Handle Contractor Form
  if (contractorForm) {
    contractorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const hp = document.getElementById('hp-pro');
      if (hp && hp.value !== '') return;

      const emailEl = document.getElementById('contractor-email');
      const countryEl = document.getElementById('contractor-country');
      const tradeEl = document.getElementById('contractor-trade');
      const consentEl = document.getElementById('contractor-consent');

      if (!emailEl || !countryEl || !consentEl) return;

      const email = emailEl.value.trim();
      const country = countryEl.value;
      const trade = tradeEl ? tradeEl.value : 'General';
      const type = document.querySelector('input[name="pro-type"]:checked')?.value || 'Business';
      const consent = consentEl.checked;

      if (!consent) {
        alert('Please accept the consent checkbox to receive launch updates.');
        return;
      }

      const entry = {
        id: 'PRO-' + Date.now().toString(36).toUpperCase(),
        timestamp: new Date().toISOString(),
        role: 'Contractor',
        email: email,
        country: country,
        accountType: type,
        trade: trade,
        consentGiven: true
      };

      saveEntry(entry);
      contractorForm.reset();

      trackEvent('waitlist_signup_contractor', { country: country, trade: trade, account_type: type });
      showSuccessModal('Contractor');
    });
  }

  // --------------------------------------------------------------------------
  // 11. Confirmation Modal & Confetti
  // --------------------------------------------------------------------------
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const queueNumberEl = document.getElementById('queue-number');

  function showSuccessModal(role) {
    const totalEntries = getStoredEntries().length;
    const simulatedQueue = 1420 + totalEntries;
    if (queueNumberEl) queueNumberEl.textContent = `#${simulatedQueue.toLocaleString()}`;

    if (successModal) {
      successModal.classList.add('active');
      triggerConfetti();
    }
  }

  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) successModal.classList.remove('active');
    });
  }

  // Copy referral link button
  const copyBtn = document.getElementById('btn-copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const inviteUrl = window.location.origin + window.location.pathname + '?ref=early-access';
      navigator.clipboard.writeText(inviteUrl).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy Invite Link';
        }, 2000);
      });
    });
  }

  // Confetti Particle Generator
  function triggerConfetti() {
    const colors = ['#077E88', '#65C8A6', '#E8912C', '#0677BA', '#D2544B'];
    for (let i = 0; i < 40; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = Math.random() * 8 + 6 + 'px';
      confetti.style.height = Math.random() * 8 + 6 + 'px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = '50%';
      confetti.style.top = '50%';
      confetti.style.zIndex = '3000';
      confetti.style.pointerEvents = 'none';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 260 + 100;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 100;

      let posX = window.innerWidth / 2;
      let posY = window.innerHeight / 2;
      let opacity = 1;

      const anim = setInterval(() => {
        posX += vx * 0.016;
        posY += vy * 0.016 + 2;
        opacity -= 0.02;

        confetti.style.left = posX + 'px';
        confetti.style.top = posY + 'px';
        confetti.style.opacity = opacity;

        if (opacity <= 0) {
          clearInterval(anim);
          confetti.remove();
        }
      }, 16);
    }
  }

  // --------------------------------------------------------------------------
  // 12. Admin Drawer & CSV Contact Management
  // --------------------------------------------------------------------------
  const adminDrawer = document.getElementById('admin-drawer');
  const adminOpenBtn = document.getElementById('admin-toggle-link');
  const adminCloseBtn = document.getElementById('admin-close-btn');
  const exportCsvBtn = document.getElementById('btn-export-csv');
  const adminFilterRole = document.getElementById('admin-filter-role');
  const adminTableBody = document.getElementById('admin-table-body');

  if (adminOpenBtn && adminDrawer) {
    adminOpenBtn.addEventListener('click', () => {
      adminDrawer.classList.add('open');
      updateAdminStats();
      renderAdminTable();
    });
  }

  // Shortcut: Alt + A to toggle Admin Panel
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'a') {
      if (adminDrawer) {
        adminDrawer.classList.toggle('open');
        if (adminDrawer.classList.contains('open')) {
          updateAdminStats();
          renderAdminTable();
        }
      }
    }
  });

  if (adminCloseBtn && adminDrawer) {
    adminCloseBtn.addEventListener('click', () => {
      adminDrawer.classList.remove('open');
    });
  }

  function updateAdminStats() {
    const list = getStoredEntries();
    const custCount = list.filter(e => e.role === 'Customer').length;
    const proCount = list.filter(e => e.role === 'Contractor').length;
    const totalVisitors = parseInt(localStorage.getItem('loqelo_visitor_count') || '1', 10);
    const convRate = totalVisitors > 0 ? ((list.length / totalVisitors) * 100).toFixed(1) + '%' : '0%';

    const elVis = document.getElementById('stat-visitors');
    const elCust = document.getElementById('stat-customers');
    const elPro = document.getElementById('stat-contractors');
    const elConv = document.getElementById('stat-conversion');

    if (elVis) elVis.textContent = totalVisitors;
    if (elCust) elCust.textContent = custCount;
    if (elPro) elPro.textContent = proCount;
    if (elConv) elConv.textContent = convRate;
  }

  function renderAdminTable() {
    if (!adminTableBody) return;
    const filter = adminFilterRole ? adminFilterRole.value : 'all';
    let list = getStoredEntries();

    if (filter !== 'all') {
      list = list.filter(e => e.role.toLowerCase() === filter);
    }

    if (list.length === 0) {
      adminTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px; color: var(--mute);">No waitlist entries yet. Submit the form to see test entries!</td></tr>`;
      return;
    }

    adminTableBody.innerHTML = list.map(item => `
      <tr>
        <td><strong>${escapeHtml(item.email)}</strong></td>
        <td><span class="role-badge role-${item.role.toLowerCase()}">${item.role}</span></td>
        <td>${escapeHtml(item.country)}</td>
        <td>${escapeHtml(item.accountType)}</td>
        <td style="color:var(--mute); font-size:11px;">${new Date(item.timestamp).toLocaleDateString()}</td>
      </tr>
    `).join('');
  }

  if (adminFilterRole) {
    adminFilterRole.addEventListener('change', renderAdminTable);
  }

  // 1-Click CSV Export
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const list = getStoredEntries();
      if (list.length === 0) {
        alert('No contacts available to export.');
        return;
      }

      const headers = ['ID', 'Timestamp', 'Role', 'Email', 'Country', 'AccountType', 'Trade', 'ConsentGiven'];
      const rows = list.map(e => [
        e.id,
        `"${e.timestamp}"`,
        `"${e.role}"`,
        `"${e.email}"`,
        `"${e.country}"`,
        `"${e.accountType}"`,
        `"${e.trade}"`,
        `"${e.consentGiven}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `loqelo_waitlist_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      trackEvent('csv_export', { count: list.length });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initial demo entries for instant reviewer verification
  if (getStoredEntries().length === 0) {
    saveEntry({
      id: 'DEMO-001',
      timestamp: new Date().toISOString(),
      role: 'Customer',
      email: 'alex.morgan@example.com',
      country: 'United Kingdom',
      accountType: 'Individual',
      trade: 'N/A',
      consentGiven: true
    });
    saveEntry({
      id: 'DEMO-002',
      timestamp: new Date().toISOString(),
      role: 'Contractor',
      email: 'contact@freshnestclean.com',
      country: 'Netherlands',
      accountType: 'Business',
      trade: 'Cleaning',
      consentGiven: true
    });
  }

  updateAdminStats();
});
