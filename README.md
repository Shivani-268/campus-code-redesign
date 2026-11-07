# CampusCode 2.0

An independent React + TypeScript + Vite application for the CampusCode student community. The reference website was unavailable during implementation; all challenge content here is clearly marked as illustrative development seed data.

## Run locally

```bash
npm install
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

The production build is emitted to `dist/`. Vercel can deploy this repository as a Vite project; `vercel.json` provides the SPA route fallback. Copy `.env.example` to `.env.local` when configuring `VITE_API_BASE_URL` for a future service.

## Routes

Public: `/`, `/about`, `/challenges`, `/challenges/:id`, `/community`, `/guides`, `/contact`, `/terms`, `/privacy`, `/projects`.

Authentication demo: `/login`, `/register`, `/verify`, `/forgot-password`, `/reset-password`.

Dashboard demo: `/dashboard`, `/dashboard/challenges`, `/dashboard/events`, `/dashboard/events/:eventId`, `/dashboard/my-events`, `/dashboard/projects`, `/dashboard/teams`, `/dashboard/profile`, `/dashboard/notifications`, `/dashboard/hackmate`, `/dashboard/help`.

## Demo boundary

Authentication is a local preview adapter in `src/services/auth.ts`; use any valid email and a password of at least 8 characters to enter the dashboard. Registration creates a browser-local preview identity, and the verification screen offers a continue button; it does not send email. No credentials are sent to a server and this is not production authentication. Challenge content is illustrative development seed data. The named dashboard events, aggregate counts, activity, and deadline are a local snapshot transcribed from the supplied dashboard reference; they are not live account data. Profile edits are stored only in the current browser. Event registration, projects, teams, certificates, notifications, and HackMate AI are not connected. Replace the adapter and seed data with backend services before accepting real users, registrations, teams, profile data, or notifications. The Terms and Privacy content is draft launch copy, not legal advice.

## GitHub and deployment

The project has its own fresh Git repository and no remote. To publish after creating the new GitHub repository named `CampusCode-2.0`:

```bash
git remote add origin <new-repository-url>
git add .
git commit -m "Build CampusCode 2.0 application"
git push -u origin main
```

Then import that new repository into Vercel. No repository was created or pushed from this workspace.
