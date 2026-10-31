<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

// ponytail: throttled, no CAPTCHA; add one if bots get through.
class RegisterController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'username' => ['required', 'max:255', 'regex:/^\S*$/u', 'unique:user,username'],
            'email' => 'required|email|unique:user,email',
            'password' => 'required|min:6|confirmed',
        ]);

        // user_role_id falls back to the column default (2, User).
        User::create(['username' => $data['username'], 'email' => $data['email'], 'password' => Hash::make($data['password'])]);
        $this->toast('Registrasi berhasil! Silakan login.');

        return redirect()->route('login');
    }
}
