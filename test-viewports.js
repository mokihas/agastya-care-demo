/**
 * Agastya Care Demo - Automated Viewport & Layout Test
 * Tests mobile (360px), tablet (768px), and desktop (1280px) viewports:
 * - Verifies no horizontal scroll (scrollWidth === clientWidth)
 * - Verifies header is on one line with no awkward wrapping
 * - Verifies tap targets >= 44px
 * - Takes high-res visual verification screenshots
 */

const path = require('path');
const puppeteer = require('../digitaya-agency-master/node_modules/puppeteer');

(async () => {
  console.log('================================================================');
  console.log('  📱 Running Viewport & Layout QA Test (360px, 768px, 1280px)');
  console.log('================================================================\n');

  const filePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'Mobile (360px)', width: 360, height: 780, file: 'mobile-360.png' },
    { name: 'Tablet (768px)', width: 768, height: 1024, file: 'tablet-768.png' },
    { name: 'Desktop (1280px)', width: 1280, height: 900, file: 'desktop-1280.png' }
  ];

  let allPassed = true;

  for (const vp of viewports) {
    console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 10000 });

    // Wait a brief moment for styles/fonts to settle
    await new Promise(r => setTimeout(r, 600));

    // 1. Check for horizontal overflow
    const overflowCheck = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const bodyWidth = document.body.scrollWidth;
      const winWidth = window.innerWidth;
      
      // Find any visible element that overflows (excluding intentional horizontal scroll containers like carousels)
      const elements = Array.from(document.querySelectorAll('*'));
      const overflowingElements = [];

      const inScrollContainer = (element) => {
        let parent = element.parentElement;
        while (parent && parent !== document.body && parent !== document.documentElement) {
          const parentStyle = window.getComputedStyle(parent);
          if (parentStyle.overflowX === 'auto' || parentStyle.overflowX === 'scroll' || parent.classList.contains('reviews-scroll-strip')) {
            return true;
          }
          parent = parent.parentElement;
        }
        return false;
      };

      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;
        if (inScrollContainer(el)) return;

        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.right > winWidth + 1) { // 1px subpixel tolerance
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            right: Math.round(rect.right),
            winWidth
          });
        }
      });

      return {
        hasOverflow: docWidth > winWidth || bodyWidth > winWidth,
        docWidth,
        bodyWidth,
        winWidth,
        overflowCount: overflowingElements.length,
        samples: overflowingElements.slice(0, 3)
      };
    });

    if (overflowCheck.hasOverflow || overflowCheck.overflowCount > 0) {
      console.error(`  ❌ FAIL: Horizontal scroll detected on ${vp.name}! docWidth=${overflowCheck.docWidth}, winWidth=${overflowCheck.winWidth}`);
      console.error('     Offending elements sample:', overflowCheck.samples);
      allPassed = false;
    } else {
      console.log(`  ✅ PASS: No horizontal scroll (docWidth=${overflowCheck.docWidth} <= winWidth=${overflowCheck.winWidth})`);
    }

    // 2. Check Header layout (must be on one line, no wrapping)
    const headerCheck = await page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const headerContainer = document.querySelector('.header-container');
      const logo = document.querySelector('.brand-logo');
      const callBtn = document.querySelector('.header-call-btn');
      
      const headerRect = header.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
      const callBtnRect = callBtn.getBoundingClientRect();

      // Check if logo and call button are roughly vertically aligned (same row)
      const sameRow = Math.abs((logoRect.top + logoRect.height / 2) - (callBtnRect.top + callBtnRect.height / 2)) < 15;

      return {
        headerHeight: headerRect.height,
        sameRow,
        logoY: Math.round(logoRect.top),
        callBtnY: Math.round(callBtnRect.top)
      };
    });

    if (headerCheck.sameRow && headerCheck.headerHeight <= 84) {
      console.log(`  ✅ PASS: Header elements on single row (height=${headerCheck.headerHeight}px)`);
    } else {
      console.error(`  ❌ FAIL: Header layout wrapped or too tall on ${vp.name}! height=${headerCheck.headerHeight}`);
      allPassed = false;
    }

    // 3. Check Tap Targets (>= 44px)
    const tapTargetCheck = await page.evaluate(() => {
      const interactiveSelectors = [
        '.header-call-btn',
        '.hamburger-btn',
        '.hero-cta-group .btn',
        '.mobile-bottom-btn',
        '.faq-question-btn',
        '.floating-whatsapp-btn'
      ];

      const results = [];
      interactiveSelectors.forEach(sel => {
        const els = document.querySelectorAll(sel);
        els.forEach(el => {
          const rect = el.getBoundingClientRect();
          // Check if visible
          if (rect.width > 0 && rect.height > 0) {
            results.push({
              selector: sel,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              passed: rect.height >= 43.5 && rect.width >= 43.5 // half-pixel tolerance
            });
          }
        });
      });

      const failedTargets = results.filter(r => !r.passed);
      return {
        totalChecked: results.length,
        failedCount: failedTargets.length,
        failedTargets
      };
    });

    if (tapTargetCheck.failedCount === 0) {
      console.log(`  ✅ PASS: All ${tapTargetCheck.totalChecked} interactive tap targets >= 44px`);
    } else {
      console.error(`  ❌ FAIL: Tap targets below 44px on ${vp.name}:`, tapTargetCheck.failedTargets);
      allPassed = false;
    }

    // 4. Save Screenshot
    const screenshotPath = path.join(__dirname, 'screenshots', vp.file);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`  📸 Screenshot saved: screenshots/${vp.file}\n`);
  }

  // Also take full-page mobile & desktop screenshot for visual confirmation
  await page.setViewport({ width: 360, height: 780 });
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'mobile-full.png'), fullPage: true });

  await page.setViewport({ width: 1280, height: 900 });
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'desktop-full.png'), fullPage: true });

  await browser.close();

  console.log('================================================================');
  if (allPassed) {
    console.log('  🎉 ALL VIEWPORT & RESPONSIVENESS CHECKS PASSED PERFECTLY!');
  } else {
    console.log('  ⚠️ Some layout checks failed. See details above.');
    process.exit(1);
  }
  console.log('================================================================\n');
})();
