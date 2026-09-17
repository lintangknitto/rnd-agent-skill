# Test Matrix — React Test Lab (app-wide E2E)

**Sumber requirement:** informal — dari `README.md` Feature checklist + Routes (tidak ada PRD/BRD di repo)
**Tester:** belum diisi · **Programmer:** belum diisi
**Dibuat:** 2026-08-28 · **Diupdate:** 2026-08-28
**Scope:** Auth, products list/search/filter/CRUD basics, protected routes, navigation, table extras, settings/async UI, upload
**Out of scope:** Detail form profile, audit keyboard a11y penuh, kedalaman navigasi 404

## Summary

| Total Test Case | Passed | Failed | Re-Test | Skip |
|---|---|---|---|---|
| 27 | 27 | 0 | 0 | 0 |

| Total Penggunaan Automation Test | Test Data | Masuk Test Step | Tanpa Automation | Presentase | Memenuhi Syarat |
|---|---|---|---|---|---|
| 27 | 0 | 27 | 0 | 100% | Ya |

## Parameter Matrix

Tidak ada kombinasi variabel yang cukup kompleks untuk fitur di scope ini
(masing-masing input independen — search, filter status, sort tidak diuji
gabungan). Section ini di-skip per Step 2 SKILL.md.

## Test Cases

Nama kolom tabel test case mengikuti istilah tester manual persis (bahasa
Inggris, urutan sama) — isinya ditulis dalam Bahasa Indonesia. `Status`:
`⚪ Not Run`, `🟡 Progress`, `✅ Passed`, `❌ Failed`, `🔁 Re-Test`, `⏭ Skip`.
`TYPE` `+` = skenario positif/input valid, `-` = skenario negatif/input
invalid. `Automation Tools`: `Masuk Test Step` (otomatis end-to-end via
Playwright), `Test Data` (otomasi cuma buat data), `Tanpa Automation`
(manual, belum diotomasi). `Files`/`Requirement` di kolom akhir tambahan
skill ini, bukan bagian format tester.

### PB-1 — Auth · Link Task PB: — · Link Figma: —

| NO | PROGRAM SPECIFICATIONS | TEST CASE | TEST CASE ID |
|---|---|---|---|
| 1 | Login dengan kredensial valid berhasil masuk | Ya | TC1-1 |
| 2 | Login dengan kredensial salah ditolak | Ya | TC1-2 |
| 3 | Validasi field kosong pada form login | Ya | TC1-3 |
| 4 | Validasi format email pada form login | Ya | TC1-4 |
| 5 | Logout menghapus session dan kembali ke `/login` | Ya | TC2-1 |
| 6 | Akses halaman protected tanpa login redirect ke `/login` | Ya | TC3-1 |

| Group No | Feature | Process No (FC) | TYPE | Test Case ID | Test Variable | Test Case | Pre-Condition | Test Data | Test Steps | Expected Result | Status | Evidence | Remarks | Automation Tools | Date | Files | Requirement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Login | | + | TC1-1 | email + password valid | Login berhasil dengan kredensial demo | Aplikasi berjalan; belum login (`localStorage` key `rtl-auth` sudah dihapus) | `admin@demo.test` / `password123` | 1. Buka `/login`<br>2. Isi `login-email`/`login-password`, klik `login-submit` | 1. `login-page` dan `login-form` tampil<br>2. Navigasi ke `/` (dashboard); `dashboard-page` tampil; toast sukses tampil di `toast-viewport` | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/LoginPage.tsx`, `src/context/AuthContext.tsx` | README Auth — login berhasil |
| 1 | Login | | - | TC1-2 | email + password salah | Login gagal dengan kredensial salah | Belum login | `wrong@demo.test` / `badpassword` | 1. Buka `/login`, submit kredensial salah | 1. Tetap di `/login`; `login-form-error` tampil dengan pesan kredensial salah | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/LoginPage.tsx`, `src/context/AuthContext.tsx` | README Auth — kredensial salah |
| 1 | Login | | - | TC1-3 | field kosong | Validasi login: field email/password kosong menampilkan error | Belum login | Field kosong | 1. Submit form login kosong (tanpa isi `login-email`/`login-password`) | 1. `login-email-error` dan `login-password-error` tampil; tidak ada navigasi | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/LoginPage.tsx` | README Forms — required fields |
| 1 | Login | | - | TC1-4 | email tidak valid | Validasi login: format email tidak valid | Belum login | `not-an-email` / password apa saja | 1. Isi `login-email` dengan `not-an-email`, submit | 1. `login-email-error` tampil dengan pesan format email valid | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/LoginPage.tsx` | README Forms — validation |
| 2 | Logout | | + | TC2-1 | — | Logout kembali ke login dan menghapus session | Sudah login (demo login) | — | 1. Dari halaman protected mana pun, klik `logout-button`<br>2. Buka ulang `/` | 1. Redirect ke `/login`; `login-page` tampil<br>2. Tetap redirect ke `/login` (session sudah hilang) | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/Layout.tsx`, `src/context/AuthContext.tsx` | README Auth — logout |
| 3 | Protected Route | | + | TC3-1 | navigasi langsung ke path protected | Akses tanpa login redirect ke `/login` lalu kembali | Belum login | — | 1. Navigasi langsung ke `/products`<br>2. Login dengan kredensial demo | 1. Redirect ke `/login`<br>2. Diarahkan kembali ke `/products`; `products-page` tampil | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/Layout.tsx`, `src/context/AuthContext.tsx` | README Auth — protected redirect ke `/login` |

### PB-2 — Products · Link Task PB: — · Link Figma: —

| NO | PROGRAM SPECIFICATIONS | TEST CASE | TEST CASE ID |
|---|---|---|---|
| 1 | Daftar produk termuat setelah login | Ya | TC4-1 |
| 2 | Pencarian memfilter produk | Ya | TC5-1 |
| 3 | Pencarian tanpa hasil menampilkan empty state | Ya | TC5-2 |
| 4 | Filter status memfilter produk | Ya | TC6-1 |
| 5 | Membuat produk baru tersimpan dan muncul di daftar | Ya | TC7-1 |
| 6 | Validasi field wajib saat create menampilkan error inline | Ya | TC7-2 |
| 7 | Toast sukses muncul setelah create | Ya | TC7-3 |
| 8 | Menghapus produk lewat modal konfirmasi | Ya | TC8-1 |
| 9 | Membatalkan modal delete tidak menghapus produk | Ya | TC8-2 |
| 10 | Mengedit produk dan perubahan tersimpan | Ya | TC9-1 |
| 11 | Modal delete: Esc / klik backdrop / focus trap | Ya | TC8-3 |

| Group No | Feature | Process No (FC) | TYPE | Test Case ID | Test Variable | Test Case | Pre-Condition | Test Data | Test Steps | Expected Result | Status | Evidence | Remarks | Automation Tools | Date | Files | Requirement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | Products List | | + | TC4-1 | katalog seed | Daftar produk termuat setelah login | Sudah login | Katalog seed (mis. Canvas Tote Bag) | 1. Buka `/products` | 1. Setelah loading, `products-page` tampil; minimal satu baris produk tampil di `data-table`; tidak stuck di `loading-skeleton` | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/ProductsPage.tsx`, `src/components/DataTable.tsx`, `src/mock/products.ts` | README Routes `/products` + Table list |
| 5 | Products Search | | + | TC5-1 | query `Mug` | Pencarian memfilter baris produk | Sudah login; produk termuat | Query pencarian `Mug` | 1. Ketik di `product-search` | 1. Produk yang cocok tampil (mis. Ceramic Mug); produk yang tidak cocok tidak tampil | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/ProductsPage.tsx`, `src/components/DataTable.tsx` | README Table — search |
| 5 | Products Search | | + | TC5-2 | query `zzz-no-match-xyz` | Pencarian tanpa hasil menampilkan empty state | Sudah login | Query `zzz-no-match-xyz` | 1. Ketik `zzz-no-match-xyz` di `product-search` | 1. `empty-state` tampil, tidak ada baris di `data-table` | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/ProductsPage.tsx`, `src/components/States.tsx` | README Async UI — empty state (list filter) |
| 6 | Products Status Filter | | + | TC6-1 | status `draft` | Filter status memfilter baris produk | Sudah login; produk termuat | Status `draft` | 1. Pilih `draft` di `product-status-filter` | 1. Produk draft tampil (mis. Desk Lamp); produk active-only tidak tampil | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/ProductsPage.tsx`, `src/components/DataTable.tsx` | README Table — status filter |
| 7 | Products Create | | + | TC7-1 | form lengkap valid | Buat produk dan muncul di daftar | Sudah login | Nama unik mis. `E2E Widget {timestamp}`, kategori `QA`, harga `9.99`, status `active`, deskripsi `Dibuat oleh E2E` | 1. Klik `add-product`<br>2. Isi field wajib, klik `product-save` | 1. Navigasi ke `/products/new`; `product-form` tampil<br>2. Navigasi kembali ke `/products`; nama produk baru tampil saat dicari | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/ProductFormPage.tsx`, `src/mock/products.ts` | README CRUD — create |
| 7 | Products Create | | - | TC7-2 | form kosong | Buat produk dengan field wajib kosong menampilkan error inline | Sudah login di `/products/new` | Form kosong | 1. Submit `product-form` tanpa isi field wajib | 1. `product-name-error`, `product-category-error`, `product-price-error`, `product-description-error` tampil; tetap di form | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/ProductFormPage.tsx` | README Forms — required fields / inline errors |
| 7 | Products Create | | + | TC7-3 | produk baru valid | Toast sukses muncul setelah create | Sudah login | Produk baru yang valid | 1. Buat produk lewat `product-form` | 1. `toast-viewport` menampilkan toast dengan pesan berhasil dibuat | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/Toast.tsx`, `src/context/ToastContext.tsx` | README Modal & toast — success toasts |
| 8 | Products Delete | | + | TC8-1 | konfirmasi delete | Hapus produk lewat modal konfirmasi | Sudah login; ada produk yang diketahui | ID/nama produk yang diuji | 1. Klik `delete-{id}` pada baris tersebut<br>2. Klik `delete-modal-confirm` | 1. `delete-modal` terbuka; `delete-modal-name` menampilkan nama produk<br>2. Modal tertutup; produk tidak lagi muncul saat dicari | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/ProductsPage.tsx`, `src/components/Modal.tsx`, `src/mock/products.ts` | README CRUD — delete with confirm dialog |
| 8 | Products Delete | | + | TC8-2 | cancel delete | Cancel modal delete membuat produk tetap ada | Sudah login; produk sudah ada | — | 1. Buka modal delete (`delete-{id}`)<br>2. Klik `delete-modal-cancel` | 1. `delete-modal` terbuka<br>2. Modal tertutup; produk masih ada di daftar | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/Modal.tsx`, `src/pages/ProductsPage.tsx` | README Modal — cancel / backdrop flows |
| 8 | Products Delete | | + | TC8-3 | Esc + backdrop + Tab | Modal delete mendukung Esc, klik backdrop, dan focus trap | Sudah login; produk sudah ada | — | 1. Buka modal delete (`delete-{id}`)<br>2. Tekan Tab pada tombol modal<br>3. Tekan Esc<br>4. Buka modal lagi dan klik backdrop | 1. Fokus berpindah di antara tombol modal tanpa keluar dialog<br>2. Modal tertutup dan fokus kembali ke tombol delete<br>3. Modal tertutup saat backdrop diklik | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/Modal.tsx`, `src/pages/ProductsPage.tsx` | README Modal & A11y — Esc / backdrop / focus trap |
| 9 | Products Edit | | + | TC9-1 | nama dengan suffix ` (edited)` | Edit produk dan perubahan tersimpan | Sudah login; produk sudah ada | Nama dengan suffix ` (edited)` | 1. Klik `edit-{id}` pada produk<br>2. Ubah `product-name`, klik `product-save` | 1. `product-form` terisi otomatis (prefilled)<br>2. Kembali ke `/products`; nama terbaru tampil | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/ProductFormPage.tsx`, `src/mock/products.ts` | README CRUD — edit |

### PB-3 — Navigation / Shell · Link Task PB: — · Link Figma: —

| NO | PROGRAM SPECIFICATIONS | TEST CASE | TEST CASE ID |
|---|---|---|---|
| 1 | Sidebar navigasi ke semua section utama | Ya | TC10-1 |
| 2 | Route tidak dikenal menampilkan halaman 404 | Ya | TC11-1 |

| Group No | Feature | Process No (FC) | TYPE | Test Case ID | Test Variable | Test Case | Pre-Condition | Test Data | Test Steps | Expected Result | Status | Evidence | Remarks | Automation Tools | Date | Files | Requirement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 10 | Sidebar Navigation | | + | TC10-1 | semua nav link | Sidebar navigasi antar bagian utama | Sudah login | — | 1. Klik `nav-dashboard`, `nav-products`, `nav-profile`, `nav-settings` satu per satu | 1. `dashboard-page`, `products-page`, `profile-page`, `settings-page` tampil sesuai link yang diklik | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/Layout.tsx`, `src/App.tsx` | README Navigation — sidebar links |
| 11 | 404 Route | | - | TC11-1 | path tidak valid | Route tidak dikenal menampilkan halaman 404 | Kondisi apapun (404 di luar protected layout) | `/no-such-route` | 1. Navigasi ke `/no-such-route` | 1. `not-found-page` tampil | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/NotFoundPage.tsx`, `src/App.tsx` | README Routes `*` — 404 |

### PB-4 — Table Extras · Link Task PB: — · Link Figma: —

| NO | PROGRAM SPECIFICATIONS | TEST CASE | TEST CASE ID |
|---|---|---|---|
| 1 | Sort kolom Name mengubah urutan asc/desc | Ya | TC12-1 |
| 2 | Pagination menampilkan 5 item per halaman dan next page berfungsi | Ya | TC13-1 |

| Group No | Feature | Process No (FC) | TYPE | Test Case ID | Test Variable | Test Case | Pre-Condition | Test Data | Test Steps | Expected Result | Status | Evidence | Remarks | Automation Tools | Date | Files | Requirement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 12 | Table Sort | | + | TC12-1 | klik `sort-name` 2x | Sort kolom Name mengubah urutan | Sudah login; daftar produk tampil | — | 1. Klik `sort-name` (urutan asc)<br>2. Klik `sort-name` lagi (urutan desc) | 1. `aria-sort="ascending"`; urutan baris naik (A→Z)<br>2. `aria-sort="descending"`; urutan baris turun (Z→A) | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/DataTable.tsx`, `src/pages/ProductsPage.tsx` | README Table — column sort |
| 13 | Table Pagination | | + | TC13-1 | >5 produk seed | Pagination menampilkan 5 per halaman dan next page berfungsi | Sudah login; >5 produk (`PAGE_SIZE = 5`) | — | 1. Perhatikan `pagination-summary` di halaman pertama<br>2. Klik `pagination-next` | 1. Maksimal 5 baris tampil<br>2. Baris halaman 2 tampil, `pagination-summary` update | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/DataTable.tsx`, `src/components/Pagination.tsx`, `src/pages/ProductsPage.tsx` | README Table — pagination (5 per page) |

### PB-5 — Settings / Async UI / Theme · Link Task PB: — · Link Figma: —

| NO | PROGRAM SPECIFICATIONS | TEST CASE | TEST CASE ID |
|---|---|---|---|
| 1 | Toggle tema tersimpan setelah reload | Ya | TC14-1 |
| 2 | Simulasi loading menampilkan skeleton | Ya | TC15-1 |
| 3 | Simulasi empty menampilkan empty state | Ya | TC15-2 |
| 4 | Simulasi error menampilkan error state + retry | Ya | TC15-3 |
| 5 | Force API error membuat products gagal load lalu pulih setelah dimatikan | Ya | TC16-1 |

| Group No | Feature | Process No (FC) | TYPE | Test Case ID | Test Variable | Test Case | Pre-Condition | Test Data | Test Steps | Expected Result | Status | Evidence | Remarks | Automation Tools | Date | Files | Requirement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 14 | Theme Toggle | | + | TC14-1 | klik `theme-toggle` + reload | Toggle tema di sidebar beralih light/dark dan tersimpan | Sudah login | — | 1. Klik `theme-toggle` di sidebar<br>2. Reload halaman | 1. Tema berganti (light↔dark)<br>2. Tema tetap sama setelah reload | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/Layout.tsx`, `src/context/ThemeContext.tsx` | README Theme — light/dark persisted |
| 15 | Settings Async States | | + | TC15-1 | klik `simulate-loading` | Simulasi loading di Settings menampilkan skeleton | Di `/settings` | — | 1. Klik `simulate-loading` | 1. `loading-skeleton` tampil sementara, lalu kembali idle dengan toast info | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/SettingsPage.tsx`, `src/components/States.tsx`, `src/mock/delay.ts` | README Async UI — loading skeleton |
| 15 | Settings Async States | | + | TC15-2 | klik `simulate-empty` | Simulasi empty di Settings menampilkan empty state | Di `/settings` | — | 1. Klik `simulate-empty` | 1. `empty-state` tampil | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/SettingsPage.tsx`, `src/components/States.tsx` | README Async UI — empty state |
| 15 | Settings Async States | | - | TC15-3 | klik `simulate-error` | Simulasi error di Settings menampilkan error state + retry | Di `/settings` | — | 1. Klik `simulate-error`<br>2. Klik `error-retry` | 1. `error-state` tampil dengan pesan simulasi<br>2. Kembali idle (`settings-playground-idle` tampil) | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/SettingsPage.tsx`, `src/components/States.tsx` | README Async UI — error + retry |
| 16 | Force API Error | | - | TC16-1 | toggle `force-error-toggle` on/off | Force API error membuat load produk gagal lalu pulih | Sudah login | — | 1. Aktifkan `force-error-toggle`, buka `/products`<br>2. Nonaktifkan `force-error-toggle`, buka ulang `/products` | 1. `error-state` tampil di Products<br>2. Daftar produk termuat normal kembali | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/pages/SettingsPage.tsx`, `src/pages/ProductsPage.tsx`, `src/mock/products.ts` | README Async UI — Force error |

### PB-6 — Upload · Link Task PB: — · Link Figma: —

| NO | PROGRAM SPECIFICATIONS | TEST CASE | TEST CASE ID |
|---|---|---|---|
| 1 | Pilih gambar menampilkan preview, clear menghapusnya | Ya | TC17-1 |

| Group No | Feature | Process No (FC) | TYPE | Test Case ID | Test Variable | Test Case | Pre-Condition | Test Data | Test Steps | Expected Result | Status | Evidence | Remarks | Automation Tools | Date | Files | Requirement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 17 | Image Upload | | + | TC17-1 | pilih + clear | Pilih gambar menampilkan preview; clear menghapusnya | Di form produk (`/products/new`) | File gambar kecil | 1. Pilih file lewat `file-input`<br>2. Klik `file-clear` | 1. `file-preview` tampil<br>2. `file-preview` hilang | ✅ Passed | | | Masuk Test Step | 2026-08-28 | `src/components/FileUpload.tsx`, `src/pages/ProductFormPage.tsx` | README Upload — image pick, preview, clear |
