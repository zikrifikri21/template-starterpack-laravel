<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Userlevel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserRoleManageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('superadmin/roles', [
            'level' => Userlevel::with('user:id,username,picture_profile,user_role_id')->get()->map(fn (Userlevel $l) => [
                'id' => $l->id,
                'nama' => $l->nama,
                'users' => $l->user->map(fn ($u) => ['id' => $u->id, 'username' => $u->username, 'avatar' => $u->avatarUrl()]),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Userlevel::create($request->validate(['nama' => 'required|min:3']));
        $this->toast('Berhasil menambahkan level');

        return back();
    }

    public function update(Request $request, Userlevel $user_role_manage): RedirectResponse
    {
        $user_role_manage->update($request->validate(['nama' => 'required']));
        $this->toast('Berhasil memperbarui nama role!');

        return back();
    }

    public function destroy(Userlevel $user_role_manage): RedirectResponse
    {
        // user.user_role_id is ON DELETE CASCADE: deleting a used role would silently delete its users.
        if ($user_role_manage->user()->exists()) {
            $this->toast('Role masih dipakai oleh user; pindahkan user ke role lain terlebih dahulu.', 'error');

            return back();
        }

        $user_role_manage->delete();
        $this->toast('Berhasil dihapus!');

        return back();
    }
}
