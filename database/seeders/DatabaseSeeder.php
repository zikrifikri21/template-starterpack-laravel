<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /** Roles, menus, access + one testing user per role. Skipped if roles exist (e.g. a dump was imported). */
    public function run(): void
    {
        if (DB::table('user_role')->exists()) {
            return;
        }

        $now = now();

        foreach ([1 => 'Superadmin', 2 => 'User'] as $id => $nama) {
            DB::table('user_role')->insert(['id' => $id, 'nama' => $nama, 'created_at' => $now, 'updated_at' => $now]);
        }

        // [id, title, route name (menu.url), boxicons class (mapped to Hugeicons in resources/js/lib/icons.tsx)]
        $menus = [
            [1, 'dashboard', 'dashboard', 'bx bxs-dashboard'],
            [2, 'manage user', 'user-manage.index', 'bx bxs-user-circle'],
            [3, 'manage role', 'user-role-manage.index', 'bx bxs-user-account'],
            [4, 'manage menu', 'menu-manage.index', 'bx bx-menu'],
            [5, 'manage access', 'access-rights-of-each-user.index', 'bx bx-crown'],
        ];
        foreach ($menus as [$id, $title, $url, $icon]) {
            DB::table('menu')->insert(['id' => $id, 'title' => $title, 'url' => $url, 'icon' => $icon, 'is_main_menu' => 0, 'is_aktif' => 'y', 'created_at' => $now, 'updated_at' => $now]);
        }

        $access = [
            1 => [1, 2, 3, 4, 5],
            2 => [1],
        ];
        foreach ($access as $role => $ids) {
            foreach ($ids as $menu) {
                DB::table('access')->insert(['user_role_id' => $role, 'menu_id' => $menu, 'created_at' => $now, 'updated_at' => $now]);
            }
        }

        $this->call(TestUserSeeder::class);
    }
}
