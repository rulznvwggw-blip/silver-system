/**
 * ☕ RULLZYE STORE CLOUD - COZY CHOCOLATE ULTRA SCRIPT
 * Dynamic UI enhancements, Steam loader, Glowing Icons & Micro-interactions
 */

(function () {
  console.log('%c☕ RullzyeStore Cloud - Cozy Chocolate Theme v2.5 Loaded!', 'background: #2b1b13; color: #d97736; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 6px;');

  // 1. Inject Cozy Steam Loading Screen
  function injectLoader() {
    if (document.getElementById('cozy-loading-screen')) return;

    const loader = document.createElement('div');
    loader.id = 'cozy-loading-screen';
    loader.innerHTML = `
      <div class="cozy-coffee-cup-wrapper">
        <div class="cozy-steam cozy-steam-1"></div>
        <div class="cozy-steam cozy-steam-2"></div>
        <div class="cozy-steam cozy-steam-3"></div>
        <div class="cozy-coffee-icon">☕</div>
      </div>
      <div class="cozy-loading-title">RULLZYESTORE CLOUD</div>
      <div class="cozy-loading-sub">Menyiapkan panel server cozy & terisolasi 24/7...</div>
    `;
    document.body.appendChild(loader);

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('cozy-loaded');
      }, 400);
    });

    // Fallback dismiss after 2s
    setTimeout(() => {
      if (loader && !loader.classList.contains('cozy-loaded')) {
        loader.classList.add('cozy-loaded');
      }
    }, 2000);
  }

  // 2. Enhance Navigation Bar & Branding
  function enhanceNavbar() {
    const navs = document.querySelectorAll('nav, div[class*="NavigationBar"]');
    navs.forEach(nav => {
      if (nav.dataset.cozyEnhanced) return;
      nav.dataset.cozyEnhanced = 'true';

      // Look for brand title / logo
      const brand = nav.querySelector('a[href="/"]') || nav.querySelector('span');
      if (brand && !brand.dataset.brandUpdated) {
        brand.dataset.brandUpdated = 'true';
        brand.style.display = 'inline-flex';
        brand.style.alignItems = 'center';
        brand.style.gap = '8px';
        brand.innerHTML = `
          <span style="background: linear-gradient(135deg, #d97736, #f59e0b); color: #fff; width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; box-shadow: 0 0 10px rgba(217, 119, 54, 0.5);">☕</span>
          <span style="font-weight: 800; letter-spacing: 0.5px; background: linear-gradient(90deg, #fdfbf7, #d97736); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">RULLZYE CLOUD</span>
        `;
      }
    });
  }

  // 3. Enhance Server Cards with Glowing Icons
  function enhanceServerCards() {
    const cards = document.querySelectorAll('div[class*="ServerRow"], div[class*="ServerCard"], div[class*="server-row"]');
    cards.forEach(card => {
      if (card.dataset.cozyEnhanced) return;
      card.dataset.cozyEnhanced = 'true';

      // Add cozy hover glow
      card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  }

  // 4. Initial Run & Mutation Observer for Single Page App transitions
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectLoader();
      enhanceNavbar();
      enhanceServerCards();
    });
  } else {
    injectLoader();
    enhanceNavbar();
    enhanceServerCards();
  }

  const observer = new MutationObserver(() => {
    enhanceNavbar();
    enhanceServerCards();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
