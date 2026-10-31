<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Users (UUID keys: they appear in URLs), roles, menu-driven sidebar, access and profile info. */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_role', function (Blueprint $t) {
            $t->id();
            $t->string('nama');
            $t->timestamps();
        });

        Schema::create('user', function (Blueprint $t) {
            $t->uuid('id')->primary();
            $t->string('username')->unique();
            $t->string('password');
            $t->string('email')->unique();
            $t->string('token')->nullable(); // password-reset token
            $t->rememberToken();
            $t->boolean('is_verified')->default(false);
            $t->string('picture_profile')->nullable();
            $t->timestamps();
            $t->foreignId('user_role_id')->default(2)->constrained('user_role')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('menu', function (Blueprint $t) {
            $t->id();
            $t->string('title');
            $t->string('url'); // route name
            $t->string('icon');
            $t->string('slug')->nullable();
            $t->unsignedInteger('is_main_menu')->default(0); // parent menu id, 0 = top level
            $t->char('is_aktif', 1)->default('n');
            $t->timestamps();
        });

        Schema::create('access', function (Blueprint $t) {
            $t->id();
            $t->timestamps();
            $t->foreignId('user_role_id')->constrained('user_role')->cascadeOnDelete()->cascadeOnUpdate();
            $t->foreignId('menu_id')->constrained('menu')->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('info_user', function (Blueprint $t) {
            $t->id();
            $t->string('nickname')->nullable();
            $t->enum('gender', ['L', 'P'])->nullable();
            $t->date('bday')->nullable();
            $t->string('phone', 20)->nullable();
            $t->string('job')->nullable();
            $t->string('address')->nullable();
            $t->foreignUuid('user_id')->constrained('user')->cascadeOnDelete();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        foreach (['info_user', 'access', 'menu', 'user', 'user_role'] as $table) {
            Schema::dropIfExists($table);
        }
        Schema::enableForeignKeyConstraints();
    }
};
