# Pacific Hotel website

The hotel's public website: rooms, facilities, location, and live availability from BedSync.
Guests pick dates, see which rooms are free, and send a **booking request**. Requests and
enquiries appear in BedSync under **Requests**, where staff accept them into a room or decline.
Nothing is charged online.

**Stack:** Next.js 15 (static export) · TypeScript · Tailwind CSS 4 · Motion · Cloudflare Workers static assets.

## Change the content
Everything the site says about the hotel is in [`src/site.ts`](src/site.ts):
phone, email, Booking.com and Airbnb links, check-in times, room descriptions and facilities.
Room names must match the names in BedSync exactly.

Photos: put image files in `public/` and replace the "Photo soon" placeholders in `src/components/Site.tsx`.

## Deploy on Cloudflare (once)
Workers & Pages → Create → Import a repository → **BedSync**, then:

| Setting | Value |
|---|---|
| Project name | `pacific-hotel` |
| Root directory | `website` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

Address: `https://pacific-hotel.<your-subdomain>.workers.dev`. Every push to `main` redeploys.

## Develop
```bash
cd website
npm install
npm run dev            # http://localhost:3001 (talks to the live BedSync)
npm run preview:page   # one-file preview with sample availability
```
