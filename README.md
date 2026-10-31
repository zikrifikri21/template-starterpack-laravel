# Template Starterpack Laravel

Starter pack untuk project baru: Laravel 13, React starter kit (Inertia v3, React 19, TypeScript), shadcn/ui, ikon Hugeicons stroke-rounded, Pest, Larastan, Pint.

Requires PHP 8.3+, MySQL 8 / MariaDB, Node 20+.

## Isi

- **Auth**: login dengan username, register, lupa password (token via email), ganti password. Semuanya throttled.
- **Role & menu**: `user.user_role_id` dengan role 1 Superadmin dan 2 User. Sidebar dibangun dari tabel `access` → `menu`, dan `menu.url` berisi nama route. Batasi route dengan middleware `Roles:1-2`.
- **Superadmin**: kelola user, role, menu, dan hak akses per role.
- **Profil**: edit profil, foto profil (disk `public`, butuh `php artisan storage:link`), ganti password.
- **UUID**: ID tabel `user` adalah UUID v7 (`HasUuids`) supaya tidak bisa ditebak dari URL. Tabel baru yang ID-nya muncul di URL sebaiknya ikut: `$t->uuid('id')->primary()` + `use HasUuids`, dan FK-nya pakai `foreignUuid`.
- **Komponen**: `page.tsx` (Page, StatCard, Detail), `data-table`, `form-dialog`, `form-page`, `field`, `confirm-delete`, `user-avatar`, plus shadcn di `components/ui`. Toast pakai `$this->toast()` di controller.
- **Ikon**: `resources/js/lib/icons.tsx`. Ikon lain dari Hugeicons: `icon(Hugeicons.XxxIcon)`. Kolom `menu.icon` memakai class Boxicons (`bx bxs-dashboard`) yang dipetakan ke Hugeicons.
- **Gambar**: simpan di `public/img` dalam format `.webp`.

## Mulai project baru

```sh
git clone https://github.com/zikrifikri21/template-starterpack-laravel.git nama-project
cd nama-project && rm -rf .git && git init
composer install && npm install
cp .env.example .env && php artisan key:generate   # atur APP_NAME, DB_*
php artisan storage:link
php artisan migrate --seed
composer run dev
```

User testing (password untuk semuanya: `password`): `superadmin`, `user`. **Hapus sebelum go-live.**
Untuk menambahkannya ke database yang sudah ada: `php artisan db:seed --class=TestUserSeeder`.

Tambah halaman baru: buat route, controller (`Inertia::render('folder/page')`), dan page di `resources/js/pages/folder/page.tsx`.
Setelah itu daftarkan menunya lewat **Manage Menu** (url = nama route) dan centang di **Manage Access**. Untuk data awal, tambahkan juga ke `DatabaseSeeder`.

## Tests

```sh
php artisan test                # tests/Feature/AppTest.php (sqlite in-memory, butuh npm run build)
vendor/bin/phpstan analyse && vendor/bin/pint --test
npm run check && npm run types:check
```

## AI tooling (opsional)

`php artisan boost:install` membuat `CLAUDE.md`, `AGENTS.md`, `.mcp.json` dan skill Laravel Boost. File-file ini di-gitignore.
