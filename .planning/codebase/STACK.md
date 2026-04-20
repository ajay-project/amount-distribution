# Stack — Amount Distribution Simulator

## Runtime

| Layer | Choice | Version | Reason |
|-------|--------|---------|--------|
| UI Framework | React | 19.2.4 | Latest stable; functional components + hooks |
| Build Tool | Vite | 8.0.0 | Fastest dev server + build; plugin-react for JSX |
| Language | JavaScript (JSX) | ES2022+ | No TypeScript — simple scale |
| CSS | Vanilla CSS | — | Custom properties, Grid, Flexbox; no utility framework |
| PDF Export | jsPDF | 4.2.1 | Client-side PDF; no server dependency |
| Linting | ESLint 9 | 9.39.4 | react-hooks + react-refresh plugins |

## No These

| What | Why Not |
|------|---------|
| TypeScript | Overkill for current team/scale |
| Tailwind | Vanilla CSS gives full control; no purge/build complexity |
| Redux / Zustand | God Component pattern sufficient at this scale |
| React Router | Single-page, no routing needed |
| Axios / fetch | No API calls |
| Testing framework | Not yet set up |

## Build Outputs

- `dist/` — Vite production build (static files, deployable anywhere)
- Entry: `index.html` → `src/main.jsx`
- Dev port: 5174 (default Vite)

## Dependencies

```json
{
  "dependencies": {
    "jspdf": "^4.2.1",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```
