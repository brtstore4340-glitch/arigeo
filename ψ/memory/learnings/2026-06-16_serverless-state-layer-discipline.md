---
pattern: On serverless, await work that must outlive the response, and fix state bugs at the layer that wrote the state
date: 2026-06-16
source: "rrr: salary-certificate-request"
concepts: [serverless, vercel, nextjs, auth-cookies, fire-and-forget, diagnostics, rsc]
---

# Serverless state-layer discipline

Four reusable rules surfaced building the salary-certificate-request Next.js 16 app:

1. **Fire-and-forget async dies on serverless.** An un-awaited email send returned 201 but never delivered — Vercel freezes the function after the response, killing the pending SMTP. Always `await` (or `after()`/`waitUntil`) anything that must complete post-response. The awaited test endpoint working while the form path failed was the clue that localized it.

2. **Fix state bugs at the layer that wrote the state.** Logout looked broken: client `signOut()` couldn't clear OAuth session cookies set server-side, so the server kept rendering as authenticated. A client-only "fix" shipped first and failed; the real fix was a server route clearing cookies via the same adapter that set them. Trace where state is *written* before deciding where to clear/read it.

3. **Build a diagnostic endpoint instead of guessing at deploy config.** When you can't read the platform env (no `vercel link`), a tiny JSON endpoint (`whoami`, `email-test`) converts invisible state (ADMIN_EMAILS present? Gmail key set? real SMTP error?) into facts in one round-trip.

4. **Event handlers in a React Server Component crash the page.** `onMouseOver`/`onClick` on elements inside an `async` RSC throws "Event handlers cannot be passed to Client Component props" at render. Use CSS `hover:` or mark the file `'use client'`.
