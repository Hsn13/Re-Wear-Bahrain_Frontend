# Re-Wear Bahrain — Frontend

A bilingual (English/Arabic) community fashion exchange for Bahrain. People discover and share clothing, coordinate a real handover, and exchange non-cash Eco-Credits after both sides confirm completion.

## Run locally

Use Node.js 20.19+ (or 22.12+) and run:

```bash
npm install
npm run dev
```

Development defaults to `http://localhost:3000`; production defaults to the frontend’s origin for same-origin deployments. Set `VITE_BACKEND_URL` in a local or deployment environment when the API is on another origin, for example:

```env
VITE_BACKEND_URL=http://localhost:3000
```

The API must also allow the frontend origin through its `CLIENT_ORIGINS` setting. Phone verification requires the backend’s Twilio Verify configuration. See the backend README for deployment variables and setup.

## Product flows

- English and Arabic are available from the language switch; the selected language is saved locally and the document direction changes for Arabic.
- Listings require a recent photo of the actual item, an honest condition description, a published category/condition credit band, and an exact Bahrain pickup pin and address.
- Approximate area information is public. Exact pickup details are only returned to the owner and the participants of an approved or disputed swap.
- Requests reserve the requester’s credits. A one-time handover code and confirmation from both people are required before credits transfer to the owner.
- Conversations remain available through active and disputed swaps. Reports pause settlement; mutual reviews are revealed only after both parties submit.
- Seeded records are labeled as samples and cannot be traded.

## Maps and images

Maps use Leaflet with OpenStreetMap tiles and attribution; tile access requires an internet connection. Listing photos are uploaded to the backend and served from its `/uploads` route. The camera option requires browser camera permission and a secure browser context (HTTPS, or localhost).

## Checks

```bash
npm run lint
npm run build
```

The frontend does not hold swap or credit state as the source of truth; those transitions are enforced by the connected backend.
