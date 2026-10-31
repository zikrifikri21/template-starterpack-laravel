<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(fn () => $this->seed());

$as = fn (string $username) => User::where('username', $username)->firstOrFail();

it('logs in with username and password and lands on the dashboard', function () {
    $this->post('/login', ['username' => 'user', 'password' => 'password'])->assertRedirect('/dashboard');
    $this->assertAuthenticated();
});

it('rejects a wrong password', function () {
    $this->post('/login', ['username' => 'user', 'password' => 'wrongpass1'])->assertSessionHasErrors('username');
    $this->assertGuest();
});

it('renders every menu page for the roles that own it', function () use ($as) {
    $pages = [
        'superadmin' => ['/dashboard', '/user-manage', '/user-role-manage', '/menu-manage', '/access-rights-of-each-user', '/profile-user'],
        'user' => ['/dashboard', '/profile-user'],
    ];

    foreach ($pages as $user => $urls) {
        foreach ($urls as $url) {
            // Page props must not shadow shared ones (a page prop named "menu" would replace the sidebar).
            $this->actingAs($as($user))->get($url)->assertOk()->assertInertia(fn (Assert $p) => $p->has('menu.0.title'));
        }
    }
});

it('builds the sidebar from the access table and keeps menu urls as route names', function () use ($as) {
    $this->actingAs($as('user'))->get('/dashboard')->assertInertia(fn (Assert $p) => $p
        ->component('dashboard')
        ->where('menu.0.href', '/dashboard')
        ->count('menu', 1));
});

it('blocks roles outside a route group', function () use ($as) {
    $this->actingAs($as('user'))->get('/user-manage')->assertRedirect('/dashboard');
});

it('updates only the signed-in profile', function () use ($as) {
    $other = $as('superadmin');
    $this->actingAs($as('user'))->put("/profile-user/{$other->id}", ['uname' => 'user2', 'email' => 'u2@example.test'])->assertRedirect();

    expect($other->fresh()->username)->toBe('superadmin')
        ->and($as('user2')->email)->toBe('u2@example.test');
});

it('uses non-guessable UUID keys for users', function () use ($as) {
    $u = $as('user');
    expect(Str::isUuid($u->id))->toBeTrue();

    $this->actingAs($as('superadmin'))->put('/user-manage/1', ['username' => 'x'])->assertNotFound();

    $this->actingAs($as('superadmin'))->delete('/user-manage/0', ['ids' => [$u->id]])->assertRedirect();
    expect(User::find($u->id))->toBeNull();
});

it('stores the profile photo on the public disk and replaces the old one', function () use ($as) {
    Storage::fake('public');
    $put = fn () => $this->actingAs($as('user'))->put('/profile-user/0', ['uname' => 'user', 'email' => 'user@example.test', 'imageUser' => UploadedFile::fake()->image('a.jpg')]);

    $put();
    $first = $as('user')->picture_profile;
    Storage::disk('public')->assertExists($first);
    expect($as('user')->avatarUrl())->toContain($first);

    $put();
    Storage::disk('public')->assertMissing($first);
    Storage::disk('public')->assertExists($as('user')->picture_profile);
});
