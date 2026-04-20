# Roadmap — Amount Distribution Simulator

## Milestone 1: Persistence & Enhancement
**Theme:** Make the existing v3 tool stickier and more powerful

---

### Phase 1 — Batch Persistence (localStorage)
**Goal:** Batches survive page refresh without any user action

**Plans:**
1. `persistence-service.js` — read/write batches from localStorage with versioned schema
2. Wire persistence into `AmountDistributionSimulator.jsx` — load on mount, save on every batches state change
3. Reset flow — add "Clear saved data" step to existing window.confirm reset

**UAT:**
- Add 3 batches, reload page — all 3 batches present
- Reset All → clears localStorage → next load starts empty

---

### Phase 2 — Box Range Input
**Goal:** User can type `1-10, 20, 30-35` instead of listing every box number

**Plans:**
1. `parseBoxInput(str)` utility — handles comma-separated integers AND `n-m` ranges, validates 1–100
2. Replace InputSection's current parseInt logic with `parseBoxInput`
3. Update placeholder and hint text in InputSection

**UAT:**
- `9, 10, 18-20` → [9, 10, 18, 19, 20]
- `0, 101` → validation error shown
- Existing comma-only input still works

---

### Phase 3 — Dark Mode
**Goal:** Full dark theme wired to existing `data-theme` attribute

**Plans:**
1. Audit CSS variables across all 13 style files — map each to `[data-theme="dark"]` overrides
2. Add dark-mode variable blocks to each component CSS
3. Header toggle button (sun/moon icon) — sets `data-theme` on App root div + persists to localStorage

**UAT:**
- Toggle dark mode → all components switch visually
- Refresh page → dark mode remembered
- No white flash on load (check initial theme set before paint)

---

### Phase 4 — Amount Constraints
**Goal:** Optional min/max per box to guide distribution

**Plans:**
1. Add `minAmount` / `maxAmount` optional fields to Batch data model
2. InputSection — optional collapsible "Constraints" section
3. Distribution algorithm — respect constraints during random generation; fallback/warn if impossible

**UAT:**
- Batch with min=1000 → no box gets less than ₹1000 in any folder
- Constraints that make math impossible → user-friendly error before generation

---

### Phase 5 — Distribution History
**Goal:** Store and revisit last 5 generated distributions

**Plans:**
1. `history-service.js` — save distribution run to localStorage (timestamp + folders array + batch snapshot), cap at 5
2. History panel in UI — collapsible section below ResultsPanel listing past runs
3. Load / delete individual history entries; export historical run as TXT/PDF

**UAT:**
- Generate 3 times → history shows 3 entries newest-first
- Click a history entry → loads it into ResultsPanel
- 6th generation → oldest entry dropped automatically

---

## Backlog (Future Milestones)

- 999.1 — Multi-currency support (USD, EUR alongside INR)
- 999.2 — Share distributions via URL (base64 encoded state)
- 999.3 — Bulk import boxes from CSV

---
*Last updated: 2026-04-17 — initial GSD roadmap from brownfield bootstrap*
