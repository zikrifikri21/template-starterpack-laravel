<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Users, roles, menu-driven sidebar, access, profile info and group chat.
 * Every table is skipped if it already exists, so `migrate` is safe on a database imported from a legacy dump.
 * Porting a legacy app: reverse-engineer its tables here (same names/types as the dump), guarded the same way.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('user_role')) {
            Schema::create('user_role', function (Blueprint $t) {
                $t->id();
                $t->string('nama');
                $t->timestamps();
            });
        }

        if (! Schema::hasTable('user')) {
            Schema::create('user', function (Blueprint $t) {
                $t->id();
                $t->string('username')->unique();
                $t->string('password');
                $t->string('email')->unique();
                $t->string('token')->nullable(); // password-reset token
                $t->tinyInteger('is_verified')->default(0);
                $t->string('picture_profile')->nullable();
                $t->timestamps();
                $t->foreignId('user_role_id')->default(2)->constrained('user_role')->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        if (! Schema::hasTable('menu')) {
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
        }

        if (! Schema::hasTable('access')) {
            Schema::create('access', function (Blueprint $t) {
                $t->id();
                $t->timestamps();
                $t->foreignId('user_role_id')->constrained('user_role')->cascadeOnDelete()->cascadeOnUpdate();
                $t->foreignId('menu_id')->constrained('menu')->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        if (! Schema::hasTable('info_user')) {
            Schema::create('info_user', function (Blueprint $t) {
                $t->id();
                $t->string('nickname')->nullable();
                $t->enum('gender', ['L', 'P', 'Null'])->nullable();
                $t->date('bday')->nullable();
                $t->integer('phone')->nullable();
                $t->string('job')->nullable();
                $t->string('address')->nullable();
                $t->foreignId('user_id')->constrained('user');
                $t->timestamps();
            });
        }

        if (! Schema::hasTable('messages')) {
            Schema::create('messages', function (Blueprint $t) {
                $t->integer('id', true);
                $t->mediumText('messages');
                $t->integer('id_user')->default(0);
                $t->dateTime('created_at');
                $t->dateTime('updated_at');
                $t->string('lampiran', 200)->nullable();
            });
        }

        if (! Schema::hasTable('notif_chat_user')) {
            Schema::create('notif_chat_user', function (Blueprint $t) {
                $t->integer('id', true);
                $t->integer('id_user');
                $t->integer('unread')->default(0);
                $t->dateTime('created_at')->nullable();
                $t->dateTime('update_at')->nullable(); // sic, legacy column name
            });
        }
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        foreach (['notif_chat_user', 'messages', 'info_user', 'access', 'menu', 'user', 'user_role'] as $table) {
            Schema::dropIfExists($table);
        }
        Schema::enableForeignKeyConstraints();
    }
};
