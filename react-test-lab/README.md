# React Test Lab

Sample React (Vite + TypeScript) app with a full set of UI surfaces for manual QA and E2E practice. No backend — auth and products use `localStorage` with simulated async delay.

## Run

```bash
cd react-test-lab
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Demo credentials

- Email: `admin@demo.test`
- Password: `password123`

## Routes

| Path | Purpose |
|------|---------|
| `/login` | Auth form + validation |
| `/` | Dashboard stats |
| `/products` | Table: search, filter, sort, pagination, delete modal |
| `/products/new` | Create product + image upload |
| `/products/:id/edit` | Edit product |
| `/profile` | Profile form validation |
| `/settings` | Theme, force API error, loading/empty/error demos |
| `*` | 404 |

## Feature checklist for testing

- **Auth** — login/logout, invalid credentials, protected redirect to `/login`
- **Navigation** — sidebar links, nested product routes, 404
- **CRUD** — create / edit / delete with confirm dialog
- **Table** — search, status filter, column sort, pagination (5 per page)
- **Forms** — required fields, inline errors, success toasts
- **Modal & toast** — Esc / backdrop / focus trap; success & error toasts
- **Upload** — image pick, preview, clear
- **Async UI** — loading skeleton, empty state, error + retry (Settings or Force error)
- **A11y** — labels, `role="dialog"`, keyboard on modal
- **Theme** — light/dark (persisted)

## Useful `data-testid`s

`login-form`, `login-submit`, `logout-button`, `product-search`, `product-status-filter`, `add-product`, `delete-modal`, `toast-viewport`, `theme-toggle`, `force-error-toggle`, `loading-skeleton`, `empty-state`, `error-state`

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview build
