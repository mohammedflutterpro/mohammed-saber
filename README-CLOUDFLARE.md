# Mohammed Saber Portfolio - Cloudflare setup

This package contains the bilingual portfolio, admin dashboard, and D1-backed content storage.

Cloudflare build settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Production branch: `main`

Required setup:

1. Create a D1 database named `mohammed-saber-portfolio-db`.
2. Replace `00000000-0000-4000-8000-000000000000` in `wrangler.jsonc` with its database ID.
3. Run the SQL in `drizzle/0000_gifted_triton.sql` in the D1 console.
4. Add encrypted secrets `ADMIN_PASSWORD` and `SESSION_SECRET` in Worker settings.

Never commit either secret to GitHub.
