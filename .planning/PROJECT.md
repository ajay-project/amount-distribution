# Amount Distribution Simulator

## What This Is

A React SPA (Single Page Application) for simulating the distribution of monetary amounts (₹ INR) across 100 numbered boxes. Users assign amounts to batches of boxes, then generate N randomized "folders" where each folder distributes the total assigned amount across a random selection of boxes. Results export as TXT or PDF reports.

**Primary users:** Deepak Distribution Systems team — internal tool for planning and simulating cash/resource distribution strategies.

## Core Value

Generate randomized, mathematically exact distribution scenarios across numbered slots — each folder total is guaranteed to match the assigned batch total exactly.

## Context

- **Version:** 3.0 (Premium Edition)
- **Status:** Fully shipped, brownfield — in active use
- **Stack:** React 19 + Vite 8, Vanilla CSS, jsPDF
- **Currency:** Indian Rupee (₹ INR)
- **Box system:** 100 boxes (1–100), visualized as a 10×10 grid
- **Distribution constraint:** Each folder must sum to exactly `amountPerFolder` (total of all selected batch amounts)

## Requirements

### Validated

- ✓ **Batch assignment** — Assign ₹ amounts to specific box numbers (1–100) as named batches
- ✓ **Duplicate detection** — If a box already belongs to another batch, prompt user to remove or proceed
- ✓ **Batch management** — Edit and delete batches inline (blocked while distributions exist)
- ✓ **10×10 Box Grid** — Visual modal showing all 100 boxes; assigned boxes highlighted with their amount
- ✓ **Distribution generation** — Generate N folders, each distributing `amountPerFolder` across randomized box sets
- ✓ **Min 5 boxes per folder** — Algorithm always distributes across at least 5 boxes even if fewer assigned
- ✓ **Exact folder totals** — Last-box remainder guarantee ensures every folder sums exactly
- ✓ **Multi-batch selector** — When >1 batch exists, user selects which batches to include in generation
- ✓ **Real-time stats** — Live count of assigned boxes, batch count, total amount
- ✓ **Loading animation** — 5-step processing overlay (always 5s, UX-only)
- ✓ **TXT export** — Plain-text report with batch summary + all folder allocations
- ✓ **PDF export** — Multi-page jsPDF report with color-coded sections, summary, per-folder tables, grand total
- ✓ **Reset** — Clears all state (batches, distributions, numFolders)
- ✓ **Auto-hide header** — Sticky nav hides on scroll-down past 80px, reappears on scroll-up
- ✓ **How-To modal** — 5-step usage guide in header info button
- ✓ **Responsive design** — Works on desktop, tablet, mobile

### Active

- [ ] **Batch persistence** — Save and reload batches across sessions (localStorage or export/import)
- [ ] **Distribution history** — View and compare previously generated runs
- [ ] **Box range input** — Quick-select contiguous ranges (e.g. "1-10, 20-30")
- [ ] **Amount constraints** — Set min/max per box to guide the random distribution
- [ ] **Dark mode** — Full dark theme toggle (CSS variables already use `data-theme`)

### Out of Scope

- Backend/server — This is a client-side only tool; no API or database
- Multi-user / auth — Single-user internal tool
- Currency conversion — INR only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla CSS (no Tailwind) | Maximum control, no build overhead, component-isolated CSS files | All 10 components have dedicated `.css` files in `src/styles/` |
| jsPDF for PDF export | No server needed, works fully client-side | Implemented in `AmountDistributionSimulator.jsx` `handleDownload` |
| God Component pattern | All state in `AmountDistributionSimulator.jsx` | Simplicity for this scale; child components are purely presentational |
| Min 5 boxes per folder | Distribution across <5 boxes is statistically uninteresting | `effectiveBoxCount = Math.max(totalBoxCount, 5)` |
| 5-second loading animation | UX perception of processing; actual computation is instant | `LoadingPopup.jsx` — timer not tied to computation |
| Fisher-Yates shuffle for box selection | Unbiased uniform random shuffle | `shuffleArray()` in simulator engine |

## Architecture

```
src/main.jsx                          → Entry point, React StrictMode
src/App.jsx                           → Layout shell (Header → Simulator → Footer)
src/components/
  AmountDistributionSimulator.jsx     → God Component: ALL state + engine + export
  InputSection.jsx                    → Batch input form (presentational)
  ResultsPanel.jsx                    → Distribution viewer (presentational)
  GridModal.jsx                       → 10×10 grid modal wrapper
  BoxGrid.jsx                         → Pure 10×10 grid display
  LoadingPopup.jsx                    → 5-step animated overlay
  ErrorNotification.jsx               → Toast notification
  ConfirmDialog.jsx                   → Generic confirm/cancel modal
  Header.jsx                          → Auto-hide nav + How-To modal
  Footer.jsx                          → Static 3-column info footer
src/styles/
  [Component].css                     → One CSS file per component
```

## Data Models

```
Batch:              { id: Timestamp, amount: Number, boxNumbers: Number[] }
DistributionFolder: { [boxNumber: string]: amount: Number }  // sums to amountPerFolder
```

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-17 after GSD brownfield initialization*
