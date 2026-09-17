# CLAUDE.md

## Project

React Test Lab — sample React (Vite + TypeScript) app with UI surfaces for manual QA and E2E practice. No backend; auth and products use `localStorage` with simulated async delay.

## Conventions

- Package manager: `pnpm` (`pnpm-lock.yaml`); scripts also work via `npm`
- Dev: `pnpm dev` / `npm run dev` (Vite, usually `http://localhost:5173`)
- Build: `pnpm build` / `npm run build` (`tsc -b && vite build`)
- Lint: `pnpm lint` / `npm run lint` (oxlint)
- Source: `src/` (`pages/`, `components/`, `context/`, `mock/`, `styles/`)
- Demo login: `admin@demo.test` / `password123`

## Installed skills

Claude Code path: `.claude/skills/<name>/`  
(Same set also under `.cursor/skills/` and `.agents/skills/` for Cursor / Codex.)

### Alur perencanaan → eksekusi

| Skill | When / why |
|-------|------------|
| `brd-grill` | Ubah Product Backlog mentah jadi BRD (dampak proses/UI/kamus data) lewat tanya-jawab satu-pertanyaan-per-giliran, opsional tabel estimasi effort terkalibrasi, lalu hand-off ke `prd-grill` |
| `prd-grill` | Ubah ide mentah (atau BRD dari `brd-grill`) jadi PRD/rencana lewat tanya-jawab satu-pertanyaan-per-giliran, lalu tulis PRD+ISSUES (atau ikuti konvensi phase-plan repo yang sudah ada) |
| `exec-todo` | Eksekusi checklist dari `prd-grill` sebagai task list ter-tracking, sinkron checkbox file ↔ session, jalankan closing gate (review/verifikasi) repo |
| `incremental-implementation` | Disiplin memecah implementasi jadi langkah kecil yang bisa diverifikasi, bukan satu perubahan besar sekaligus |
| `planning-and-task-breakdown` | Pecah spec/requirement jadi task terurut yang implementable, termasuk estimasi scope & identifikasi kerja paralel |
| `test-driven-development` | Disiplin TDD — tulis test dulu sebelum implementasi/bugfix/perubahan behavior |

### Review & kualitas

| Skill | When / why |
|-------|------------|
| `code-review-and-quality` | Metodologi review lima-axis (correctness, readability, architecture, security, performance) dengan severity label dan quality gate |
| `security-and-hardening` | Prinsip hardening saat menangani input user, auth, penyimpanan data, atau integrasi eksternal |
| `security-review` | Checklist keamanan saat menambah auth, endpoint API, secret, atau fitur pembayaran/sensitif |

### Git & deploy

| Skill | When / why |
|-------|------------|
| `branching` | Kelola branch di model paired-branch (`-main`/`-dev`) + cherry-pick ke `releases/sandbox` staging + promosi ke `releases/main` production — mencegah staging ketinggalan/duplikat fitur |
| `docker-patterns` | Pola Docker/Docker Compose: dev lokal, keamanan container, networking, volume, multi-service |

### Frontend & testing

| Skill | When / why |
|-------|------------|
| `react-patterns` | Pola React 18/19: hooks, server/client boundary, Suspense, form actions, state management, aksesibilitas |
| `react-testing` | Testing komponen React (RTL, Vitest/Jest, MSW, axe) + batas component test vs E2E |
| `e2e-testing` | Pola Playwright E2E: Page Object Model, config, integrasi CI/CD, artifact, strategi flaky test |
| `webapp-testing` | Workflow E2E+TDD siap-eksekusi: script Python (`run_e2e.py`) + config Playwright + CI yaml nyata, bukan cuma pola kode |
| `test-case-matrix` | Tulis matrix test case (functional/edge/error/state) dari PRD/issue jadi markdown checklist per-step + traceability matrix, sebelum test code ditulis |

## Installed agents

| Agent | Path | When / why |
|-------|------|------------|
| `reviewer` | `.claude/agents/reviewer.md` | Reviewer independen, dipanggil proaktif saat sesi/fitur dinyatakan selesai atau saat diminta review diff (delegasi: `code-review-and-quality`) |
| `qa-engineer` | `.claude/agents/qa-engineer.md` | Rencanakan lalu bangun test coverage: selalu mulai dari `test-case-matrix`, baru implementasi via skill testing yang sesuai layer |

Source: [lintangknitto/agent-skills](https://github.com/lintangknitto/agent-skills).
