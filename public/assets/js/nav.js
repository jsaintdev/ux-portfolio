/**
 * Mobile Navigation Script
 * -----------------------------------------
 * - Loads navigation HTML to display 
 * - Handles opening and closing of the mobile nav panel
 * - Updates ARIA attributes for accessibility
 * - Traps keyboard focus inside the nav while it is open
 * - Closes on Escape key, outside click, or toggle button
 */
(function () {

  // Load the navbar HTML into the page
  document.addEventListener("DOMContentLoaded", async () => {
    const includeTargets = document.querySelectorAll("[data-include]");
    for (const el of includeTargets) {
      const file = el.getAttribute("data-include");
      try {
        const res = await fetch(file);
        if (res.ok) {
          el.innerHTML = await res.text();
        } else {
          console.error("Include failed:", file);
        }
      } catch (err) {
        console.error("Include error:", err);
      }
    }

    // Once nav is injected, initialize the menu logic
    initNav();

    // Copy Email to Clipboard with feedback
    const contactCopy = document.getElementById('contact-copy');
    if (contactCopy) {
      const email = 'justinsaintdev@gmail.com';
      contactCopy.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(email);
          const original = contactCopy.textContent;
          contactCopy.textContent = 'Copied!';
          contactCopy.classList.add('copied');

          setTimeout(() => {
            contactCopy.textContent = original;
            contactCopy.classList.remove('copied');
          }, 1500);
        } catch (err) {
          console.error('Clipboard copy failed:', err);
        }
      });
    }

  });

  // Mobile nav functionality
  function initNav() {
    const body = document.body; // For toggling nav open class
    const button = document.querySelector('.hamburger'); // The nav toggle button
    const nav = document.getElementById('site-nav'); // The nav element
    const mqPortrait = window.matchMedia('(orientation: portrait)'); // Media query for portrait orientation

    // Exit if elements are missing
    if (!button || !nav) return;

    // Sync ARIA attributes based on orientation and state
    function syncAria() {
      if (mqPortrait.matches) {
        // On Portrait, hidden unless expanded
        const expanded = button.getAttribute('aria-expanded') === 'true';
        nav.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      } else {
        // Always visible in Landscape
        nav.setAttribute('aria-hidden', 'false');
      }
    }

    // Event listener for orientation changes
    mqPortrait.addEventListener('change', () => {
      if (!mqPortrait.matches) {
        // Reset when rotating back to landscape
        body.classList.remove('is-nav-open');
        button.setAttribute('aria-expanded', 'false');
      }
      syncAria();
    });

    // Focusable elements selectors (navigation links)
    const focusSelectors = [
      'a[href]',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    let lastFocused = null;

    // Get all the nav links that can be focused
    function getFocusable(container) {
      return Array.from(container.querySelectorAll(focusSelectors.join(',')))
        .filter(el => !el.hasAttribute('inert') && !el.closest('[aria-hidden="true"]'));
    }

    // Open the mobile nav menu
    function openMenu() {
      lastFocused = document.activeElement;
      body.classList.add('is-nav-open');
      button.setAttribute('aria-expanded', 'true');
      nav.setAttribute('aria-hidden', 'false');
      syncAria();

      const focusables = getFocusable(nav);
      if (focusables[0]) focusables[0].focus();

      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('click', onDocClick);
    }

    // Close the mobile nav menu
    function closeMenu() {
      body.classList.remove('is-nav-open');
      button.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
      syncAria();

      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onDocClick);

      if (lastFocused) button.focus();
    }

    // Toggle between open and closed states
    function toggleMenu() {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    }

    // Handle keydown events for Escape and Tab
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key === 'Tab' && body.classList.contains('is-nav-open')) {
        const focusables = getFocusable(nav);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // Close menu if clicking outside of nav when open
    function onDocClick(e) {
      if (!body.classList.contains('is-nav-open')) return;
      const clickedInsideNav = nav.contains(e.target);
      const clickedButton = button.contains(e.target);
      if (!clickedInsideNav && !clickedButton) closeMenu();
    }

    button.addEventListener('click', toggleMenu);
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    // Initialize ARIA attributes
    button.setAttribute('aria-expanded', 'false');
    syncAria();
  }
})();