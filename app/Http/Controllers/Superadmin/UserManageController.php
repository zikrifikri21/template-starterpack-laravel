<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Userlevel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserManageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('superadmin/users', [
            'list' => User::with('user_role:id,nama')->get(['id', 'username', 'email', 'picture_profile', 'user_role_id'])
                ->map(fn (User $u) => [...$u->only('id', 'username', 'email', 'user_role_id'), 'role' => $u->user_role?->nama, 'avatar' => $u->avatarUrl()]),
            'levels' => Userlevel::pluck('nama', 'id'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, null);
        $data['password'] = Hash::make($data['password']);
        User::create($data);
        $this->toast('Data Berhasil Dimasukkan');

        return back();
    }

    public function update(Request $request, User $info): RedirectResponse
    {
        $data = $this->validated($request, $info);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        if (isset($data['picture_profile'])) {
            $this->deleteLegacy($info->picture_profile);
        }

        $info->update($data);
        $this->toast('Berhasil memperbarui user!');

        return back();
    }

    /** Legacy deleted a checkbox selection (ids[]) through AJAX; same, via Inertia. */
    public function destroy(Request $request): RedirectResponse
    {
        $ids = array_diff((array) $request->validate(['ids' => 'required|array', 'ids.*' => 'uuid'])['ids'], [$request->user()->id]);

        foreach (User::whereKey($ids)->get() as $user) {
            $this->deleteLegacy($user->picture_profile);
            $user->delete();
        }

        $this->toast('User berhasil dihapus.');

        return back();
    }

    /** @return array<string, mixed> */
    private function validated(Request $request, ?User $user): array
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'min:3', 'regex:/^\S*$/u', Rule::unique('user', 'username')->ignore($user)],
            'email' => ['required', 'email', Rule::unique('user', 'email')->ignore($user)],
            'password' => [$user ? 'nullable' : 'required', 'min:6'],
            'user_role_id' => 'required|exists:user_role,id',
            'picture_profile' => 'nullable|image|mimes:jpg,jpeg,png|max:5048',
        ]);

        if ($request->hasFile('picture_profile')) {
            $data['picture_profile'] = $this->storeLegacy($request->file('picture_profile'), 'profile_user', $request->user()->id.'-'.time());
        } else {
            unset($data['picture_profile']);
        }

        return $data;
    }
}
