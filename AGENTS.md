# Project conventions

- Use TypeScript throughout the application.
- Frontend lives in `apps/user-application`; Hono backend lives in `apps/data-service`.
- Target Cloudflare Workers. Use the Cloudflare Vite plugin for local full-stack development and builds.
- Prefer Cloudflare D1 for relational data and R2 for document storage. Consider Neon PostgreSQL when D1 does not meet concrete requirements; verify current integration guidance and limitations.
- Preserve the elegant Minecraft-inspired visual language: warm off-white, forest green, restrained pixel details, original isometric illustration, responsive layout and accessible interactions.
- This is a landing page with a fictional interactive demo. Do not present browser-only state or role switching as production authentication, payment processing, persistent storage or access control.
- Run `npm run build` for TypeScript and production build verification.
