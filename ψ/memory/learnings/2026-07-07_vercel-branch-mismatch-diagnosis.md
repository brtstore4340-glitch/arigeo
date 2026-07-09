---
pattern: "When a deployment build fails with a generic framework-detection error, check the branch/commit named in the build log against the deployed repo's actual branches before touching config files — a config fix cannot solve a wrong-ref problem"
date: 2026-07-07
source: "rrr: captain-maid / mission-control"
concepts: ["vercel", "deployment", "debugging", "root-cause-analysis", "i18n", "multi-agent-delegation"]
---

# Diagnose the ref before patching the config

## What happened

Captain Maid's Vercel build repeatedly failed with "No Next.js version detected." Three separate config-only fixes were attempted across the session (removing an invalid `root` property, setting explicit root directory, adding subdirectory `buildCommand`/`installCommand`) — each treating it as a build-configuration problem. The actual root cause, found by a different oracle (Governor) via the incident report, was that Vercel was building `fleet-registry-phase2`, a branch that exists only in the `mission-control` repo, not in the deployed `captain-maid` GitHub repo at all. The fix was an empty commit to `main` to force a rebuild from the correct branch — no config change was needed.

Every build log shown during the failed attempts included the branch name and commit hash being cloned. That information was sufficient to catch the mismatch immediately, but it wasn't cross-referenced against `git log --all --oneline` for that repo until someone else's incident doc pointed it out.

## The generalizable rule

Before editing any deployment config (vercel.json, build commands, root directory settings) in response to a "framework not detected" / "package.json not found" style error:

1. Read the exact branch name + commit hash the build log says it cloned.
2. Check that branch actually exists in the **deployed repo** (not a sibling/parent repo that happens to share a remote name).
3. Only then consider config changes — most of these errors are either (a) wrong ref being built, or (b) genuine root-directory mismatch, and (a) is often the actual cause when the project structure has looked correct in every previous deploy.

## Secondary pattern: check for delegation before planning

In a multi-oracle/multi-agent fleet workspace, a large freshly-pasted spec should not be assumed to be unclaimed work. Before spending exploration effort (parallel Explore agents, deep reads) on a big plan, check for signs the task is already assigned elsewhere — other active oracles, background jobs, or escalation threads referencing the same feature. In this session, a full storefront-rebuild plan was built (two parallel Explore agents, plan file written) only to learn at approval time that the user had already delegated implementation to another agent.
