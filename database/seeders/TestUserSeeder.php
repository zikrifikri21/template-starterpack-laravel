<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * One testing account per role, password "password". Idempotent, also on an imported database:
 * php artisan db:seed --class=TestUserSeeder
 */
class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([1 => 'superadmin', 2 => 'user'] as $role => $username) {
            User::updateOrCreate(['username' => $username], [
                'email' => "$username@example.test",
                'password' => Hash::make('password'),
                'user_role_id' => $role,
            ]);
        }
    }
}
