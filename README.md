# Agastya Care — Medical Center Website Demo (2026 Studio Edition)

A custom-designed, premium private-clinic demo website built for **Agastya Care (Medical Center)** located on Chapaguri Road, North Bongaigaon, Assam, India.

Redesigned with a calm, confident, and human aesthetic reminiscent of high-end private healthcare practices (Parsley Health, One Medical) fused with a warm, local Bongaigaon feel.

---

## 🌐 Live Website & Links

- **Live Demo on Vercel**: [https://agastya-care-demo.vercel.app](https://agastya-care-demo.vercel.app)
- **GitHub Repository**: [https://github.com/mokihas/agastya-care-demo](https://github.com/mokihas/agastya-care-demo)
- **Direct Vercel Import**: [Deploy on Vercel](https://vercel.com/new/import?s=https://github.com/mokihas/agastya-care-demo)

---

## 🔄 Automatic GitHub & Vercel Sync

Any modification made in this directory automatically syncs to GitHub and deploys on Vercel:

1. **Continuous Auto-Sync (Background)**:
   Run the PowerShell auto-sync watcher:
   ```powershell
   .\auto-sync.ps1
   ```
   *Uses `FileSystemWatcher` with a 3-second debounce. Any file save immediately auto-commits and pushes to `origin main`.*

2. **One-Click Manual Sync**:
   Double-click `sync.bat` to instantly commit and push changes.

---

## 🎨 Design Direction & Studio Improvements

- **Palette**: Warm cream background (`#FAF8F4`), soft sage wash for alternate sections (`#F0F4F1`), deep pine teal anchor (`#0C4E48`), single warm terracotta accent (`#C85A32`) for CTAs only, and deep charcoal text (`#14201F`). Zero harsh white-on-white monotony, zero AI-style glowing blobs or purple/blue gradients.
- **Typography**: Google Fonts pairing — **DM Serif Display** for confident, editorial headlines with tight letter-spacing, and **Plus Jakarta Sans** for relaxed, readable body copy ($16\text{px}+$ touch-friendly text).
- **Asymmetric Hero**: Large fluid headline on the left, tall rounded image frame ($32\text{px}$ radius) on the right with an overlapping floating `5.0 ★ 92 Google Reviews` badge.
- **Editorial Trust Pillars**: Replaced repetitive card circles with a clean horizontal value bar divided by thin $1\text{px}$ borders (`#E5E0D8`).
- **Bento Grid Services**: Replaced uniform walls of cards with an editorial bento layout featuring varied spans, clean tags, and quiet `Book on WhatsApp →` links.
- **Interactive Review Strip**: Replaced the static card grid with an immense `5.0` display number alongside a horizontally scrollable testimonial strip (CSS `scroll-snap`) with arrow navigation.
- **Full-Width Deep Teal Band**: A rich, dark pine teal (`#0C4E48`) section anchoring the address, phone, hours, and interactive embedded Google Map.
- **Minimalist FAQ Accordions**: Clean dividers with interactive plus/minus (`+` / `−`) toggles.
- **Footer Attribution**: Includes the requested `Demo by Digitaya` link pointing to [https://www.digitaya.com](https://www.digitaya.com) with `rel="noopener noreferrer"`.
- **Zero Build Step**: Native HTML5, modern CSS3, and vanilla JS. Works both directly via `file:///` and over any static HTTP server.

---

## 🏥 Business Details (Preserved Exactly)

| Parameter | Clinic Value |
| :--- | :--- |
| **Name** | Agastya Care (Medical Center) |
| **Address** | Ground floor, Uday Wasi Heights, Chapaguri Rd, beside Smart Bazaar, opp. Indian Oil Petrol Pump, North Bongaigaon, Amguri, Bongaigaon, Assam 783380 |
| **Phone** | `079744 18885` (`tel:+917974418885`) |
| **WhatsApp** | `https://wa.me/917974418885` |
| **Hours** | Open today until 8:30 PM |
| **Google Rating** | 5.0 ★ from 92 Google reviews |
| **Plus Code** | `FHW2+FJ Bongaigaon, Assam` |
| **Google Maps Link** | [https://maps.app.goo.gl/FuA7QA9icuvCK3Xq8](https://maps.app.goo.gl/FuA7QA9icuvCK3Xq8) |
| **Facebook** | [https://www.facebook.com/agastyacare/](https://www.facebook.com/agastyacare/) |
| **Instagram** | [https://www.instagram.com/agastya_care/](https://www.instagram.com/agastya_care/) |

---

## 🚀 How to Run & Preview

### Option 1: Zero-Dependency Node.js Server
```bash
cd agastya-care-demo
node server.js
```
Then visit `http://localhost:3000` in your web browser.

### Option 2: Direct File Open
Double-click `index.html` or open `file:///.../agastya-care-demo/index.html` in Chrome, Edge, Safari, or Firefox.

---

## 🧪 Automated Testing & QA

1. **Content & Functional QA Suite** (70 tests):
   ```bash
   node test-suite.js
   ```
2. **Viewport & Responsiveness QA Suite** (Headless Chrome):
   ```bash
   node test-viewports.js
   ```
   *Verifies 360px (mobile), 768px (tablet), and 1280px (desktop), ensuring zero horizontal overflow, single-row unwrapped header, and tap targets $\ge 44\text{px}$.*
