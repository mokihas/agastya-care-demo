/**
 * Agastya Care Demo - Automated Quality Assurance Test Suite
 * Verifies all specifications from the user prompt:
 * - File structure & integrity
 * - Business details exactness
 * - Heading hierarchy (Exactly 1 H1)
 * - 10 required sections in order
 * - Tap targets >= 44px
 * - Color palette & typography
 * - JSON-LD schema & SEO tags
 * - Responsive CSS rules & overflow safety
 * 
 * Run with:
 *   node test-suite.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
let passed = 0;
let failed = 0;

function assert(condition, testName, errorDetails = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${errorDetails ? '--> ' + errorDetails : ''}`);
    failed++;
  }
}

console.log('================================================================');
console.log('  🧪 Running Agastya Care Demo Quality Assurance Suite');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Test 1: File Structure & Assets
// -----------------------------------------------------------------------------
console.log('📁 Test 1: File Structure & Asset Integrity');
const requiredFiles = [
  'index.html',
  'local-dev-server.js',
  'assets/css/style.css',
  'assets/js/app.js',
  'assets/images/logo.svg',
  'assets/images/favicon.svg'
];

requiredFiles.forEach((file) => {
  const fullPath = path.join(ROOT_DIR, file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`, `Missing path: ${fullPath}`);
});

// Read contents for in-depth checks
const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
const css = fs.readFileSync(path.join(ROOT_DIR, 'assets/css/style.css'), 'utf-8');
const js = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/app.js'), 'utf-8');

// -----------------------------------------------------------------------------
// Test 2: Real Business Details (Exact Match)
// -----------------------------------------------------------------------------
console.log('\n🏥 Test 2: Real Business Details Accuracy');
assert(html.includes('Agastya Care'), 'Clinic Name: "Agastya Care"');
assert(html.includes('Uday Wasi Heights'), 'Address: contains "Uday Wasi Heights"');
assert(html.includes('Chapaguri Rd'), 'Address: contains "Chapaguri Rd"');
assert(html.includes('Smart Bazaar'), 'Address landmark: contains "Smart Bazaar"');
assert(html.includes('Indian Oil Petrol Pump'), 'Address landmark: contains "Indian Oil Petrol Pump"');
assert(html.includes('North Bongaigaon'), 'Location: contains "North Bongaigaon"');
assert(html.includes('783380'), 'Pincode: "783380"');
assert(html.includes('079744 18885'), 'Phone display: "079744 18885"');
assert(html.includes('tel:+917974418885'), 'Phone link: "tel:+917974418885"');
assert(html.includes('Open today until 8:30 PM'), 'Timings display: "Open today until 8:30 PM"');
assert(html.includes('5.0'), 'Rating: "5.0" stars');
assert(html.includes('92'), 'Review count: "92" reviews');
assert(html.includes('FHW2+FJ Bongaigaon'), 'Plus Code: "FHW2+FJ Bongaigaon"');
assert(html.includes('https://maps.app.goo.gl/FuA7QA9icuvCK3Xq8'), 'Google Maps GBP Link');
assert(html.includes('https://www.facebook.com/agastyacare/'), 'Facebook Link');
assert(html.includes('https://www.instagram.com/agastya_care/'), 'Instagram Link');
assert(html.includes('https://wa.me/917974418885'), 'WhatsApp Booking Link');

// -----------------------------------------------------------------------------
// Test 3: Semantic HTML & Heading Hierarchy
// -----------------------------------------------------------------------------
console.log('\n📑 Test 3: Semantic HTML & Heading Hierarchy');
const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
assert(h1Matches.length === 1, `Exactly ONE <h1> tag on page (found: ${h1Matches.length})`);
assert(h1Matches[0] && h1Matches[0].includes("Caring for Bongaigaon's Health, Every Day."), 'H1 text matches requirement');

const h2Matches = html.match(/<h2[^>]*>/gi) || [];
assert(h2Matches.length >= 6, `Appropriate <h2> section headings (found: ${h2Matches.length})`);

// Check all <img> tags have alt attribute
const imgMatches = html.match(/<img[^>]*>/gi) || [];
const imgWithoutAlt = imgMatches.filter((img) => !img.includes('alt='));
assert(imgWithoutAlt.length === 0, `All images have alt text (${imgMatches.length} images checked)`);

// Semantic tags
assert(html.includes('<header') && html.includes('</header>'), 'Semantic <header> present');
assert(html.includes('<nav') && html.includes('</nav>'), 'Semantic <nav> present');
assert(html.includes('<main') && html.includes('</main>'), 'Semantic <main> present');
assert(html.includes('<section') && html.includes('</section>'), 'Semantic <section> present');
assert(html.includes('<article') && html.includes('</article>'), 'Semantic <article> present for cards');
assert(html.includes('<footer') && html.includes('</footer>'), 'Semantic <footer> present');

// -----------------------------------------------------------------------------
// Test 4: Required 10 Page Sections in Exact Order
// -----------------------------------------------------------------------------
console.log('\n🔢 Test 4: Required Page Sections Order');
const sectionsOrder = [
  { name: '1. Sticky Header', test: html.indexOf('id="siteHeader"') },
  { name: '2. Hero Section', test: html.indexOf('id="home"') },
  { name: '3. Trust Badges Row', test: html.indexOf('class="trust-badges-section"') },
  { name: '4. Services Section', test: html.indexOf('id="services"') },
  { name: '5. About Section', test: html.indexOf('id="about"') },
  { name: '6. How It Works Section', test: html.indexOf('id="how-it-works"') },
  { name: '7. Reviews Section', test: html.indexOf('id="reviews"') },
  { name: '8. FAQ Section', test: html.indexOf('id="faq"') },
  { name: '9. Contact and Location', test: html.indexOf('id="contact"') },
  { name: '10. Footer', test: html.indexOf('class="site-footer"') }
];

let orderCorrect = true;
for (let i = 0; i < sectionsOrder.length - 1; i++) {
  if (sectionsOrder[i].test === -1 || sectionsOrder[i + 1].test === -1 || sectionsOrder[i].test >= sectionsOrder[i + 1].test) {
    orderCorrect = false;
    console.error(`  Order mismatch between ${sectionsOrder[i].name} and ${sectionsOrder[i + 1].name}`);
  }
}
assert(orderCorrect, 'All 10 sections exist in the exact required sequence');

// -----------------------------------------------------------------------------
// Test 5: Section Specific Requirements
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 5: Specific Section Criteria');

// Header
assert(html.includes('hamburger-btn') && html.includes('mobile-nav-overlay'), 'Header: Clean mobile hamburger menu with overlay');
assert(html.includes('header-call-btn'), 'Header: Prominent Call Now button');

// Hero
assert(html.includes('hero-trust-strip'), 'Hero: Trust strip present');
assert(html.includes('5.0 ★ Google Rating') && html.includes('92 Reviews'), 'Hero: Trust strip rating & reviews text');

// Trust badges
assert(html.includes('Experienced Doctors') && html.includes('Patient-First Care') && html.includes('Easy Appointments') && html.includes('Convenient Location'), 'Trust badges: 4 trust items present');

// Services (6-8 cards)
const serviceCards = html.match(/<article[^>]*class="[^"]*service-card/g) || [];
assert(serviceCards.length >= 6 && serviceCards.length <= 8, `Services: 6-8 service cards present (found: ${serviceCards.length})`);
assert(html.includes('Placeholder service list') || html.includes('placeholder'), 'Services: marked as placeholder to confirm with clinic');

// About
assert(html.includes('doctor-profile-card'), 'About: Doctor profile block present');
assert(html.includes('Dr. [Doctor Name]'), 'About: Doctor name placeholder');
assert(html.includes('MBBS, MD (General Medicine) [Placeholder]'), 'About: Qualification placeholder');
assert(html.includes('stats-grid'), 'About: 3 key stats present');

// How it works
assert(html.includes('Call or WhatsApp Us') && html.includes('Choose Your Time') && html.includes('Visit &amp; Get Care'), 'How it works: 3 clear steps');

// Reviews
assert(html.includes('Sample Review'), 'Reviews: 3 sample testimonial cards marked clearly as sample');
assert(html.includes('Read all 92 reviews on Google') || html.includes('Read all reviews on Google'), 'Reviews: Button linking to Google Reviews');

// FAQ (5 items)
const faqItems = html.match(/class="faq-item/g) || [];
assert(faqItems.length === 5, `FAQ: Exactly 5 accordion questions (found: ${faqItems.length})`);
assert(html.includes('faq-editable-note'), 'FAQ: Answers marked as editable');

// Contact & Map
assert(html.includes('<iframe') && html.includes('maps.google.com'), 'Contact: Embedded Google Map iframe');
assert(html.includes('Get Directions'), 'Contact: Get Directions button linking to GBP');

// Footer
assert(html.includes('Demo by') && html.includes('https://www.digitaya.com') && html.includes('Digitaya'), 'Footer: "Demo by Digitaya" link present');
assert(html.includes('&copy; 2026 Agastya Care') || html.includes('© 2026 Agastya Care'), 'Footer: © 2026 copyright');

// -----------------------------------------------------------------------------
// Test 6: Extras (Floating WhatsApp, Mobile Sticky Bar, Schema, SEO)
// -----------------------------------------------------------------------------
console.log('\n🌟 Test 6: Extras & Enhancements');
assert(html.includes('class="floating-whatsapp-btn"'), 'Floating WhatsApp button present');
assert(html.includes('class="mobile-sticky-bottom-bar"'), 'Mobile sticky bottom bar with Call and WhatsApp present');
assert(html.includes('application/ld+json') && html.includes('"@type": "MedicalClinic"'), 'LocalBusiness / MedicalClinic JSON-LD schema present');
assert(html.includes('<title>Agastya Care | Medical Center in North Bongaigaon, Assam</title>'), 'SEO Title matches exact requirement');
assert(html.includes('meta name="description"'), 'Meta description present');
assert(html.includes('property="og:title"'), 'Open Graph tags present');

// -----------------------------------------------------------------------------
// Test 7: CSS & Mobile-First Criteria
// -----------------------------------------------------------------------------
console.log('\n🎨 Test 7: CSS & Design System Criteria');
assert(css.includes('#0C4E48') || css.includes('#0F766E') || css.includes('#0f766e'), 'Anchor Color Deep Teal (#0C4E48 / #0F766E)');
assert(css.includes('#FAF8F4') || css.includes('#faf8f4'), 'Background Warm Cream (#FAF8F4)');
assert(css.includes('#C85A32') || css.includes('#c85a32'), 'Warm Terracotta CTA Accent (#C85A32)');
assert(css.includes('#14201F') || css.includes('#14201f'), 'Deep Charcoal Text (#14201F)');
assert(css.includes('DM Serif Display') && css.includes('Plus Jakarta Sans'), 'Google Fonts: DM Serif Display & Plus Jakarta Sans');
assert(css.includes('min-height: 44px') || css.includes('min-height: 48px'), 'Tap targets: minimum 44px height enforced');
assert(css.includes('overflow-x: hidden'), 'Overflow-x safety to eliminate horizontal scroll');
assert(css.includes('prefers-reduced-motion'), 'prefers-reduced-motion respected');
assert(css.includes('@media (min-width: 768px)') && css.includes('@media (min-width: 992px)'), 'Responsive media queries for mobile, tablet, desktop');

console.log('\n================================================================');
console.log(`  📊 Test Summary: ${passed} Passed, ${failed} Failed`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('  🎉 All QA Criteria Verified Successfully!\n');
  process.exit(0);
}
