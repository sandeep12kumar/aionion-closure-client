# Aionion Capital – Account Closure (client UI)

React + Vite + Tailwind UI for the online account closure flow (OTP login, client details, documents, Aadhaar eSign).

- `npm ci && npm run dev` - local dev on http://localhost:5173 (proxies `/api` to the API on :5000, see `vite.config.js`)
- `npm run build` - production build in `dist/`

## AWS Amplify

Amplify builds with `amplify.yml`. In **Hosting → Rewrites and redirects** add the rules from `amplify-rewrites.json`
(replace the API Gateway URL): `/api/<*>` is proxied to the closure API (Lambda), so the session cookie stays first-party,
and every other path falls back to `index.html`.
