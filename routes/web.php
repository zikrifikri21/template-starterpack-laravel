<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\Superadmin;
use Illuminate\Support\Facades\Route;

// menu.url stores route names: renaming a route breaks its sidebar link.
// Roles (user.user_role_id): 1 Superadmin, 2 User. Restrict a group with ->middleware('Roles:1-2').

Route::middleware('guest')->group(function () {
    Route::get('/', [AuthController::class, 'index'])->name('login');
    Route::post('login', [AuthController::class, 'authenticate'])->name('login.authenticate')->middleware('throttle:10,1');

    Route::get('register', [RegisterController::class, 'index'])->name('register');
    Route::post('register/store', [RegisterController::class, 'store'])->name('register.store')->middleware('throttle:6,1');

    Route::get('forgot-password', [ForgotPasswordController::class, 'forgotPassword'])->name('forgot-password');
    Route::post('forgot-password', [ForgotPasswordController::class, 'resetPassword'])->name('forgot-password.send')->middleware('throttle:6,1');
    Route::get('forgot-password/{token}', [ForgotPasswordController::class, 'forgotPasswordValidate']);
    Route::put('reset-password', [ForgotPasswordController::class, 'updatePassword'])->name('reset-password');
});

Route::middleware('auth')->group(function () {
    Route::get('logout', [AuthController::class, 'logout'])->name('logout');

    Route::middleware('Roles:1')->group(function () {
        Route::resource('user-role-manage', Superadmin\UserRoleManageController::class)->only('index', 'store', 'update', 'destroy');
        Route::resource('menu-manage', Superadmin\MenuManageController::class)->only('index', 'store', 'update', 'destroy');
        Route::resource('access-rights-of-each-user', Superadmin\AccessController::class, [
            'names' => ['update' => 'access-rights-of-each-user.insertmenu'],
        ])->only('index', 'update');
        Route::resource('user-manage', Superadmin\UserManageController::class)->parameters(['user-manage' => 'info'])->only('index', 'store', 'update', 'destroy');
    });

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('profile-user', ProfileController::class)->only('index', 'update');
});
