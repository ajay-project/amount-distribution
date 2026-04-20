# Requirements — Amount Distribution Simulator

## Milestone 1: Persistence & Enhancement

**Goal:** Add session persistence, distribution history, and UX polish to the existing fully-functional v3 simulator.

---

## Must-Have (P0)

### Feature: Batch Persistence
- Batches saved to localStorage automatically on every change
- Batches restored on page load
- "Clear saved data" option in reset flow

### Feature: Box Range Input
- InputSection accepts range syntax: `1-10, 20, 30-35`
- Parser expands ranges to individual box numbers
- Validates against 1–100 boundary

---

## Should-Have (P1)

### Feature: Amount Constraints
- Per-batch: optional min and max amount per box
- Distribution algorithm respects constraints when generating folders
- Validation shows if constraints make distribution impossible

### Feature: Dark Mode
- Toggle in Header (sun/moon icon)
- `data-theme="dark"` already on root — wire up CSS variables
- Preference persisted to localStorage

---

## Nice-to-Have (P2)

### Feature: Distribution History
- Store last N generated distributions (configurable, default 5)
- History panel: name/timestamp per run, load/compare/delete
- Export selected historical run as TXT or PDF

---

## Non-Goals (Out of Scope)

- Backend / server / database — client-side only
- Multi-user / authentication
- Currency other than INR (₹)
- Real-time collaboration

---

## Acceptance Criteria

### Batch Persistence
- [ ] Refreshing the page restores all batches exactly as left
- [ ] Clearing works cleanly (no stale data on next session)

### Box Range Input
- [ ] `1-10` expands to [1,2,3,4,5,6,7,8,9,10]
- [ ] Mixed input like `5, 10-15, 20` works
- [ ] Out-of-range numbers (0, 101+) still show validation error

### Dark Mode
- [ ] Toggle switches theme visually across all components
- [ ] Preference survives page refresh

---
*Last updated: 2026-04-17 — Milestone 1 requirements*
