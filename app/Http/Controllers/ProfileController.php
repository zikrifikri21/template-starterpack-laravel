<?php

namespace App\Http\Controllers;

use App\Models\UserInfo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('user_role', 'user_info');

        return Inertia::render('profile', [
            'info' => [
                'username' => $user->username,
                'email' => $user->email,
                'level' => $user->user_role?->nama,
                'avatar' => $user->avatarUrl(),
                ...($user->user_info?->only('nickname', 'gender', 'bday', 'phone', 'job', 'address') ?? []),
            ],
        ]);
    }

    // {profile_user} is ignored: users only ever edit their own account.
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'uname' => ['required', 'regex:/^\S*$/u', Rule::unique('user', 'username')->ignore($user)],
            'email' => ['required', 'email', Rule::unique('user', 'email')->ignore($user)],
            'pwd' => 'nullable|min:8',
            'confirmpwd' => 'same:pwd',
            'imageUser' => 'nullable|image|mimes:jpeg,png,jpg|max:5048',
            'gender' => ['nullable', Rule::in(['L', 'P'])],
            'nickname' => 'nullable|string|max:255',
            'bday' => 'nullable|date',
            'phoneNumber' => 'nullable|string|max:20',
            'job' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $user->username = $data['uname'];
        $user->email = $data['email'];

        if (! empty($data['pwd'])) {
            $user->password = Hash::make($data['pwd']);
        }

        if ($request->hasFile('imageUser')) {
            Storage::disk('public')->delete((string) $user->picture_profile);
            $user->picture_profile = $request->file('imageUser')->store('profile_user', 'public');
        }

        $user->save();

        UserInfo::updateOrCreate(['user_id' => $user->id], [
            'nickname' => $data['nickname'] ?? null,
            'gender' => $data['gender'] ?? null,
            'bday' => $data['bday'] ?? null,
            'phone' => $data['phoneNumber'] ?? null,
            'job' => $data['job'] ?? null,
            'address' => $data['address'] ?? null,
        ]);

        $this->toast('Profil berhasil diperbarui!');

        return back();
    }
}
