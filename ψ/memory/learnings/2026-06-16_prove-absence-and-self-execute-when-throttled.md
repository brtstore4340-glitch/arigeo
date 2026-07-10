---
pattern: Prove data-absence against raw bytes before asserting it; self-execute deterministic work when delegated oracles are throttled
date: 2026-06-16
source: "rrr: ร้านยาคุณภาพ pharmacy-case orchestration"
concepts: [data-verification, grep, fleet-orchestration, maw, rate-limit, delegation, false-absence]
---

# Prove absence + self-execute when throttled

From orchestrating 4 oracles on the Boots Grand5 pharmacy accreditation cases:

1. **Never assert data is absent until you grep the user's literal example across every file and nested payload.** I twice told the user the POS export "had no member numbers" — once mis-identifying primary_ref, once declaring the field simply didn't exist. Both wrong. The member ID lived inside JSON-in-CSV (`trans_dat_payments.csv`, `tender_code=51`, `extra_payload_json.field_7` = `660XXXXXXXXX`). My "thorough verification" was thorough only within my own assumption about which fields mattered. The data owner usually knows their data is there — when they insist, grep the raw bytes (including escaped JSON), not just the columns you modeled.

2. **When a delegated oracle hits rate-limits/quota, do the deterministic work yourself.** Lens got rate-limited mid-task on the member extraction + HTML database. Both were pure data-joins + template rendering — zero LLM reasoning. I built the HTML DB (17,861 rows, 4 CSV joins, search/sort) in one Python script instead of waiting hours for the throttled oracle. Reserve scarce oracle quota for work that needs judgment (writing, verifying guidelines); run mechanical joins/reports/format-conversions directly.

3. **Drive FleetView/TUI relays one message at a time, verify registration, poll on tail-only.** Queued-message UIs stack inputs silently; completion polls that scan full scrollback fire false positives on stale prompts and persistent banners (e.g. a "75% weekly" notice). Match only the last few lines, and only hard-block strings — not soft warnings.
