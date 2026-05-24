# Re-Wear Bahrain — Frontend

The React web app for Re-Wear Bahrain, a gamified peer-to-peer circular fashion platform built for Bahrain's communities. Users browse, list, and swap clothes using **Eco-Credits** — no money, no middlemen.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| HTTP | Axios (JWT interceptor) |
| Maps | react-leaflet + Leaflet (OpenStreetMap) |
| Styling | Custom CSS design system (Inter + Playfair Display) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (port 5173)
npm run dev
```

Make sure the [backend server](../Re-Wear-Bahrain_Backend) is running on port 3000 first.

---

## Features

### Browsing & Discovery
- **Browse page** — paginated grid (12 per page) with prev/next and page numbers
- Filter by neighbourhood (40+ areas grouped by governorate) and category
- URL-based filters so links are shareable (`/browse?neighborhood=Juffair`)
- Interactive homepage with scroll animations and neighbourhood cloud

### Listings
- **List an Item** — photo upload via camera, gallery, or file picker
  - Camera: opens a live viewfinder using `getUserMedia` with front/rear flip
  - Gallery/File: native OS picker
  - Preview + change/remove before submitting
- **Edit Listing** — same photo upload, pre-populated fields
- **Item Detail** — Leaflet map showing approximate pickup area, request form with message to owner

### Swap System
- Requester writes a message when claiming an item
- **Owner Dashboard** — sees message, can reply, approve, or decline (with optional reason)
- **Requester Dashboard** — sees owner reply, decline reason, refund notice
- Credits update instantly in the navbar after a swap completes
- Swap history section for completed/cancelled swaps

### Gamification
- Eco-Credit balance in navbar updates in real time
- Badges displayed on profile (Eco Starter → Bahrain Eco Champion)

### UX
- Back buttons on all detail/form pages
- Home, Browse, About links in navbar
- Fully responsive (mobile-first)
- Scroll-reveal animations on homepage and About Us

---

## Pages & Routes

| Route | Page | Auth |
|---|---|---|
| `/` | Homepage | — |
| `/browse` | Browse Items | — |
| `/about` | About Us | — |
| `/items/:id` | Item Detail | — |
| `/items/new` | List an Item | ✓ |
| `/items/:id/edit` | Edit Listing | ✓ |
| `/dashboard` | User Dashboard | ✓ |
| `/sign-up` | Sign Up | — |
| `/sign-in` | Sign In | — |

---

## Key Components

```
src/
  components/
    Navbar.jsx        — responsive nav with eco-credit badge
    Footer.jsx        — site footer with links
    Logo.jsx          — brand logo (SVG leaf icon)
    Map.jsx           — Leaflet map for item pickup area
    BackButton.jsx    — browser-history back with fallback
    PhotoUpload.jsx   — camera + gallery + file upload with preview
  pages/
    Homepage.jsx      — scroll-animated landing page
    Browse.jsx        — paginated item grid with filters
    ItemDetail.jsx    — item page with map and swap request
    Dashboard.jsx     — swaps inbox, outbox, history, listings
    NewItem.jsx       — create listing
    EditItem.jsx      — edit listing
    Signup.jsx        — registration with neighbourhood picker
    SignIn.jsx        — login
    AboutUs.jsx       — brand story and values
  services/
    api.js            — Axios instance with JWT interceptor
  constants/
    neighborhoods.js  — 40+ Bahrain neighbourhoods grouped by governorate
```

---

## Neighbourhood Coverage

All 4 governorates, 40+ areas including:

**Capital** — Manama, Juffair, Adliya, Seef, Zinj, Salmaniya, Hoora and more  
**Muharraq** — Muharraq, Hidd, Amwaj Islands, Busaiteen, Arad and more  
**Northern** — Saar, Budaiya, Janabiyah, Barbar, Diraz, Tubli and more  
**Southern** — Riffa, Isa Town, Hamad Town, A'ali, Sitra, Zallaq and more

---

## Design System

Palette: **Gulf Teal · Forest Green · Warm Sand**

CSS custom properties cover colours, shadows, radii, and typography. All components use utility classes defined in `src/index.css` — no external CSS framework.

---

*Inspired by Omar · Re-Wear Bahrain — keeping clothes in use, one neighbour at a time.*
