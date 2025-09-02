# Project Walkthrough

Below is a quick walkthrough of what's included, the tech stack, and a few notes about API gaps I encountered.

## Screen record for the app runing local

- \*\*https://drive.google.com/file/d/1J-JyOyEB2cL651Pl-52VnAvIk1EEDSEj/view?usp=sharing

## What's delivered

### Gate Screen — Check-in (`/gate/:gateId`)

- **Visitor & Subscriber tabs** with zone cards showing only **server-authoritative** fields (`occupied`, `free`, `reserved`, `availableForVisitors`, `availableForSubscribers`, `rateNormal`, `rateSpecial`, `open`).
- **Realtime updates** via WebSocket (`zone-update`). Cards update live on check-in/checkout and admin changes.
- **Check-in flow:**
  - **Visitor:** `POST /tickets/checkin`.
  - **Subscriber:** verifies `GET /subscriptions/:id` then `POST /tickets/checkin`.
- **Printable ticket modal** with a **QR code that encodes the ticket id**. I implemented the full QR cycle (see below), not a simulation.

### Checkpoint Screen — Check-out (`/checkpoint`)

- **Employee-only** (protected by `POST /auth/login`).
- Enter or **scan** a ticket id; calls `POST /tickets/checkout` and renders the server-computed `breakdown`, `durationHours`, and `amount`.
- If needed, supports **Convert to Visitor** via `forceConvertToVisitor: true`.
- **True QR code flow:**
  - **On check-in, we generate a scannable QR** (print-friendly, with optional logo overlay).
  - **At checkpoint, camera scanning uses** `react-qr-reader`, with permission handling, rear-camera preference, graceful fallback, and media track cleanup when the dialog closes (no "camera stuck on" state).

### Admin Dashboard (`/admin/*`)

- **Parking State Report** (`GET /admin/reports/parking-state`).
- **Control Panel:**
  - Open/Close zone (`PUT /admin/zones/{id}/open`).
  - Update category rates (`PUT /admin/categories/{id}`).
  - Manage **Rush Hours** (`/admin/rush-hours`) and **Vacations** (`/admin/vacations`) with create/update/delete. UI reflects server fields and pushes live updates.
- **Live Admin Audit Log** (WebSocket `admin-update`)
  - Shows action, target type/id, admin id, and timestamp.
  - Subscribes once and de-duplicates messages; updates stream instantly on:
    - `zone-opened` / `zone-closed`
    - `category-rates-changed`
    - `rush-updated` (add/update/delete)
    - `vacation-added` / `vacation-updated` / `vacation-deleted`

## Realtime & stability

- **Single WebSocket connection** with a small client wrapper (Zustand store):
  - Queues `subscribe`/`unsubscribe` when the socket is **CONNECTING** (fixes the "send while CONNECTING" error).
  - Replays subscriptions on reconnect.
  - Exposes status; the UI shows a spinner while connecting and a badge for connected/disconnected.

## UX & polish

- **Next.js App Router** (TypeScript) + **Zustand** for local/app state + **React Query** for data fetching/caching.
- **shadcn/ui** + Tailwind. Responsive layouts; **burger menu** on mobile; fixed mobile scrolling issues.
- **Global loading spinner** (top-level provider) while queries/mutations are in flight.
- **Error+success toasts** via `sonner` wired to all mutations (admin actions, check-in/out, etc.).
- **SSR** example: gates list server-fetched for the homepage carousel.
- Accessible, keyboard-navigable inputs and buttons.
- **Printable ticket stylesheet.**

## Local Enviroment varibles

- \*\*NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
- \*\*NEXT_PUBLIC_WS_URL=ws://localhost:3000/api/v1/ws
