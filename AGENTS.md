# Project conventions

- Use TypeScript throughout the application.
- Frontend lives in `apps/user-application`; Hono backend lives in `apps/data-service`.
- Target Cloudflare Workers. Use the Cloudflare Vite plugin for local full-stack development and builds.
- Prefer Cloudflare D1 for relational data and R2 for document storage. Consider Neon PostgreSQL when D1 does not meet concrete requirements; verify current integration guidance and limitations.
- Current branch `design/pixel-dark` explores a darker Minecraft-inspired visual language: forest surfaces, pixel headings, square raised controls, voxel terrain and an evening isometric school. Keep body text readable, responsive layout and accessible interactions. The original light design is preserved on `main`.
- This is a landing page with a fictional interactive demo. Do not present browser-only state or role switching as production authentication, payment processing, persistent storage or access control.
- Run `npm run build` for TypeScript and production build verification.
