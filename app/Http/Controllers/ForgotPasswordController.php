<?php

namespace App\Http\Controllers;

use App\Mail\ResetPassword;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ForgotPasswordController extends Controller
{
    public function forgotPassword(): Response
    {
        return Inertia::render('auth/forgot-password');
    }

    public function forgotPasswordValidate(string $token): Response|RedirectResponse
    {
        if (! User::where('token', $token)->exists()) {
            $this->toast('Link reset password sudah kadaluarsa.', 'error');

            return redirect()->route('forgot-password');
        }

        return Inertia::render('auth/change-password', ['token' => $token]);
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            $this->toast('Gagal! Email tidak terdaftar.', 'error');

            return back();
        }

        $user->update(['token' => Str::random(60), 'is_verified' => 0]);

        try {
            Mail::to($user->email)->send(new ResetPassword($user));
        } catch (Throwable $e) {
            report($e);
            $this->toast('Gagal! Terjadi masalah pada penyedia email.', 'error');

            return back();
        }

        $this->toast('Berhasil! Link reset password telah dikirim ke email Anda.');

        return back();
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|min:6',
            'confirm_password' => 'required|same:password',
        ]);

        // The emailed token identifies the user, never a form field.
        $user = User::where('token', $request->token)->first();

        if (! $user) {
            $this->toast('Gagal! Terjadi kesalahan.', 'error');

            return redirect()->route('forgot-password');
        }

        $user->update(['password' => Hash::make($request->password), 'token' => null]);
        $this->toast('Berhasil! Password telah diubah.');

        return redirect()->route('login');
    }
}
