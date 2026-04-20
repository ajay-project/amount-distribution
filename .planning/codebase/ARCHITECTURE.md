# Architecture — Amount Distribution Simulator

## Pattern: Centralized God Component + Pure Presentational Children

All application state lives in `AmountDistributionSimulator.jsx`. Child components are stateless/presentational — they receive data via props and fire callbacks upward. There is no global store, no Context API, no external state manager.

## Component Hierarchy

```
main.jsx (React root)
└── App.jsx (layout shell, data-theme="light")
    ├── Header.jsx (sticky nav, auto-hide, How-To modal)
    ├── main > AmountDistributionSimulator.jsx  ← GOD COMPONENT
    │   ├── InputSection.jsx          (batch input form)
    │   ├── ResultsPanel.jsx          (distribution folder list)
    │   ├── GridModal.jsx             (10×10 grid modal wrapper)
    │   │   └── BoxGrid.jsx           (pure grid display)
    │   ├── LoadingPopup.jsx          (5-step animated overlay)
    │   ├── ErrorNotification.jsx     (toast messages)
    │   └── ConfirmDialog.jsx         (generic modal)
    └── Footer.jsx (static 3-column footer)
```

## Data Flow

```
InputSection ──onAssignAmount()──▶ AmountDistributionSimulator
                                         │
                              validates, checks duplicates
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                         LoadingPopup          DuplicateModal
                         (5s animation)        (conflict UI)
                              │
                         onComplete()
                              │
                    commits Batch to state
                              │
                    ┌─────────┴──────────┐
                    │                    │
              BoxGrid (derived     generateDistributions()
              boxes[] array)            │
                                   distributions[]
                                        │
                                  ResultsPanel
                                  (folder cards)
                                        │
                                  handleDownload()
                                  (TXT blob / jsPDF)
```

## State Inventory (`AmountDistributionSimulator.jsx`)

| State | Type | Purpose |
|-------|------|---------|
| `batches` | `Batch[]` | Source of truth — all user assignments |
| `distributions` | `DistributionFolder[]` | Generated results |
| `numFolders` | `Number` | Target folder count |
| `editingId` | `Number\|null` | Inline edit target |
| `editAmount` / `editBoxes` | draft | Edit form values |
| `downloadFormat` | `'txt'\|'pdf'` | Export format toggle |
| `duplicateModal` | `Object\|null` | Box conflict resolution |
| `selectedBatches` | `Number[]` | Multi-batch generation selector |
| `showBatchSelector` | `Boolean` | Multi-batch modal |
| `showGridModal` | `Boolean` | Grid visualization modal |
| `showLoadingPopup` | `Boolean` | Loading animation |
| `pendingBatchData` | `Object\|null` | Held during animation |
| `notification` | `Object\|null` | Toast message |
| `confirmDialog` | `Object\|null` | Confirm modal config |

## Distribution Algorithm

Located in `generateDistributionsFromBatches(batchIds)`:

1. Compute `amountPerFolder` = Σ(batch.amount × batch.boxNumbers.length)
2. `effectiveBoxCount` = `Math.max(totalBoxCount, 5)` — always spread across ≥5 boxes
3. For each of N folders:
   - Fisher-Yates shuffle on Array(100) → pick first `effectiveBoxCount` boxes
   - Sequential random amounts: each box gets `rand(1, remaining - remainingBoxes + 1)`
   - Last box = exact remainder → **folder total always equals `amountPerFolder`**

## CSS Architecture

- One `.css` file per component in `src/styles/`
- CSS custom properties for colors/spacing in `AmountDistributionSimulator.css`
- `data-theme` attribute on root `div.app-container` — dark mode hook ready
- No Tailwind, no CSS-in-JS, no shared utility classes
