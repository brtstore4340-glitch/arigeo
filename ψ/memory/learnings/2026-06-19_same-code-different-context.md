---
pattern: Same code pattern does not equal same solution when execution context differs
date: 2026-06-19
source: rrr: salary-certificate-request
concepts: [debugging, investigation, execution-context, server-client-paradigms, pattern-reuse]
---

# Same Code Pattern ≠ Same Solution (Execution Context Matters)

## Rule

When copying a working solution from one place to another, verify the **execution context** matches, not just the code pattern. "It works elsewhere" is not sufficient evidence; "it works elsewhere *for the same reason*" is the requirement.

## Context

In this session, the requests page displayed status counts correctly using `rows.filter((r) => r.status === status)` on client-side React data. The dashboard was broken (showing 0 for all statuses). I assumed copying the requests page pattern to the dashboard would fix it. It didn't—four times in a row.

The issue: requests page is **client-side** (React component, fetches data, filters it locally), while dashboard is **server-side** (Next.js page component, renders on server at build time). Same domain logic (filter by status), completely different technical context.

## Execution Contexts to Check

| Aspect | Impact |
|--------|--------|
| **Server vs. Client** | Server code has different data-access patterns; client code requires API calls |
| **Sync vs. Async** | Async operations need `.then()` or `await`; sync doesn't |
| **Data Source** | Client-side: API response. Server-side: direct DB query or repository layer |
| **Build vs. Runtime** | Build-time data (SSG) ≠ Runtime data (SSR); stale data issues differ |
| **Error Handling** | Client errors may fail silently; server errors block builds or requests |

## Example from Session

**Requests Page (Client-side):**
```tsx
const [stats, setStats] = useState(...)
useEffect(() => {
  fetch('/api/salary-certificate/statistics')
    .then(r => r.json())
    .then(data => setStats(data))
})
// Later: stats.submitted (from API)
```

**Dashboard (Server-side):**
```tsx
async function getStatistics() {
  const { countSalaryCertificateRequests } = await import(...)
  const submitted = await countSalaryCertificateRequests('submitted')
  // Direct to repository layer, not via API
}
```

I spent 4 commits trying to make the requests page's *client-side fetch pattern* work in the dashboard's *server-side context*. The solution was to create the API endpoint the dashboard could call, or use the repository layer directly (which was already the right answer).

## How to Apply

**Before copying a pattern:**
1. Identify source and destination execution contexts
2. List the data flow: where does data come from? Where does it go? When?
3. Check if the context is the same. If not, ask: "What changes to make this work in the new context?"

**During debugging rapid-iteration cycles:**
- If you try the same fix 2+ times and it fails, pause and investigate the root cause
- "It works elsewhere" should trigger a question, not a copy-paste
- Slow down to understand before speeding up to fix

## Related

- [[plan-mode-not-optional]]
- [[root-cause-investigation]]
