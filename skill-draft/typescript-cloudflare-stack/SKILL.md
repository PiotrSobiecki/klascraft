---
name: typescript-cloudflare-stack
description: "Apply Piotr's default architecture when creating web projects or planning their stack: TypeScript, separate user-application frontend and data-service Hono backend, deployment on Cloudflare, D1 first and Neon when needed."
---

# Default web project architecture

Use these user-requested defaults for new web projects unless the user specifies otherwise. In an existing project, preserve its architecture unless restructuring is requested.

- Use TypeScript for frontend and backend code.
- Keep frontend files in `apps/user-application/` and backend files in `apps/data-service/`, organized as package-manager workspaces. The folder names `user-application` and `data-service` are the user's convention.
- Use Hono for the HTTP API in `data-service`.
- Target Cloudflare for deployment, normally Workers and static assets. Use current official Cloudflare and Hono documentation when implementing integrations; do not assume package versions or platform limits.
- Prefer Cloudflare-native storage when sufficient: D1 for relational data, R2 for documents and other files. Add storage only when the task needs it.
- If D1 cannot satisfy concrete requirements (for example PostgreSQL features, extensions, database capacity or workload needs), use Neon PostgreSQL. Explain the specific reason and verify current connection guidance for Workers; choose the appropriate supported driver or Hyperdrive integration for that workload.
- Keep source separation even if a small project deploys frontend assets and the Hono API together as one Worker. Do not add separate deploy units or CORS unless needed.
- Record the chosen structure and commands in the project's `AGENTS.md` and README so subsequent work follows the same convention.

These defaults do not authorize production deployment, paid resource creation or migrations of an existing project beyond the user's task. They do not prescribe a frontend framework or require a database for a static landing page.
