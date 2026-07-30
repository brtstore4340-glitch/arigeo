---
name: css-cascade-debugging
description: Trace CSS cascades from root container downward when layout breaks globally, not from symptom upward
metadata:
  type: feedback
  pattern: Layout debugging discipline
  source: rrr: mission-control session 2026-06-14
---

# CSS Cascade Debugging Pattern

When a child component or entire section isn't displaying (blank pages, overflow, invisible content), don't start by fixing the child. **Always trace the containment tree from the root element outward.**

## The Pattern

1. **Identify the root container** — Usually the outermost `<div>` wrapping the entire page/section
2. **Check for height constraints** — `height: fixed`, `h-screen`, any `min-height` with `overflow: hidden` in combination
3. **Check flex/grid mode** — If parent uses `flex`, verify `flex-direction`, `flex-wrap`, `align-items`, `justify-content`
4. **Check overflow** — `overflow: hidden` anywhere in the chain prevents scrolling; `overflow: auto` or `overflow-y: auto` enables it
5. **Verify child has room** — Once parent is constraint-free, check if child element has `min-height` or height that forces a scroll container

## Why This Works

CSS cascades top-down. A parent with `overflow: hidden` hides all descendants that exceed its bounds. A parent with fixed `height` prevents its children from growing. A child without `min-height` when parent has `flex` can collapse.

The symptom appears at the child (blank page), but the cause is always at an ancestor.

## Real Example (This Session)

**Symptom**: Views 2+ in the pharmacy portal showed blank after navigation.

**Wrong approach** (what I did initially):
- Fixed the child component (`PharmacyGraphDisplay`)
- Added padding, reduced font sizes
- Kept retrying small CSS tweaks
- *Cost: 2 iterations, context tokens wasted*

**Right approach** (what finally worked):
```
// BEFORE (broken)
<div className="min-h-screen bg-slate-900 text-white overflow-hidden">
  <div className="h-screen flex flex-col">  ← child locked to viewport height
    {/* content here */}
  </div>
</div>

// AFTER (fixed)
<div className="bg-slate-900 text-white">
  <div className="min-h-screen w-full flex flex-col overflow-y-auto">
    {/* content here — can scroll now */}
  </div>
</div>
```

The fix was **at the root**, not the child. Removing `overflow: hidden` and fixed heights from the outer container, and adding `overflow-y-auto` to the inner container, freed all children to display properly.

## Application

Use this pattern on any layout breakage:
- Blank pages / invisible content
- Content gets cut off at viewport edge
- Scrollbars missing when they should appear
- Flex/grid children not respecting size
- Text overflowing container

**Ask first**: "Which ancestor is constraining the layout?" Not: "How do I fix this child component?"

## Related [[css-container-sizing]]

Extends into the broader pattern of understanding Tailwind's `container`, `w-full`, `h-full` vs. `min-h-screen` and when each is appropriate.
