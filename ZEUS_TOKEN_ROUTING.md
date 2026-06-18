# ZEUS_TOKEN_ROUTING

Fast cheat sheet for Zeus token reduction.

## Goal
Use the cheapest lane that still preserves quality:
- HAIKU: simple or routine work
- POOL: reuse known patterns before thinking from scratch
- PAIR: explore wide, then refine
- SONNET: high-stakes or novel deep reasoning

## New wrapper
Path:
- `/mnt/d/01 Main Work/Boots/Agentic AI/mission-control/zeus-oracle/ψ/fleet/zeus_route.py`

Run:
- `cd "/mnt/d/01 Main Work/Boots/Agentic AI/mission-control/zeus-oracle/ψ/fleet"`
- `python3 zeus_route.py "Summarize this log and extract action items" --oracle-role omega --category operations --domain-fit 0.9`
- `python3 zeus_route.py "Design new fleet governance hierarchy for scaling" --oracle-role tham --category governance --domain-fit 0.9`
- `python3 zeus_route.py "Refactor memory architecture for performance and reliability" --oracle-role stratum --category architecture --domain-fit 0.7 --json`

## What it does
1. Classifies task complexity using Zeus thresholds
   - `<= 5.0` => HAIKU
   - `5.0 < x < 7.0` => PAIR
   - `>= 7.0` => SONNET
2. Queries the pool automatically for HAIKU candidates
3. Suggests a pair partner for PAIR candidates
4. Prints execution guidance for the chosen lane

## Existing source modules
- `ψ/fleet/task_classifier.py`
- `ψ/fleet/task_dispatcher.py`
- `ψ/fleet/pool_manager.py`
- `ψ/fleet/pairing_matcher.py`

## Recommended use in Hermes/Codex
- Step 1: reduce noisy output with RTK
- Step 2: run `zeus_route.py` on the task text
- Step 3: if HAIKU, stay in fast mode and keep context short
- Step 4: if pool match exists, reuse that pattern first
- Step 5: if PAIR, do fast exploration first and deep refinement second
- Step 6: if SONNET, allow deeper reasoning only for the narrow task scope

## Claude policy
Important:
- If Claude is used anywhere in this workflow, call it only through OpenCode Go.
- Do not call Claude through the Anthropic Claude path.

## Practical examples
### HAIKU
- summarize logs
- small fixes
- classify issues
- routine ops questions

### POOL
- known accessibility pattern
- recurring governance template
- repeatable operational workaround

### PAIR
- multiple possible approaches
- breadth first, then deep validation
- cases where solo deep reasoning would be wasteful

### SONNET
- new architecture
- governance redesign
- high-risk integration or security review
