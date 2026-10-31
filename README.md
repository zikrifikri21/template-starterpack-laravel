# Template Starterpack Laravel

Starter pack untuk project baru atau untuk port (clone) aplikasi Laravel/PHP lama:
Laravel 13, React starter kit (Inertia v3, React 19, TypeScript), shadcn/ui, ikon Hugeicons stroke-rounded, Reverb (realtime), Pest, Larastan, Pint.

Requires PHP 8.3+, MySQL 8 / MariaDB, Node 20+.

## Isi

- **Auth**: login dengan username, register, lupa password (token via email), ganti password. Semuanya throttled.
- **Role & menu**: `user.user_role_id` dengan role 1 Superadmin dan 2 User. Sidebar dibangun dari tabel `access` → `menu`, dan `menu.url` berisi nama route. Batasi route dengan middleware `Roles:1-2`.
- **Superadmin**: kelola user, role, menu, dan hak akses per role.
- **Profil**: edit profil, foto profil, ganti password.
- **Group chat realtime**: private channel `chat` lewat Reverb (`laravel-echo` + `@laravel/echo-react`).
- **Komponen**: `page.tsx` (Page, StatCard, Detail), `data-table`, `form-dialog`, `form-page`, `field`, `confirm-delete`, `user-avatar`, plus shadcn di `components/ui`. Toast pakai `$this->toast()` di controller.
- **Ikon**: `resources/js/lib/icons.tsx`. Ikon lain dari Hugeicons: `icon(Hugeicons.XxxIcon)`. Kolom `menu.icon` memakai class Boxicons (`bx bxs-dashboard`) yang dipetakan ke Hugeicons.
- **Gambar**: simpan di `public/img` dalam format `.webp`.

## Mulai project baru

```sh
git clone https://github.com/zikrifikri21/template-starterpack-laravel.git nama-project
cd nama-project && rm -rf .git && git init
composer install && npm install
cp .env.example .env && php artisan key:generate   # atur APP_NAME, DB_*
php artisan migrate --seed
php artisan reverb:install                          # mengisi REVERB_* di .env
composer run dev
php artisan reverb:start                            # untuk group chat
```

User testing (password untuk semuanya: `password`): `superadmin`, `user`. **Hapus sebelum go-live.**
Untuk menambahkannya ke database yang sudah ada: `php artisan db:seed --class=TestUserSeeder`.

Tambah halaman baru: buat route, controller (`Inertia::render('folder/page')`), dan page di `resources/js/pages/folder/page.tsx`.
Setelah itu daftarkan menunya lewat **Manage Menu** (url = nama route) dan centang di **Manage Access**. Untuk data awal, tambahkan juga ke `DatabaseSeeder`.

## Port aplikasi lama (pakai database lama tanpa migrasi)

1. Import dump lama apa adanya: `mysql -u USER -p nama_db < dump.sql`.
2. Reverse-engineer tabelnya ke `database/migrations/2026_01_01_000000_create_app_tables.php`, dengan nama dan tipe kolom sama persis seperti di dump. Bungkus setiap tabel dengan `if (! Schema::hasTable(...))`, supaya `migrate` aman dijalankan di DB hasil import dan DB lokal bisa dibuat dari migrasi.
3. Model extend `App\Models\LegacyModel` (tanggal diserialisasi `Y-m-d H:i:s`, bukan ISO UTC). Atur `$table` dan `$guarded`.
4. Pertahankan nama route lama kalau tersimpan di DB (`menu.url`). Alur aplikasi jangan diubah, kecuali ada bug.
5. Upload lama tetap di `public/storage/{folder}`. Pakai `storeLegacy()`/`deleteLegacy()` dari `Controller`.
6. Opsi `.env` untuk DB lama:
    - `SESSION_DRIVER=file`, `CACHE_STORE=file`, `QUEUE_CONNECTION=sync`: tidak butuh tabel Laravel.
    - `DB_STRICT=false` kalau server lama berjalan non-strict (zero dates, insert longgar).
    - `DB_LEGACY_LATIN1=true` kalau tabelnya latin1: karakter yang tidak muat (emoji) disimpan sebagai `?`, bukan error.

Tabel `user` dan `messages` memakai UUID v7 (`HasUuids`) supaya ID di URL/JSON tidak bisa ditebak; tabel baru yang ID-nya terekspos sebaiknya ikut (`$t->uuid('id')->primary()` + `use HasUuids`, FK pakai `foreignUuid`).
Kalau dump lama memakai ID integer untuk user, hapus `HasUuids` dari model dan kembalikan kolomnya ke integer agar cocok dengan dump.

Kalau struktur tabel user/role/menu di aplikasi lama berbeda, sesuaikan model `User`, `Userlevel`, `Menu`, `Access` dan `HandleInertiaRequests::menu()`.

## Tests

```sh
php artisan test                # tests/Feature/AppTest.php (sqlite in-memory, butuh npm run build)
vendor/bin/phpstan analyse && vendor/bin/pint --test
npm run check && npm run types:check
```

## AI tooling (opsional)

`php artisan boost:install` membuat `CLAUDE.md`, `AGENTS.md`, `.mcp.json` dan skill Laravel Boost. File-file ini di-gitignore.
